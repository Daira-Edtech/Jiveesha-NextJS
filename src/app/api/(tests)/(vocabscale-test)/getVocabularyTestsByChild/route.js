import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const childId = searchParams.get("childId");

  if (!childId) {
    return NextResponse.json({ message: "Missing childId" }, { status: 400 });
  }

  try {
    const tests = await prisma.vocabularyTestResult.findMany({
      where: { childId },
    });

    return NextResponse.json({ tests });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
