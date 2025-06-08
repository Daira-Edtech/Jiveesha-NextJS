import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const childId = searchParams.get("childId");

  if (!childId) {
    return NextResponse.json({ error: "Missing childId" }, { status: 400 });
  }

  try {
    const tests = await prisma.readingProficiencyTestResult.findMany({
      where: { childId },
    });

    const testsWithNames = tests.map((test) => ({
      ...test,
      testName: "Reading Proficiency Test",
    }));

    return NextResponse.json({ tests: testsWithNames }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tests:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
