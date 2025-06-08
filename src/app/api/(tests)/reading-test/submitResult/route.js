import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    let { childId, spokenWords, language } = await req.json();

    if (!language || !["en", "ta", "hi"].includes(language)) {
      return NextResponse.json(
        { message: "Invalid or missing language. Use 'en', 'ta', or 'hi'." },
        { status: 400 }
      );
    }

    if (!childId || childId.trim() === "" || childId === "undefined") {
      childId = Math.floor(100000 + Math.random() * 900000).toString();
    }

    if (!spokenWords || typeof spokenWords !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing spokenWords" },
        { status: 400 }
      );
    }

    spokenWords = spokenWords.replace(/,/g, "").trim();

    const filePath = path.join(process.cwd(), "src", "Data", "wordLists.json");

    const data = await fs.readFile(filePath, "utf-8");
    const wordLists = JSON.parse(data);

    const correctWordsList = (wordLists[language] || []).map((word) =>
      word.toLowerCase()
    );
    const spokenArray = spokenWords.split(/\s+/).map((word, index) => ({
      word: word.toLowerCase(),
      position: index + 1,
    }));

    let correctGroups = [];
    let errorWords = [];
    let currentCorrectGroup = [];

    spokenArray.forEach(({ word, position }, idx) => {
      if (correctWordsList.includes(word)) {
        currentCorrectGroup.push({ word, position });
      } else {
        if (currentCorrectGroup.length > 0) {
          correctGroups.push(currentCorrectGroup);
          currentCorrectGroup = [];
        }
        errorWords.push({ word, position });
      }
      if (idx === spokenArray.length - 1 && currentCorrectGroup.length > 0) {
        correctGroups.push(currentCorrectGroup);
      }
    });

    const formattedCorrectGroups = correctGroups.map((group) =>
      group.map(({ word, position }) => `${word}(${position})`).join(" ")
    );

    const formattedErrorWords = errorWords.map(
      ({ word, position }) => `${word}(${position})`
    );

    const totalCorrectWords = correctGroups.reduce(
      (acc, group) => acc + group.length,
      0
    );
    const score = (totalCorrectWords / correctWordsList.length) * 100;

    await prisma.readingProficiencyTestResult.create({
      data: {
        childId,
        spokenWords,
        correctWords: JSON.stringify(formattedCorrectGroups),
        incorrectWords: JSON.stringify(errorWords),
        score: Number(score.toFixed(2)),
        testName: {
          en: "Reading English Test",
          ta: "Reading Tamil Test",
          hi: "Reading Hindi Test",
        }[language],
      },
    });

    await prisma.children.update({
      where: { id: childId },
      data: { testsTaken: { increment: 1 } },
    });

    return NextResponse.json(
      {
        message: "Test processed successfully",
        childId,
        score: score.toFixed(2),
        correctGroups: formattedCorrectGroups,
        errorWords: formattedErrorWords,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
