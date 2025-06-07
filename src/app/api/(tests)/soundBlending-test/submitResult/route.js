import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { childId, totalScore, responses, normalized_score } =
      await req.json();

    const result = await prisma.soundBlendingResult.create({
      data: {
        childId,
        totalScore,
        responses: JSON.stringify(responses),
        score: normalized_score,
        testName: "Sound Blending Test",
      },
    });

    await prisma.children.update({
      where: { id: childId },
      data: { testsTaken: { increment: 1 } },
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
