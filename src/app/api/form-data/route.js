import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { withAuth } from "@/lib/auth-utils";
import formData from "@/Data/formData.json";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function evaluateFormWithGemini(questionAnswerPairs) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    You are an educational assessment expert. Analyze the following form responses for a child's educational and developmental assessment.
    Each item contains the question label, type, and the user's answer.

    Form Responses:
    ${JSON.stringify(questionAnswerPairs, null, 2)}

    Please provide a comprehensive analysis including:
    1. Overall developmental assessment
    2. Key strengths identified
    3. Areas that may need attention
    4. Recommended learning approaches
    5. Potential learning style preferences
    6. Any concerning patterns or positive indicators
    7. Suggestions for parents and teachers

    Format your response as a structured JSON object with the following fields:
    {
      "overallAssessment": "Brief overall assessment",
      "strengths": ["list", "of", "strengths"],
      "areasOfConcern": ["list", "of", "areas", "needing", "attention"],
      "learningStyle": "Identified learning style preferences",
      "recommendations": {
        "forParents": ["list", "of", "recommendations"],
        "forTeachers": ["list", "of", "recommendations"]
      },
      "riskFactors": ["any", "identified", "risk", "factors"],
      "positiveIndicators": ["positive", "developmental", "indicators"],
      "nextSteps": ["suggested", "next", "steps"]
    }

    Be thorough but concise, and focus on actionable insights.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON response:", parseError);
    }

    return {
      overallAssessment: text,
      strengths: [],
      areasOfConcern: [],
      learningStyle: "Analysis pending",
      recommendations: {
        forParents: [],
        forTeachers: [],
      },
      riskFactors: [],
      positiveIndicators: [],
      nextSteps: [],
    };
  } catch (error) {
    console.error("Gemini evaluation error:", error);
    return {
      overallAssessment: "Automated analysis failed. Manual review required.",
      strengths: [],
      areasOfConcern: [],
      learningStyle: "Manual assessment needed",
      recommendations: {
        forParents: ["Consult with educational specialist"],
        forTeachers: ["Conduct manual assessment"],
      },
      riskFactors: [],
      positiveIndicators: [],
      nextSteps: ["Schedule professional assessment"],
    };
  }
}

async function postHandler(req, context, { userId, user }) {
  try {
    const body = await req.json();
    const { childId, responses, formVersion = "1.0" } = body;

    const questionAnswerPairs = formData.questions.map((q) => ({
      label: q.label,
      name: q.name,
      type: q.type,
      value: responses[q.name] ?? null,
    }));

    let child;

    if (childId) {
      child = await prisma.children.findFirst({
        where: {
          id: childId,
          teacherId: userId,
        },
      });

      if (!child) {
        return NextResponse.json(
          { message: "Child not found or unauthorized" },
          { status: 404 }
        );
      }
    } else {
      const childName = responses.childName;
      const childDob = responses.childDob;
      const gender = responses.gender;

      if (!childName || !childDob || !gender) {
        return NextResponse.json(
          {
            message:
              "Missing required child information (name, date of birth, gender)",
          },
          { status: 400 }
        );
      }

      const rollNumber = `STU${Date.now()}`;

      child = await prisma.children.create({
        data: {
          name: childName,
          rollno: rollNumber,
          dateOfBirth: new Date(childDob),
          gender: gender,
          teacherId: userId,
        },
      });
    }

    const geminiAnalysis = await evaluateFormWithGemini(questionAnswerPairs);
    const formResponse = await prisma.childFormResponse.create({
      data: {
        childId: child.id,
        responses: responses,
        formVersion,
      },
    });
    const analysis = await prisma.childFormAnalysis.create({
      data: {
        childId: child.id,
        formResponseId: formResponse.id,
        overallAssessment: geminiAnalysis.overallAssessment,
        strengths: geminiAnalysis.strengths,
        areasOfConcern: geminiAnalysis.areasOfConcern,
        learningStyle: geminiAnalysis.learningStyle,
        recommendations: geminiAnalysis.recommendations,
        riskFactors: geminiAnalysis.riskFactors,
        positiveIndicators: geminiAnalysis.positiveIndicators,
        nextSteps: geminiAnalysis.nextSteps,
      },
    });

    return NextResponse.json(
      {
        message: "Form submitted successfully",
        data: {
          child,
          formResponse,
          analysis: analysis,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { message: "Error submitting form", error: error.message },
      { status: 500 }
    );
  }
}

export const POST = withAuth(postHandler);
