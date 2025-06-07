import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, rollno, dateOfBirth, gender } = body;
    const teacherId = req.headers.get("authorization"); // Replace with your auth logic

    if (!teacherId) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const child = await prisma.children.create({
      data: {
        name,
        rollno,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        teacherId,
      },
    });

    return NextResponse.json({ message: "Child added successfully", data: child }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error inserting child", error: error.message }, { status: 500 });
  }
}