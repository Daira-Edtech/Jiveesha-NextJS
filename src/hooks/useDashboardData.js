import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";

const TEST_NAME_MAPPING = {
  "visual-test": "Visual Test",
  "sound-test": "Sound Test",
  "reading-test": "Reading Test",
  "auditory-test": "Auditory Test",
  "grapheme-test": "Grapheme Test",
  "picture-test": "Picture Test",
  "sequence-test": "Sequence Test",
  "soundBlending-test": "Sound Blending Test",
  "symbolsequence-test": "Symbol Sequence Test",
  "vocabscale-test": "Vocabulary Scale Test",
};

const getTestNameFromUrl = (url) => {
  const match = url.match(/\/api\/([^\/]+)\//);
  if (match) {
    return TEST_NAME_MAPPING[match[1]] || match[1];
  }
  return "Test";
};

const testDataCache = {};

const fetchTestData = async (url) => {
  if (testDataCache[url]) {
    return testDataCache[url];
  }

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}`);
    }

    const data = await response.json();
    const tests = data.tests || [];

    // Map test name from URL and ensure proper structure
    const mappedTests = tests.map((test) => ({
      ...test,
      testName: test.testName || test.name || getTestNameFromUrl(url),
      score: parseFloat(test.score) || 0,
    }));

    testDataCache[url] = mappedTests;
    return mappedTests;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return [];
  }
};

const processStudentTests = async (studentId) => {
  const testEndpoints = [
    `/api/visual-test/getResultByChild?childId=${studentId}`,
    `/api/sound-test/getResultByChild?childId=${studentId}`,
    `/api/reading-test/getResultByChild?childId=${studentId}`,
    `/api/auditory-test/getResultByChild?childId=${studentId}`,
    `/api/grapheme-test/getResultByChild?childId=${studentId}`,
    `/api/picture-test/getResultByChild?childId=${studentId}`,
    `/api/sequence-test/getResultByChild?childId=${studentId}`,
    `/api/soundBlending-test/getResultByChild?childId=${studentId}`,
    `/api/symbolsequence-test/getResultByChild?childId=${studentId}`,
    `/api/vocabscale-test/getResultByChild?childId=${studentId}`,
  ];

  const testDataPromises = testEndpoints.map((endpoint) =>
    fetchTestData(endpoint)
  );

  const allTestData = await Promise.all(testDataPromises);
  const allTests = allTestData.flat();

  const totalScore = allTests.reduce((sum, test) => {
    const score = parseFloat(test.score) || 0;
    return sum + score;
  }, 0);

  return {
    studentId,
    totalScore,
    tests: allTests,
    testCount: allTests.length,
  };
};

export const useDashboardData = (students = []) => {
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalScoresByChild: {},
    highestScore: 0,
    averageScore: 0,
    performanceData: [],
    testCount: 0,
  });

  const processAllScores = useCallback(async () => {
    if (!students || students.length === 0) {
      return {
        totalScoresByChild: {},
        highestScore: 0,
        averageScore: 0,
        performanceData: [],
        testCount: 0,
        recentTests: [],
      };
    }

    try {
      let totalSum = 0;
      let totalTests = 0;
      const scores = {};
      let allScores = [];
      const groupedByMonth = {};
      let allTestAttempts = [];

      const studentResults = await Promise.all(
        students.map((student) => processStudentTests(student.id))
      );
      studentResults.forEach((result, idx) => {
        const { studentId, totalScore, tests, testCount } = result;
        const studentName =
          students.find((s) => s.id === studentId)?.name || "";
        scores[studentId] = totalScore;
        totalSum += totalScore;
        totalTests += testCount;
        allScores = allScores.concat(
          tests.map((test) => parseFloat(test.score) || 0)
        );
        allTestAttempts = allTestAttempts.concat(
          tests.map((test) => ({
            ...test,
            studentId,
            studentName,
            testName: test.testName || "Test", // Use already mapped testName
            score: parseFloat(test.score) || 0, // Ensure score is a number
          }))
        );
        tests.forEach((test) => {
          if (!test.createdAt) return;
          const createdAt = new Date(test.createdAt);
          if (isNaN(createdAt)) return;
          const month = createdAt.toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          if (!groupedByMonth[month]) {
            groupedByMonth[month] = { scores: [], totalScore: 0 };
          }
          const score = parseFloat(test.score) || 0;
          groupedByMonth[month].scores.push(score);
          groupedByMonth[month].totalScore += score;
        });
      });

      const recentTests = allTestAttempts
        .filter((t) => t.createdAt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      const validScores = allScores.filter((score) => !isNaN(score));
      const highest = validScores.length > 0 ? Math.max(...validScores) : 0;

      const studentsWithTests = studentResults.filter(
        (result) => result.testCount > 0
      );
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

      return {
        totalScoresByChild: scores,
        averageScore: average,
        highestScore: highest,
        performanceData: chartData,
        testCount: totalTests,
        recentTests,
      };
    } catch (error) {
      console.error("Error processing scores:", error);
      throw error;
    }
  }, [students]);

  return useQuery({
    queryKey: ["dashboardData", students.map((s) => s.id).sort()],
    queryFn: processAllScores,
    enabled: students.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
