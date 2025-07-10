import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let testMetaData = {};
(async () => {
  try {
    const data = await readFile(
      path.join(process.cwd(), "src", "Data", "testMetaData.json"),
      "utf-8"
    );
    testMetaData = JSON.parse(data);
  } catch (err) {
    console.error("Failed to load testMetaData.json:", err);
  }
})();

export async function POST(req) {
  try {
    const { childId, results, total_score } = await req.json();

    if (!childId || !results || !Array.isArray(results)) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: childId and results array",
        },
        { status: 400 }
      );
    }

    // Format test results for analysis
    const formattedTestResults = results.map((result) => ({
      test_name: result.testName,
      score: result.score,
    }));

    // Get child's age from DB
    let age = null;
    try {
      const child = await prisma.children.findUnique({
        where: { id: childId },
        select: { dateOfBirth: true },
      });
      if (child && child.dateOfBirth) {
        const dob = new Date(child.dateOfBirth);
        const now = new Date();
        age =
          now.getFullYear() -
          dob.getFullYear() -
          (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate())
            ? 1
            : 0);
      }
    } catch (childError) {
      console.error("Error fetching child age:", childError);
    }

    // Generate analysis using Gemini
    let analysis_results = "Analysis not available.";
    try {
      const prompt = `
You are a clinical psychologist analyzing test results for a ${
        age ?? "?"
      }-year-old child. Based on the data below, write a well-structured and professional **Overall Assessment** section of a clinical report.

---

### 🧪 Test Results:
${formattedTestResults
  .map((test) => {
    const meta = testMetaData[test.test_name];
    const score = test.score;
    let performanceMessage = "Performance unclear due to missing data.";
    if (score !== null && score !== undefined && meta && meta.scoreRange) {
      const { strong, difficulty } = meta.scoreRange;
      if (score >= strong[0] && score <= strong[1]) {
        performanceMessage = meta.strongMessage || "Strong performance.";
      } else if (
        difficulty &&
        score >= difficulty[0] &&
        score <= difficulty[1]
      ) {
        performanceMessage = meta.description || "Area of difficulty.";
      } else {
        performanceMessage = "Score outside typical ranges.";
      }
    }
    return `- **${test.test_name}**: Score **${
      score ?? "N/A"
    }** – ${performanceMessage}`;
  })
  .join("\n")}

---

### 🧠 Instructions:
Write a detailed, paragraph-based **Overall Assessment** with the following features:

- Begin with a summary of the child’s **overall cognitive and academic profile**
- Discuss the child’s performance **relative to age norms**
- Identify any **notable strengths or difficulties**
- Highlight **patterns across test domains**, and how certain weaknesses (e.g., in auditory or visual processing) might affect others (e.g., reading, memory)
- Use **clinical, professional language**, but keep it **clear and readable**
- Format as **structured paragraphs with optional bullet points** (avoid one big block of text)

Only include the **"Overall Assessment"** section — do **not** add headings for other sections.
Start the clinical report below this line:
---
`;

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
        },
      });
      analysis_results = result.response.text();
    } catch (inferenceError) {
      console.error("Error generating analysis:", inferenceError);
    }

    // Store in Prisma
    const assessment = await prisma.continuousAssessment.create({
      data: {
        childId: childId,
        totalScore: total_score,
        testResults: JSON.stringify(formattedTestResults),
        analysis: analysis_results,
      },
    });

    // Increment testsTaken for the child
    await prisma.children.update({
      where: { id: childId },
      data: { testsTaken: { increment: 1 } },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Assessment results submitted successfully",
        data: {
          assessment_id: assessment.id,
          childId: childId,
          total_score: total_score,
          results_count: formattedTestResults.length,
          submitted_at: assessment.createdAt,
          analysis_results: analysis_results,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in submitResults:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
