import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function evaluateGraphemesBatchWithGemini(userResponses, language) {
  if (!userResponses || Object.keys(userResponses).length === 0) {
    return {
      individualResults: [],
      overallScore: 0,
      rawResponse: "No responses provided.",
    };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const langName =
    language === "ta" ? "Tamil" : language === "hi" ? "Hindi" : "English";

  let promptBody =
    `You will evaluate a list of user attempts to pronounce letters (graphemes).\n` +
    `The user's spoken input has been converted to text.\n` +
    `Consider common speech-to-text inaccuracies (e.g., 'eye' for 'I', 'are' for 'R', 'you' for 'U', 'sea' for 'C') and phonetic similarities.\n due to poor speech to text for example consider even 'jake' for j as correct\n\n` +
    `'jay' gets full 1 score, 'jake' gets 0.5 for j. 'aye' for i and 'eye' for i both get 1 score.` +
    `Input items (Letter: Spoken Text):\n`;

  const lettersForPrompt = [];
  Object.entries(userResponses).forEach(([letter, spoken], index) => {
    lettersForPrompt.push({
      originalLetter: letter,
      spoken: spoken || "",
      index: index + 1,
    });
    promptBody += `Item ${
      index + 1
    }: Expected Letter: "${letter}", Spoken Text: "${
      spoken || "No response"
    }", Language: ${langName}\n`;
  });

  promptBody +=
    "\nInstructions for your response:\n" +
    "For each item, provide your evaluation on a new line in the format: 'Item [item_number]: [score]|[status]|[feedback_term]'\n" +
    "   - '[item_number]' is the 1-based index of the item from the input list.\n" +
    "   - '[score]' must be a number: 1 for a clear correct match, 0.5 for a common phonetic confusion or plausible speech-to-text error, 0 for incorrect or skipped.\n" +
    "   - '[status]' should be one of: 'correct', 'confused', 'wrong', 'skipped'.\n" +
    "After evaluating all items, on a final separate line, provide the total sum of all scores in the format: 'OverallScore: [sum]'\n\n" +
    "Example Response Structure (for 2 items):\n" +
    "Item 1: 1|correct|good\n" +
    "Item 2: 0.5|confused|phonetic error\n" +
    "OverallScore: 1.5\n\n" +
    "Begin Evaluation:\n";

  try {
    const result = await model.generateContent({
      contents: [{ parts: [{ text: promptBody }] }],
    });

    const rawResponse = result.response.text();
    const lines = rawResponse.trim().split("\n");
    const individualResults = [];
    let overallScore = 0;

    const itemRegex =
      /^Item (\d+):\s*([0-1](\.[05])?)\s*\|\s*(\w+)\s*\|\s*(.+)$/;
    const scoreRegex = /^OverallScore:\s*([0-9.]+)$/;

    for (const line of lines) {
      const itemMatch = line.match(itemRegex);
      const scoreMatch = line.match(scoreRegex);

      if (itemMatch) {
        const itemNumber = parseInt(itemMatch[1]);
        const score = parseFloat(itemMatch[2]);
        const status = itemMatch[4].trim().toLowerCase();
        const feedback = itemMatch[5].trim();

        const originalItem = lettersForPrompt.find(
          (p) => p.index === itemNumber
        );
        if (originalItem) {
          individualResults.push({
            letter: originalItem.originalLetter,
            spokenOriginal: originalItem.spoken,
            score: score,
            status: status,
            feedback: feedback,
            itemNumber: itemNumber,
          });
        }
      } else if (scoreMatch) {
        overallScore = parseFloat(scoreMatch[1]);
      }
    }

    individualResults.sort((a, b) => a.itemNumber - b.itemNumber);

    if (
      !lines.some((line) => scoreRegex.test(line)) &&
      individualResults.length > 0
    ) {
      overallScore = individualResults.reduce(
        (sum, item) => sum + (item.score || 0),
        0
      );
    }

    return { individualResults, overallScore, rawResponse };
  } catch (err) {
    const fallbackResults = lettersForPrompt.map((item) => ({
      letter: item.originalLetter,
      spokenOriginal: item.spoken,
      score: 0,
      status: "error",
      feedback: "Gemini evaluation failed",
    }));
    return {
      individualResults: fallbackResults,
      overallScore: 0,
      rawResponse: `Error: ${err.message}`,
    };
  }
}

export async function POST(req) {
  try {
    const { childId, userResponses, language } = await req.json();

    // Validate childId
    if (!childId || typeof childId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing childId" },
        { status: 400 }
      );
    }

    if (
      !userResponses ||
      typeof userResponses !== "object" ||
      Object.keys(userResponses).length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid or empty 'userResponses' format. Expected a non-empty object.",
        },
        { status: 400 }
      );
    }

    const {
      individualResults: geminiProcessedResponses,
      overallScore: geminiTotalScore,
      rawResponse: geminiRawResponse,
    } = await evaluateGraphemesBatchWithGemini(userResponses, language);

    // Ensure score is properly converted to decimal and childId is valid
    const scoreAsDecimal = parseFloat(geminiTotalScore.toString());

    // Validate the score
    if (isNaN(scoreAsDecimal)) {
      return NextResponse.json(
        { error: "Invalid score calculated" },
        { status: 500 }
      );
    }

    // Check for recent submissions to detect duplicates
    const recentSubmissions = await prisma.graphemeTestResult.findMany({
      where: {
        childId: childId,
        createdAt: {
          gte: new Date(Date.now() - 60000), // Last 1 minute
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const dataToSave = {
      childId: childId,
      results: JSON.stringify(geminiProcessedResponses),
      score: scoreAsDecimal,
      testName: "Grapheme/Phoneme Test",
    };

    let result;
    try {
      result = await prisma.graphemeTestResult.create({
        data: dataToSave,
      });

      // Verify what was actually saved by reading it back
      const verifyResult = await prisma.graphemeTestResult.findUnique({
        where: { id: result.id },
      });
    } catch (dbError) {
      return NextResponse.json(
        {
          error: "Failed to save test results to database",
          details: dbError.message,
        },
        { status: 500 }
      );
    }

    try {
      await prisma.children.update({
        where: { id: childId },
        data: { testsTaken: { increment: 1 } },
      });
    } catch (updateError) {
      // Don't fail the entire request if this update fails
    }

    const totalPossibleScore = Object.keys(userResponses).length;

    // Calculate number of correct answers for display (score >= 0.5 counts as correct)
    const correctCount = geminiProcessedResponses.filter(
      (result) => result.score >= 0.5
    ).length;

    return NextResponse.json(
      {
        message: "Grapheme evaluation complete with AI.",
        resultsId: result.id,
        processedResponses: geminiProcessedResponses,
        score: correctCount, // Number of correct answers for display
        rawScore: scoreAsDecimal, // Keep the decimal score for database storage
        totalPossibleScore: totalPossibleScore,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
