import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { childId, difficulty, level, score, totalRounds } = body;

    if (!childId || score == null || level == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the symbol sequence result
    const result = await prisma.symbolSequenceResult.create({
      data: {
        childId,
        difficulty,
        level,
        score,
        totalRounds,
        testName: "Symbol Sequence Test",
      },
    });

    // Increment testsTaken for the child
    await prisma.children.update({
      where: { id: childId },
      data: { testsTaken: { increment: 1 } },
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
