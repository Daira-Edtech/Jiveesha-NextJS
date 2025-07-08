// app/api/continuous-test/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { childId, score, options } = await req.json();

    if (!childId || score == null || !options) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const testResults = JSON.stringify(options);

    const analysis = generateBasicAnalysis(options, score); // optional

    const result = await prisma.continuousAssessment.create({
      data: {
        childId,
        totalScore: score,
        testResults,
        analysis,
      },
    });
    console.log(result);

    // Optional: increment testsTaken count on the child record
    await prisma.children.update({
      where: { id: childId },
      data: { testsTaken: { increment: 1 } },
    });
    console.log("Continuous test saved successfully:", result);


    return NextResponse.json(
      {
        message: "Continuous test submitted successfully",
        assessmentId: result.id,
        score,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving continuous test:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

function generateBasicAnalysis(options: any, score: number): string {
  const total = Array.isArray(options) ? options.length : 0;
  return `Submitted with ${total} responses. Final score: ${score}`;
}
