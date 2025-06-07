import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { childId, score } = await req.json();

    // Insert the sequence test result
    const result = await prisma.sequenceTestResult.create({
      data: {
        childId,
        score,
        testName: "Sequential Memory Test",
      },
    });

    // Increment testsTaken for the child
    await prisma.children.update({
      where: { id: childId },
      data: { testsTaken: { increment: 1 } },
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error("Error adding sequence test:", error);
    return NextResponse.json(
      {
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
