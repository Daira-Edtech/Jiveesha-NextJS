import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TEST_MODELS = [
  {
    model: "readingProficiencyTestResult",
    type: "reading",
    name: "Reading Proficiency Test",
    endpoint: "reading-test",
  },
  {
    model: "visualTestResult",
    type: "visual",
    name: "Visual Discrimination",
    endpoint: "visual-test",
  },
  {
    model: "soundDiscriminationTestResult",
    type: "sound",
    name: "Sound Discrimination",
    endpoint: "sound-test",
  },
  {
    model: "auditoryMemoryTestResult",
    type: "auditory",
    name: "Auditory Memory",
    endpoint: "auditory-test",
  },
  {
    model: "graphemeTestResult",
    type: "grapheme",
    name: "Grapheme Matching",
    endpoint: "grapheme-test",
  },
  {
    model: "pictureTestResult",
    type: "picture",
    name: "Picture Recognition",
    endpoint: "picture-test",
  },
  {
    model: "sequenceTestResult",
    type: "sequence",
    name: "Sequence Arrangement",
    endpoint: "sequence-test",
  },
  {
    model: "soundBlendingResult",
    type: "soundBlending",
    name: "Sound Blending",
    endpoint: "soundBlending-test",
  },
  {
    model: "symbolSequenceResult",
    type: "symbol",
    name: "Symbol Sequence",
    endpoint: "symbolsequence-test",
  },
  {
    model: "vocabularyTestResult",
    type: "vocabulary",
    name: "Vocabulary Scale Test",
    endpoint: "vocabscale-test",
  },
  {
    model: "continuousAssessment",
    type: "continuous",
    name: "Continuous Assessment",
    endpoint: "continous-test",
  },
];

export async function GET(req, { params }) {
  const { childId } = await params;

  if (!childId) {
    return NextResponse.json(
      { error: "Child ID is required" },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching test reports for child: ${childId}`);

    // Create array of promises for parallel fetching
    const fetchPromises = [
      // Fetch child details
      prisma.children.findUnique({
        where: { id: childId },
        select: {
          id: true,
          name: true,
          dateOfBirth: true,
          gender: true,
          rollno: true,
        },
      }),
    ];

    // Add test result fetching promises
    TEST_MODELS.forEach(({ model }) => {
      // Handle different model names that might exist in your schema
      const modelPromise = prisma[model]
        ?.findMany({
          where: { childId },
          orderBy: { createdAt: "desc" },
        })
        .catch((error) => {
          console.warn(`Model ${model} not found or error:`, error.message);
          return []; // Return empty array if model doesn't exist
        });

      if (modelPromise) {
        fetchPromises.push(modelPromise);
      } else {
        fetchPromises.push(Promise.resolve([]));
      }
    });

    // Execute all promises in parallel
    const results = await Promise.all(fetchPromises);

    const [childDetails, ...testResults] = results;

    if (!childDetails) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    // Transform and combine all test data
    const allTests = [];
    const testsByType = {};

    TEST_MODELS.forEach(({ type, name }, index) => {
      const tests = testResults[index] || [];

      // Transform tests to consistent format
      const transformedTests = tests.map((test) => ({
        ...test,
        type,
        testName: test.testName || name,
        created_at: test.createdAt || test.created_at,
        score: test.score || test.totalScore || test.total_score,
        // Handle continuous assessment specific fields
        ...(type === "continuous" && {
          score: test.totalScore || test.total_score,
          test_results: test.test_results,
        }),
      }));

      allTests.push(...transformedTests);
      testsByType[type] = transformedTests;
    });

    // Sort all tests by creation date (newest first)
    allTests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    console.log(
      `Successfully fetched ${allTests.length} test results for child ${childId}`
    );

    return NextResponse.json({
      success: true,
      childDetails,
      allTests,
      testsByType,
      summary: {
        totalTests: allTests.length,
        testTypes: Object.keys(testsByType).length,
        latestTest: allTests[0]?.created_at || null,
      },
    });
  } catch (error) {
    console.error("Error fetching test reports:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch test reports",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
