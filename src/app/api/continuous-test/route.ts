// app/api/continuous-test/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Load test metadata once when the server starts
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

export async function POST(req: Request) {
  try {
    const { childId, score, options } = await req.json();

    if (!childId || score == null || !options) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const testResults = JSON.stringify(options);

    // Generate the detailed AI analysis
    const analysis = await generateAiAnalysis(childId, options);

    const result = await prisma.continuousAssessment.create({
      data: {
        childId,
        totalScore: score,
        testResults,
        analysis,
      },
    });
    console.log(result);

    // Optional: increment testsTaken count on the child record
    await prisma.children.update({
      where: { id: childId },
      data: { testsTaken: { increment: 1 } },
    });
    console.log("Continuous test saved successfully:", result);

    return NextResponse.json(
      {
        message: "Continuous test submitted successfully",
        assessmentId: result.id,
        score,
        analysis, // Return the analysis in the response
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving continuous test:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

async function generateAiAnalysis(
  childId: string,
  results: any[]
): Promise<string> {
  // 1. Get child's age from DB
  let age: number | null = null;
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

  // 2. Format test results for the prompt
  const formattedTestResults = results.map((result) => ({
    // Assuming the incoming 'options'/'results' have a 'testName' and 'data.score' property
    test_name: result.testName,
    score: result.data?.score,
  }));

  // 3. Build the detailed prompt
  const prompt = `
You are a clinical psychologist analyzing test results for a ${
    age ?? "?"
  }-year-old child. Based on the data below, write a well-structured and professional Overall Assessment section of a clinical report.

---

Test Results:
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
    return `- ${test.test_name}: Score ${
      score ?? "N/A"
    } – ${performanceMessage}`;
  })
  .join("\n")}

---

Instructions:
Write a detailed, paragraph-based Overall Assessment with the following features:

- Begin with a summary of the child’s overall cognitive and academic profile
- Discuss the child’s performance relative to age norms
- Identify any notable strengths or difficulties
- Highlight patterns across test domains, and how certain weaknesses (e.g., in auditory or visual processing) might affect others (e.g., reading, memory)
- Use clinical, professional language, but keep it clear and readable
- Format as structured paragraphs with optional bullet points (avoid one big block of text)

**Important:** Do not use any markdown, asterisks (**), or other special formatting characters in your output. Write plain text only.

Only include the "Overall Assessment" section — do not add headings for other sections.
Start the clinical report below this line:
---
`;

  // 4. Call the Gemini API
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    // Correctly pass the prompt string directly to the model
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (inferenceError) {
    console.error("Error generating analysis:", inferenceError);
    return "AI analysis could not be generated at this time.";
  }
}
