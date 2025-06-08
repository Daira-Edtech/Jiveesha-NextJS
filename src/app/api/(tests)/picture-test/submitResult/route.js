import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const evaluateResponse = async (userInput, correctAnswer, language = "en") => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  if (!userInput) {
    return { score: 0, feedback: "No description provided" };
  }

  const prompts = {
    en: `Evaluate if this description is correct for an image of '${correctAnswer}': ${userInput}. Respond with either "1|Correct" or "0|Incorrect".`,
    ta: `மதிப்பீடு செய்யுங்கள்: '${correctAnswer}' படத்திற்கான இந்த விளக்கம் சரியானதா? ${userInput}. "1|சரி" அல்லது "0|தவறு" என பதிலளிக்கவும்.`,
    hi: `इस चित्र '${correctAnswer}' के लिए दिया गया वर्णन सही है या नहीं मूल्यांकन करें: ${userInput}. कृपया "1|सही" या "0|गलत" में उत्तर दें।`,
  };

  const prompt = prompts[language] || prompts.en;

  try {
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const textResponse = result.response.text().trim();
    const [score, feedback] = textResponse.split("|");

    if (score !== undefined && feedback !== undefined) {
      return {
        score: parseInt(score),
        feedback: feedback.trim(),
      };
    } else {
      return { score: 0, feedback: "Invalid response format" };
    }
  } catch (err) {
    return { score: 0, feedback: "Evaluation error" };
  }
};

export async function POST(req) {
  try {
    const { childId, answers } = await req.json();
    const processedResponses = [];
    let totalScore = 0;

    for (const item of answers) {
      const isCorrect =
        item.userAnswer.trim().toLowerCase() ===
        item.correctAnswer.trim().toLowerCase();
      const answerScore = isCorrect ? 1 : 0;

      const { score: descriptionScore, feedback } = await evaluateResponse(
        item.description,
        item.correctAnswer,
        item.language
      );

      const imageTotal = answerScore + descriptionScore;
      totalScore += imageTotal;

      processedResponses.push({
        image: item.image,
        userAnswer: item.userAnswer,
        correctAnswer: item.correctAnswer,
        description: item.description,
        language: item.language,
        answerScore,
        descriptionScore,
        totalForThisImage: imageTotal,
        feedback,
      });
    }

    totalScore = Number((totalScore / 2).toFixed(2)); // Max score per image is 2

    const result = await prisma.pictureTestResult.create({
      data: {
        childId: childId,
        responses: JSON.stringify(processedResponses),
        score: totalScore,
        testName: "Picture Recognition Test",
      },
    });

    await prisma.children.update({
      where: { id: childId },
      data: { testsTaken: { increment: 1 } },
    });

    return NextResponse.json(
      {
        id: result.id,
        message: "Test stored successfully",
        totalScore,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
