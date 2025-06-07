import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/auth-utils";

const prisma = new PrismaClient();

async function getHandler(req, context, { userId, user }) {
  try {
    const children = await prisma.children.findMany({
      where: { teacherId: userId },
    });
    
    return NextResponse.json({ children });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler);