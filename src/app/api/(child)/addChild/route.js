import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/auth-utils";

const prisma = new PrismaClient();

async function postHandler(req, context, { userId, user }) {
  try {
    const body = await req.json();
    const { name, rollno, dateOfBirth, gender } = body;

    const child = await prisma.children.create({
      data: {
        name,
        rollno,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        teacherId: userId,
      },
    });

    return NextResponse.json({ message: "Child added successfully", data: child }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error inserting child", error: error.message }, { status: 500 });
  }
}

export const POST = withAuth(postHandler);