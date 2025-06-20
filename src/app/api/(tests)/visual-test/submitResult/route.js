import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  let body;
  try {
    body = await req.json();
    const { childId, options, score } = body;

    const optionsString = Array.isArray(options)
      ? JSON.stringify(options)
      : options;

    const test = await prisma.visualTestResult.create({
      data: {
        childId,
        options: optionsString,
        score,
        testName: "Visual Discrimination Test",
      },
    });

    await prisma.children.update({
      where: { id: childId },
      data: { testsTaken: { increment: 1 } },
    });
    return NextResponse.json(
      {
        message: "Visual Discrimination Test added successfully",
        test,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in visual test submit:", error);
    console.error("Request body:", body);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
