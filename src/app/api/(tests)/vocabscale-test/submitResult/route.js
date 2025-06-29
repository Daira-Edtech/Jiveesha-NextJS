import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import vocabularyWords from "@/Data/vocabularyWords";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildPrompt(word, definition, language = "en") {
  const basePrompt = `
Evaluate the child's definition of the word.

Word: "${word}"
Child's Definition: "${definition}"

Instructions:
1. Give a score — 1 if the definition is correct, 0 if incorrect or unrelated.
2. Provide a short feedback explaining why.
3. Respond ONLY in this format: <score>|<feedback>

Example:
1|Good definition, clearly captures the meaning of the word.
`;

  const prompts = {
    en: basePrompt,
    ta: `
முக்கியத்துவம்: இந்த வார்த்தைக்கு ஒரு குழந்தை தமிழில் விளக்கம் அளிக்கிறாள்.

வார்த்தை: "${word}"
குழந்தையின் விளக்கம்: "${definition}"

தயவுசெய்து பின்வரும் படியில் மதிப்பீடு செய்யவும்:
1. விளக்கம் சரியானதா என 0 அல்லது 1 மதிப்பெண் அளிக்கவும்
2. ஏன் என்பதைச் சொல்லும் ஒரு வாக்கியம் எழுதவும்
3. பதிலின் வடிவம்: <score>|<feedback> மாதிரியாக இருக்க வேண்டும்

உதாரணம்:
1|விளக்கம் சரியானது, சரியான நோக்கத்தில் உள்ளது.
`,
    hi: `
शब्द: "${word}"
बच्चे की परिभाषा: "${definition}"

कार्य:
1. यदि परिभाषा सही है तो 1 दें, गलत है तो 0 दें।
2. प्रतिक्रिया दें कि क्यों सही या गलत है।
3. केवल इस प्रारूप में उत्तर दें: <score>|<feedback>

उदाहरण:
1|परिभाषा सटीक है और अर्थ स्पष्ट है।
`,
  };

  return prompts[language] || prompts.en;
}

async function evaluateDefinition(word, definition, language = "en") {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  if (!definition?.trim()) {
    return { score: 0, feedback: "No definition provided" };
  }

  const prompt = buildPrompt(word, definition, language);

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const match = responseText.match(/^([01])\|(.*)$/);
    if (!match) {
      return {
        score: 0,
        feedback: "Unable to evaluate definition properly.",
      };
    }

    const score = parseInt(match[1], 10);
    const feedback = match[2].trim();

    return { score, feedback };
  } catch (err) {
    console.error("Gemini error:", err);
    return { score: 0, feedback: "Evaluation error occurred." };
  }
}

export async function POST(req) {
  try {
    const { childId, responses, language } = await req.json();
    console.log();
    if (!childId || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: "Missing childId or responses" },
        { status: 400 },
      );
    }

    let totalScore = 0;
    const processedResponses = [];

    for (const { word, definition } of responses) {
      const wordDetail = vocabularyWords.find((w) => w.word === word);
      const { score, feedback } = await evaluateDefinition(
        word,
        definition,
        language,
      );

      totalScore += score;
      processedResponses.push({
        word,
        level: wordDetail?.level || "Unknown",
        definition,
        score,
        feedback,
        translation: wordDetail?.[language] || wordDetail?.en || word,
      });
    }

    const result = await prisma.vocabularyTestResult.create({
      data: {
        childId: childId,
        responses: JSON.stringify(processedResponses),
        score: totalScore,
        testName: "Vocabulary Scale",
      },
    });

    await prisma.children.update({
      where: { id: childId },
      data: { testsTaken: { increment: 1 } },
    });

    return NextResponse.json(
      {
        id: result.id,
        message: "Vocabulary test stored",
        score: totalScore,
        language: language || "en",
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
