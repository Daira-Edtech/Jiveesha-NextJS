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
    const child = await prisma.children.findUnique({
      where: { id: childId },
    });
    if (!child) {
      return NextResponse.json({ message: "Child not found" }, { status: 404 });
    }
    return NextResponse.json({ child });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}