import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import practiceWord from "@/Data/practiceWord";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildPracticePrompt(word, definition, language = "en") {
  const basePrompt = `
You are evaluating a child's definition of a word during a practice round to teach them how the test works.

Word: "${word}"
Child's Definition: "${definition}"

This is a PRACTICE round, so be encouraging and helpful. The child is learning how to take the test.

Instructions:
1. Give a score — 1 if the definition shows basic understanding of the word, 0 if completely wrong or empty.
2. Be more lenient than usual since this is practice - accept partial or simple definitions.
3. Provide encouraging feedback. If wrong, give a helpful hint about what the word means.
4. Respond ONLY in this format: <score>|<feedback>

Examples:
1|Great job! You understand what a cat is. That's exactly right!
0|Not quite right. A cat is a small furry animal that says "meow" and is often kept as a pet. Try again!
`;

  const prompts = {
    en: basePrompt,
    ta: `
பயிற்சி சுற்று: குழந்தை எப்படி தேர்வு எடுக்க வேண்டும் என்பதைக் கற்றுக் கொள்ள உதவுகிறோம்.

வார்த்தை: "${word}"
குழந்தையின் விளக்கம்: "${definition}"

இது பயிற்சி சுற்று, எனவே ஊக்கமளிக்கவும் உதவியாக இருக்கவும்.

வழிமுறைகள்:
1. சரியான புரிதல் இருந்தால் 1, முற்றிலும் தவறானால் 0
2. பயிற்சி என்பதால் கொஞ்சம் எளிதாக மதிப்பிடவும்
3. ஊக்கமளிக்கும் கருத்து அளிக்கவும்
4. வடிவம்: <score>|<feedback>

உதாரணம்:
1|அருமை! பூனை என்றால் என்ன என்று உங்களுக்குத் தெரியும். சரியாகச் சொன்னீர்கள்!
`,
    hi: `
अभ्यास राउंड: बच्चे को परीक्षा कैसे देनी है यह सिखाने के लिए।

शब्द: "${word}"
बच्चे की परिभाषा: "${definition}"

यह अभ्यास राउंड है, इसलिए प्रोत्साहित करें और मददगार बनें।

निर्देश:
1. समझ दिखाई तो 1, गलत हो तो 0
2. अभ्यास है इसलिए आसान करके देखें
3. प्रोत्साहित करने वाली प्रतिक्रिया दें
4. प्रारूप: <score>|<feedback>

उदाहरण:
1|बहुत अच्छा! आप जानते हैं कि बिल्ली क्या है। बिल्कुल सही!
`,
  };

  return prompts[language] || prompts.en;
}

async function evaluatePracticeDefinition(word, definition, language = "en") {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  if (!definition?.trim()) {
    return {
      score: 0,
      feedback: language === "ta" ? "விளக்கம் இல்லை. மீண்டும் முயற்சிக்கவும்!" :
               language === "hi" ? "कोई परिभाषा नहीं दी गई। फिर कोशिश करें!" :
               "No definition provided. Please try again!"
    };
  }

  const prompt = buildPracticePrompt(word, definition, language);

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const match = responseText.match(/^([01])\|(.*)$/);
    if (!match) {
      return {
        score: 0,
        feedback: language === "ta" ? "மீண்டும் முயற்சிக்கவும்!" :
                 language === "hi" ? "फिर कोशिश करें!" :
                 "Please try again!"
      };
    }

    const score = parseInt(match[1], 10);
    const feedback = match[2].trim();

    return { score, feedback };
  } catch (err) {
    console.error("Gemini error in practice evaluation:", err);
    return {
      score: 0,
      feedback: language === "ta" ? "தொழில்நுட்ப பிரச்சனை. மீண்டும் முயற்சிக்கவும்!" :
               language === "hi" ? "तकनीकी समस्या। फिर कोशिश करें!" :
               "Technical issue. Please try again!"
    };
  }
}

export async function POST(req) {
  try {
    const { definition, language } = await req.json();

    if (!definition) {
      return NextResponse.json(
        { error: "Missing definition" },
        { status: 400 }
      );
    }

    const { score, feedback } = await evaluatePracticeDefinition(
      practiceWord.word,
      definition,
      language || "en"
    );

    return NextResponse.json({
      score,
      feedback,
      word: practiceWord.word,
      isCorrect: score === 1
    });

  } catch (err) {
    console.error("Practice evaluation error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
