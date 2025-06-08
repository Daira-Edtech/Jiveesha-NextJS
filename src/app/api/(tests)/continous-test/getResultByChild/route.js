import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const child_id = searchParams.get("childId");

  if (!child_id) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing required field: child_id",
      },
      { status: 400 }
    );
  }

  try {
    const data = await prisma.continuousAssessment.findMany({
      where: { childId: child_id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getContinuousAssessmentResultsByChildId:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
