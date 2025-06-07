import { NextResponse } from "next/server";
import vocabularyWords from "@/Data/vocabularyWords";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const language = searchParams.get("language") || "en";

    const words = vocabularyWords.map((word) => ({
      word: word.word,
      level: word.level,
      translation: word[language] || word.en,
    }));

    return NextResponse.json({ words });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", message: error.message },
      { status: 500 }
    );
  }
}
