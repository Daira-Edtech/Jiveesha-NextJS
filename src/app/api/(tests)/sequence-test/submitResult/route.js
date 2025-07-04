import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { childId, score, total_questions, test_name } = await req.json();

    console.log("Received data:", {
      childId,
      score,
      total_questions,
      test_name,
    });

    // Validate required fields
    if (!childId) {
      return NextResponse.json(
        { message: "Child ID is required" },
        { status: 400 }
      );
    }

    if (score === undefined || score === null) {
      return NextResponse.json(
        { message: "Score is required" },
        { status: 400 }
      );
    }

    // Convert score to number to ensure compatibility with Decimal type
    const numericScore = Number(score);

    if (isNaN(numericScore)) {
      return NextResponse.json(
        { message: "Score must be a valid number" },
        { status: 400 }
      );
    }

    // Insert the sequence test result
    const result = await prisma.sequenceTestResult.create({
      data: {
        childId,
        score: numericScore,
        testName: test_name || "Sequential Memory Test",
      },
    });

    // Increment testsTaken for the child
    await prisma.children.update({
      where: { id: childId },
      data: { testsTaken: { increment: 1 } },
    });

    console.log("Successfully saved sequence test result:", result);

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error("Error adding sequence test:", error);

    // Check if it's a Prisma error
    if (error.code === "P2025") {
      return NextResponse.json({ message: "Child not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
