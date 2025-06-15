import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TEST_CONFIGS = [
  { name: "Visual Test", model: "visualTestResult" },
  { name: "Sound Test", model: "soundDiscriminationTestResult" },
  { name: "Reading Test", model: "readingProficiencyTestResult" },
  { name: "Auditory Test", model: "auditoryMemoryTestResult" },
  { name: "Grapheme Test", model: "graphemeTestResult" },
  { name: "Picture Test", model: "pictureTestResult" },
  { name: "Sequence Test", model: "sequenceTestResult" },
  { name: "Sound Blending Test", model: "soundBlendingResult" },
  { name: "Symbol Sequence Test", model: "symbolSequenceResult" },
  { name: "Vocabulary Scale Test", model: "vocabularyTestResult" },
];

const fetchTestDataForStudent = async (studentId) => {
  const allTests = [];

  for (const testConfig of TEST_CONFIGS) {
    try {
      const tests = await prisma[testConfig.model].findMany({
        where: { childId: studentId.toString() },
      });

      const mappedTests = tests.map((test) => ({
        ...test,
        testName: testConfig.name,
        score: parseFloat(test.score) || 0,
      }));

      allTests.push(...mappedTests);
    } catch (error) {
      console.error(
        `Error fetching ${testConfig.name} for student ${studentId}:`,
        error
      );
    }
  }

  return allTests;
};

export async function POST(req) {
  try {
    const { students } = await req.json();
    if (!students || students.length === 0) {
      return NextResponse.json({
        totalScoresByChild: {},
        highestScore: 0,
        averageScore: 0,
        performanceData: [],
        testCount: 0,
        recentTests: [],
      });
    }

    let totalSum = 0;
    let totalTests = 0;
    const scores = {};
    let allScores = [];
    const groupedByMonth = {};
    let allTestAttempts = [];

    for (const student of students) {
      const studentId = student.id;
      const studentName = student.name || "";

      const allTestData = await fetchTestDataForStudent(studentId);
      const totalScore = allTestData.reduce(
        (sum, test) => sum + (parseFloat(test.score) || 0),
        0
      );

      scores[studentId] = totalScore;
      totalSum += totalScore;
      totalTests += allTestData.length;
      allScores = allScores.concat(
        allTestData.map((test) => parseFloat(test.score) || 0)
      );

      allTestAttempts = allTestAttempts.concat(
        allTestData.map((test) => ({
          ...test,
          studentId,
          studentName,
          testName: test.testName || "Test",
          score: parseFloat(test.score) || 0,
        }))
      );

      allTestData.forEach((test) => {
        if (!test.createdAt) return;
        const createdAt = new Date(test.createdAt);
        if (isNaN(createdAt)) return;
        const month = createdAt.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        if (!groupedByMonth[month])
          groupedByMonth[month] = { scores: [], totalScore: 0 };
        const score = parseFloat(test.score) || 0;
        groupedByMonth[month].scores.push(score);
        groupedByMonth[month].totalScore += score;
      });
    }

    const recentTests = allTestAttempts
      .filter((t) => t.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const validScores = allScores.filter((score) => !isNaN(score));
    const highest = validScores.length > 0 ? Math.max(...validScores) : 0;
    const studentsWithTests = Object.values(scores).filter((s) => s > 0);
    const average =
      studentsWithTests.length > 0
        ? parseFloat((totalSum / studentsWithTests.length).toFixed(1))
        : 0;

    const chartData = Object.keys(groupedByMonth)
      .map((month) => {
        const monthlyData = groupedByMonth[month];
        const monthlyScores = monthlyData.scores.filter(
          (score) => !isNaN(score)
        );
        if (monthlyScores.length === 0) return null;
        return {
          month,
          highest: Math.max(...monthlyScores),
          average: (monthlyData.totalScore / monthlyScores.length).toFixed(1),
          lowest: Math.min(...monthlyScores),
        };
      })
      .filter((data) => data !== null)
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA - dateB;
      });

    return NextResponse.json({
      totalScoresByChild: scores,
      averageScore: average,
      highestScore: highest,
      performanceData: chartData,
      testCount: totalTests,
      recentTests,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard summary" },
      { status: 500 }
    );
  }
}
