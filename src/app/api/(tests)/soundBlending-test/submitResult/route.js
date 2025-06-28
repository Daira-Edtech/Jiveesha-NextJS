import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { childId, score, total_questions, test_name, responses } =
      await req.json();

    const result = await prisma.soundBlendingResult.create({
      data: {
        childId,
        totalScore: total_questions,
        responses: JSON.stringify(responses || {}),
        score: score,
        testName: test_name,
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
