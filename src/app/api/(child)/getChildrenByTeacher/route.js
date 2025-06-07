import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const teacherId = req.headers.get("authorization"); // Replace with your auth logic

  if (!teacherId) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
  }

  try {
    const children = await prisma.children.findMany({
      where: { teacherId },
    });
    return NextResponse.json({ children });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}