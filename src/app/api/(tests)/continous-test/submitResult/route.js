import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Load test metadata (sync at module load)
let testMetaData = {};
(async () => {
  try {
    const data = await readFile(path.join(process.cwd(), "Data", "testMetaData.json"), "utf-8");
    testMetaData = JSON.parse(data);
  } catch (err) {
    console.error("Failed to load testMetaData.json:", err);
  }
})();

export async function POST(req) {
  try {
    const { child_id, results, total_score } = await req.json();

    if (!child_id || !results || !Array.isArray(results)) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields: child_id and results array"
      }, { status: 400 });
    }

    // Format test results for analysis
    const formattedTestResults = results.map(result => ({
      test_name: result.name,
      score: result.score,
    }));

    // Get child's age from DB
    let age = null;
    try {
      const child = await prisma.children.findUnique({
        where: { id: child_id },
        select: { dateOfBirth: true }
      });
      if (child && child.dateOfBirth) {
        const dob = new Date(child.dateOfBirth);
        const now = new Date();
        age = now.getFullYear() - dob.getFullYear() - (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
      }
    } catch (childError) {
      console.error("Error fetching child age:", childError);
    }

    // Generate analysis using Gemini
    let analysis_results = "Analysis not available.";
    try {
      const prompt = `
Analyze these test results for a ${age ?? "?"}-year-old child and provide a CONCISE clinical assessment.

### Test Results:
${formattedTestResults
  .map((test) => {
    const meta = testMetaData[test.test_name];
    const score = test.score;
    let performanceMessage = "Performance unclear due to missing data.";
    if (score !== null && score !== undefined && meta && meta.scoreRange) {
      const { strong, difficulty } = meta.scoreRange;
      if (score >= strong[0] && score <= strong[1]) {
        performanceMessage = meta.strongMessage || "Strong performance.";
      } else if (difficulty && score >= difficulty[0] && score <= difficulty[1]) {
        performanceMessage = meta.description || "Area of difficulty.";
      } else {
        performanceMessage = "Score outside typical ranges.";
      }
    }
    return `- ${test.test_name}: Score ${score ?? "N/A"}, ${performanceMessage}`;
  })
  .join("\n")}

### Instructions:
Write ONE PARAGRAPH (5-6 lines maximum) that:
1. Integrates all test results into a cohesive clinical assessment
2. Highlights key strengths and potential concerns based on age-appropriate norms
3. Uses professional clinical language while remaining concise
4. Provides actionable insights for next steps or focus areas

Do NOT use bullet points. Maintain a professional clinical tone throughout.`;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
      });
      analysis_results = result.response.text();
    } catch (inferenceError) {
      console.error('Error generating analysis:', inferenceError);
    }

    // Store in Prisma
    const assessment = await prisma.continuousAssessment.create({
      data: {
        childId: child_id,
        totalScore: total_score,
        testResults: JSON.stringify(formattedTestResults),
        analysis: analysis_results
      }
    });

    // Increment testsTaken for the child
    await prisma.children.update({
      where: { id: child_id },
      data: { testsTaken: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      message: "Assessment results submitted successfully",
      data: {
        assessment_id: assessment.id,
        child_id: child_id,
        total_score: total_score,
        results_count: formattedTestResults.length,
        submitted_at: assessment.createdAt,
        analysis_results: analysis_results
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error in submitResults:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: error.message
    }, { status: 500 });
  }
}