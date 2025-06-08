import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { childId, score, forwardCorrect, reverseCorrect } = await req.json();

    const result = await prisma.auditoryMemoryTestResult.create({
      data: {
        childId,
        score,
        forwardCorrect,
        reverseCorrect,
        testName: "Auditory Sequential Memory Test",
      },
    });

    await prisma.children.update({
      where: { id: childId },
      data: { testsTaken: { increment: 1 } },
    });

    return NextResponse.json(
      {
        message: "Test13 processed successfully",
        childId,
        score,
        forwardCorrect,
        reverseCorrect,
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
