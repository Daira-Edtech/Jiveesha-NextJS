import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/auth-utils";

const prisma = new PrismaClient();

async function getHandler(req, context, { userId, user }) {
  const { searchParams } = new URL(req.url);
  const childId = searchParams.get("childId");

  if (!childId) {
    return NextResponse.json({ message: "Missing childId" }, { status: 400 });
  }

  try {
    const child = await prisma.children.findFirst({
      where: { 
        id: childId,
        teacherId: userId
      },
    });
    
    if (!child) {
      return NextResponse.json({ message: "Child not found or not authorized" }, { status: 404 });
    }
    
    return NextResponse.json({ child });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler);