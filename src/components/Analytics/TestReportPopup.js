import React, { useState, useEffect, useCallback } from "react";
import { FaPrint, FaDownload, FaEnvelope } from "react-icons/fa";
import logo from "../../../public/daira-logo.png";
import testDataMap from "../../Data/inference.json";
import axios from "axios";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import questions from "../../Data/questions.json";
import Image from "next/image";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const TestReportPopup = ({
  test,
  childDetails,
  onClose,
  isCumulative = false,
}) => {
  const [inference, setInference] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const tokenId = localStorage.getItem("access_token");
  const childId = localStorage.getItem("childId");

  // Add custom styles for the component
  const customStyles = `
  .bg-grid-pattern {
    background-image: 
      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  `;

  const generateCumulativeInference = useCallback(async () => {
    setIsLoading(true);
    try {
      const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);
      const recentTests = test.allTests.filter(
        (t) => new Date(t.created_at) > twentyMinutesAgo
      );

      if (recentTests.length === 0) {
        setInference("No recent test data available for analysis.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${backendURL}/generateInference`,
        { tests: recentTests, childId },
        {
          headers: { authorization: `Bearer ${tokenId}` },
        }
      );

      setInference(response.data.inference || "Could not generate inference.");
    } catch (error) {
      console.error("Error generating inference:", error);
      setInference("Failed to generate cumulative analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [test, childId, tokenId]);

  useEffect(() => {
    // Add styles to document head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);

    if (isCumulative && test.allTests) {
      generateCumulativeInference();
    }

    // Cleanup
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [isCumulative, test, customStyles, generateCumulativeInference]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date)) {
      return date.toLocaleString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    return "Invalid Date";
  };
  const handlePrint = () => {
    const printContent = document.getElementById("report-content");
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    const style = document.createElement("style");
    style.innerHTML = `
      @page { 
        size: auto; 
        margin: 15mm; 
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #374151;
      }
      .bg-gradient-to-r {
        background: #1e40af !important;
        color: white !important;
      }
      .print\\:bg-blue-800 {
        background: #1e40af !important;
        color: white !important;
      }
      table {
        page-break-inside: avoid;
      }
      .rounded-xl, .rounded-lg, .rounded-full {
        border-radius: 8px !important;
      }
      .shadow-sm, .shadow-xl, .shadow-2xl {
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const shouldShowRemedies = () => {
    if (!test || !(test.testName || test.testName)) return false;

    const testData = testDataMap[test.testName || test.testName];
    if (
      !testData ||
      !testData.scoreRange ||
      (test.score === undefined && test.totalScore === undefined)
    )
      return false;

    const [min, max] = testData.scoreRange.difficulty;
    const score = test.score !== undefined ? test.score : test.totalScore;
    return score >= min && score <= max;
  };
  // Check if score falls in strong range
  const isStrongScore = () => {
    if (
      !test ||
      !(test.testName || test.testName) ||
      (test.score === undefined && test.totalScore === undefined)
    ) {
      console.log("Missing test data for strong score check");
      return false;
    }

    // Get test data from the inference.json
    const testData = testDataMap[test.testName || test.testName];
    if (!testData || !testData.scoreRange) {
      console.log(
        "No matching test data in inference.json for:",
        test.testName || test.testName
      );
      return false;
    }

    const [min, max] = testData.scoreRange.strong;
    const score = parseFloat(
      test.score !== undefined ? test.score : test.totalScore
    );
    const isStrong = score >= min && score <= max;

    console.log(
      "Strong score check:",
      test.testName || test.testName,
      "Score:",
      score,
      "Range:",
      min,
      "-",
      max,
      "Result:",
      isStrong,
      "Has message:",
      !!testData.strongMessage
    );

    return isStrong;
  };
  // Get the test data for the current test
  const getCurrentTestData = () => {
    if (!test || !(test.testName || test.testName)) return null;
    return testDataMap[test.testName || test.testName] || null;
  };
  // Determines the test type from test name or test.type
  const getTestType = () => {
    if (!test) return null;

    if (test.type) {
      return test.type;
    }

    const name = (test.testName || test.testName || "").toLowerCase();

    if (name.includes("reading") || name.includes("reading")) return "reading";
    if (name.includes("visual discrimination")) return "visual";
    if (name.includes("sound discrimination")) return "sound";
    if (name.includes("grapheme") || name.includes("phoneme")) return "phoneme";
    if (name.includes("picture recognition")) return "picture";
    if (name.includes("auditory")) return "auditory";
    if (name.includes("sequence arrangement")) return "sequence";
    if (name.includes("symbol sequence")) return "symbol";
    if (name.includes("sound blending")) return "soundBlending";
    if (name.includes("vocabulary")) return "vocabulary";

    return "unknown";
  };

  const getTestScore = () => {
    return test.score !== undefined
      ? test.score
      : test.totalScore !== undefined
      ? test.totalScore
      : "-";
  };

  const getTestName = () => {
    return test.testName || test.testName || "Unknown Test";
  };
  const currentTestData = getCurrentTestData();
  const showRemedies = shouldShowRemedies();
  const testType = getTestType();
  const { language, t } = useLanguage();
  // Renders the appropriate table for each test type
  const renderTestDetails = () => {
    if (!test) return null;

    switch (testType) {
      case "reading":
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <th className="p-4 text-left font-semibold">
                    Assessment Type
                  </th>
                  <th className="p-4 text-center font-semibold">
                    Continuous Correct Words
                  </th>
                  <th className="p-4 text-center font-semibold">
                    Incorrect Words
                  </th>
                  <th className="p-4 text-center font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="p-4 font-semibold text-gray-800 border-b border-gray-100">
                    {getTestName()}
                  </td>
                  {/* Correct Words Column */}
                  <td className="p-4 text-left align-top border-b border-gray-100">
                    <div className="max-h-32 overflow-y-auto">
                      {test.correctWords ? (
                        <ul className="space-y-1">
                          {(typeof test.correctWords === "string"
                            ? JSON.parse(test.correctWords)
                            : test.correctWords
                          ).map((word, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                              <span className="text-gray-700">{word}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 italic flex items-center">
                          <span className="mr-2">ℹ️</span>
                          No correct words recorded
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Incorrect Words Column */}
                  <td className="p-4 text-left align-top border-b border-gray-100">
                    <div className="max-h-32 overflow-y-auto">
                      {test.incorrectWords ? (
                        <ul className="space-y-1">
                          {(typeof test.incorrectWords === "string"
                            ? JSON.parse(test.incorrectWords)
                            : test.incorrectWords
                          ).map((item, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                              <div>
                                <span className="text-gray-700">
                                  {item.word}
                                </span>
                                <span className="text-xs text-gray-500 ml-2 bg-gray-100 px-2 py-1 rounded">
                                  Pos {item.position}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 italic flex items-center">
                          <span className="mr-2">✅</span>
                          No incorrect words
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-center border-b border-gray-100">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-800 rounded-full font-bold text-lg">
                      {test.score !== undefined
                        ? test.score
                        : test.totalScore !== undefined
                        ? test.totalScore
                        : "-"}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            {test.reading_age && (
              <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📚</span>
                  <div>
                    <span className="font-semibold text-gray-800">
                      Reading Age Assessment:
                    </span>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium text-blue-600">
                        {test.reading_age} years
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        Child&apos;s Age:{" "}
                        <span className="font-medium">
                          {childDetails.age} years
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "visual":
        return (
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <th className="p-4 text-left font-semibold">Assessment Type</th>
                <th className="p-4 text-center font-semibold">
                  Selected Options
                </th>
                <th className="p-4 text-center font-semibold">
                  Correct Options
                </th>
                <th className="p-4 text-center font-semibold">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 transition-colors duration-150">
                <td className="p-4 font-semibold text-gray-800 border-b border-gray-100">
                  {test.testName}
                </td>
                <td className="p-4 text-left align-top border-b border-gray-100">
                  <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                    {Array.isArray(test.options) ? (
                      <ol className="space-y-1">
                        {test.options.slice(0, 10).map((option, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-2 flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-gray-700">{option}</span>
                          </li>
                        ))}
                      </ol>
                    ) : typeof test.options === "string" ? (
                      <ol className="space-y-1">
                        {JSON.parse(test.options)
                          .slice(0, 10)
                          .map((option, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-2 flex-shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-gray-700">{option}</span>
                            </li>
                          ))}
                      </ol>
                    ) : (
                      <span className="text-gray-400 italic flex items-center">
                        <span className="mr-2">ℹ️</span>
                        No options available
                      </span>
                    )}
                  </div>
                </td>

                <td className="p-4 text-left align-top border-b border-gray-100">
                  <div className="max-h-40 overflow-y-auto bg-green-50 p-3 rounded-lg">
                    <div className="space-y-1">
                      {questions[
                        language === "ta"
                          ? "tamil"
                          : language === "hi"
                          ? "hindi"
                          : "english"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center">
                          <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold mr-2 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-gray-700">
                            {item.correct}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </td>

                <td className="p-4 text-center border-b border-gray-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-800 rounded-full font-bold text-lg">
                    {test.score !== undefined
                      ? test.score
                      : test.totalScore !== undefined
                      ? test.totalScore
                      : "-"}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        );

      case "phoneme":
        return (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-blue-200 p-2 text-left">Letter</th>
                <th className="border border-blue-200 p-2 text-center">
                  Spoken
                </th>
                <th className="border border-blue-200 p-2 text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {test.results && typeof test.results === "string" ? (
                JSON.parse(test.results).map((item, index) => (
                  <tr key={index}>
                    <td className="border border-blue-200 p-2">
                      {item.letter}
                    </td>
                    <td className="border border-blue-200 p-2 text-center">
                      {item.spoken ? "Yes" : "No"}
                    </td>
                    <td className="border border-blue-200 p-2 text-center">
                      {item.status}
                    </td>
                  </tr>
                ))
              ) : test.results && Array.isArray(test.results) ? (
                test.results.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-blue-200 p-2">
                      {item.letter}
                    </td>
                    <td className="border border-blue-200 p-2 text-center">
                      {item.spoken ? "Yes" : "No"}
                    </td>
                    <td className="border border-blue-200 p-2 text-center">
                      {item.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="border border-blue-200 p-2 text-center"
                  >
                    No results available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        );

      case "picture":
        return (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-blue-200 p-2 text-left">Test</th>
                <th className="border border-blue-200 p-2 text-center">
                  Your Answer
                </th>
                <th className="border border-blue-200 p-2 text-center">
                  Correct Answer
                </th>
                <th className="border border-blue-200 p-2 text-center">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(test.responses) ? (
                test.responses.length > 0 ? (
                  test.responses.slice(0, 10).map((response, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {idx === 0 && (
                        <td
                          rowSpan={Math.min(test.responses.length, 10)}
                          className="border border-blue-200 p-2 font-semibold align-top"
                        >
                          {test.testName}
                        </td>
                      )}
                      <td className="border border-blue-200 p-2 text-center">
                        {response.userAnswer || "N/A"}
                      </td>
                      <td className="border border-blue-200 p-2 text-center">
                        {response.correctAnswer || "N/A"}
                      </td>
                      <td className="border border-blue-200 p-2 text-center">
                        {response.totalForThisImage ?? 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-blue-200 p-2 text-center text-black italic"
                    >
                      No responses available
                    </td>
                  </tr>
                )
              ) : typeof test.responses === "string" ? (
                JSON.parse(test.responses).length > 0 ? (
                  JSON.parse(test.responses)
                    .slice(0, 10)
                    .map((response, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        {idx === 0 && (
                          <td
                            rowSpan={Math.min(
                              JSON.parse(test.responses).length,
                              10
                            )}
                            className="border border-blue-200 p-2 font-semibold align-top"
                          >
                            {test.testName}
                          </td>
                        )}
                        <td className="border border-blue-200 p-2 text-center">
                          {response.userAnswer || "N/A"}
                        </td>
                        <td className="border border-blue-200 p-2 text-center">
                          {response.correctAnswer || "N/A"}
                        </td>
                        <td className="border border-blue-200 p-2 text-center">
                          {response.totalForThisImage ?? 0}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-blue-200 p-2 text-center text-black italic"
                    >
                      No responses available
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="border border-blue-200 p-2 text-center text-black italic"
                  >
                    No responses available
                  </td>
                </tr>
              )}

              <tr className="bg-blue-100 font-semibold">
                <td
                  colSpan={3}
                  className="border border-blue-200 p-2 text-right"
                >
                  Total Score:
                </td>
                <td className="border border-blue-200 p-2 text-center">
                  {getTestScore()}
                </td>
              </tr>
            </tbody>
          </table>
        );

      case "auditory":
        return (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-blue-200 p-2 text-left">Test</th>
                <th className="border border-blue-200 p-2 text-center">
                  Forward Correct
                </th>
                <th className="border border-blue-200 p-2 text-center">
                  Reverse Correct
                </th>
                <th className="border border-blue-200 p-2 text-center">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-blue-200 p-2 font-semibold">
                  {test.testName}
                </td>
                <td className="border border-blue-200 p-2 text-center">
                  {test.forwardCorrect !== undefined
                    ? test.forwardCorrect
                    : "-"}
                </td>
                <td className="border border-blue-200 p-2 text-center">
                  {test.reverseCorrect !== undefined
                    ? test.reverseCorrect
                    : "-"}{" "}
                </td>
                <td className="border border-blue-200 p-2 text-center">
                  {getTestScore()}
                </td>
              </tr>
            </tbody>
          </table>
        );
      case "vocabulary":
      case "sequence":
      case "symbol":
      case "sound":
      case "soundBlending":
        return (
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <th className="p-4 text-left font-semibold">Assessment Type</th>
                <th className="p-4 text-center font-semibold">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 transition-colors duration-150">
                <td className="p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-lg">📋</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {test.testName || "General Assessment"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Standard evaluation
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center border-b border-gray-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-800 rounded-full font-bold text-lg">
                    {getTestScore()}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        );

        return (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-blue-200 p-2 text-left">Test</th>
                <th className="border border-blue-200 p-2 text-center">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-blue-200 p-2 font-semibold">
                  {getTestName()}
                </td>
                <td className="border border-blue-200 p-2 text-center">
                  {getTestScore()}
                </td>
              </tr>
            </tbody>
          </table>
        );
      default:
        return (
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <th className="p-4 text-left font-semibold">Assessment Type</th>
                <th className="p-4 text-center font-semibold">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 transition-colors duration-150">
                <td className="p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-lg">📋</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {test.testName || "General Assessment"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Standard evaluation
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center border-b border-gray-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-800 rounded-full font-bold text-lg">
                    {getTestScore()}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        );
    }
  };
  // Renders a cumulative report with all tests
  const renderCumulativeReport = () => {
    if (!test || !test.allTests || !Array.isArray(test.allTests)) return null;

    const recentTests = test.allTests.filter((singleTest) => {
      if (!singleTest.created_at) return false;
      const testTime = new Date(singleTest.created_at).getTime();
      const twentyMinutesAgo = Date.now() - 20 * 60 * 1000;
      return testTime >= twentyMinutesAgo;
    });

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <th className="p-4 text-left font-semibold">Assessment Name</th>
              <th className="p-4 text-center font-semibold">Date & Time</th>
              <th className="p-4 text-center font-semibold">Score</th>
              <th className="p-4 text-center font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTests.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <span className="text-4xl mb-2">📊</span>
                    <p className="text-lg font-medium">No Recent Tests</p>
                    <p className="text-sm">
                      No assessments completed in the last 20 minutes
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              recentTests.map((singleTest, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100"
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-sm font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {singleTest.testName || `Assessment ${index + 1}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {singleTest.testName?.includes("reading")
                            ? "📖 Reading"
                            : singleTest.testName?.includes("visual")
                            ? "👁️ Visual"
                            : singleTest.testName?.includes("sound")
                            ? "🔊 Audio"
                            : "📝 General"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-sm">
                      <p className="font-medium text-gray-800">
                        {singleTest.created_at
                          ? new Date(singleTest.created_at).toLocaleDateString()
                          : "-"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {singleTest.created_at
                          ? new Date(singleTest.created_at).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )
                          : "-"}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-800 rounded-full font-bold">
                      {singleTest.score !== undefined
                        ? singleTest.score
                        : singleTest.totalScore !== undefined
                        ? singleTest.totalScore
                        : "-"}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      ✅ Completed
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start z-50 p-4 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full min-h-fit my-8 border border-gray-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          id="report-content"
          className="overflow-y-auto flex-1"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {/* Header with report institution */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="w-16 h-16 mr-12 bg-white rounded-full p-2 shadow-lg">
                    <Image
                      src="/daira-logo1.png"
                      alt="Logo"
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-black text-3xl font-bold tracking-wide mb-2">
                      {isCumulative
                        ? "Comprehensive Assessment Report"
                        : "Learning Assessment Report"}
                    </h1>
                    <div className="flex items-center space-x-4">
                      <p className="text-black text-base font-medium">
                        {isCumulative
                          ? "Multi-Domain Evaluation Summary"
                          : "Educational Evaluation"}
                      </p>
                      <div className="h-4 w-px bg-blue-300"></div>
                      <p className="text-black text-sm">
                        Generated on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right text-black bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm border border-white border-opacity-20">
                  <div className="text-lg uppercase tracking-wider text-black mb-1">
                    Registration Details
                  </div>
                  <p className="text-sm font-medium mb-1">
                    ID: {childDetails.id || "XXXX00000XX"}
                  </p>
                  <div className="border-t border-blue-300 border-opacity-30 pt-2 mt-2">
                    <p className="text-md">support@jiveesha.com</p>
                    <p className="text-md">www.jiveesha.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Patient information section */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="p-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-12 gap-6">
                  {/* Left column - Patient details */}
                  <div className="col-span-8">
                    <div className="flex items-center mb-4">
                      <div className="w-2 h-8 "></div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {childDetails.name || "Student Name"}
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 text-sm font-semibold">
                              👤
                            </span>
                          </div>
                          <span className="font-semibold text-gray-700">
                            Demographics
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>
                            <span className="font-medium">Age:</span>{" "}
                            <span className="text-gray-800">
                              {childDetails?.dateOfBirth
                                ? `${
                                    new Date().getFullYear() -
                                    new Date(
                                      childDetails.dateOfBirth
                                    ).getFullYear()
                                  } ${t("YRS")}`
                                : childDetails?.age
                                ? `${childDetails.age} ${t("YRS")}`
                                : "-"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Gender:</span>{" "}
                            <span className="text-gray-800">
                              {childDetails?.gender || t("N/A")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-green-600 text-sm font-semibold">
                              🆔
                            </span>
                          </div>
                          <span className="font-semibold text-gray-700">
                            Identification
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Student ID:</span>{" "}
                            <span className="text-gray-800 font-mono">
                              {childDetails.id || "Not available"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right column - Report details */}
                  <div className="col-span-4">
                    <div className="bg-blue-50 p-4 rounded-lg h-full">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 text-sm font-semibold">
                            📋
                          </span>
                        </div>
                        <span className="font-semibold text-gray-700">
                          Report Information
                        </span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-blue-100">
                          <span className="font-medium text-gray-600">
                            Registered:
                          </span>
                          <span className="text-gray-800 text-xs">
                            {childDetails.joined_date
                              ? formatDateTime(childDetails.joined_date)
                              : "-"}
                          </span>
                        </div>
                        {test && (
                          <>
                            <div className="flex justify-between items-center py-2 border-b border-blue-100">
                              <span className="font-medium text-gray-600">
                                Test Date:
                              </span>
                              <span className="text-gray-800 text-xs">
                                {formatDateTime(test.created_at)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="font-medium text-gray-600">
                                Report Date:
                              </span>
                              <span className="text-gray-800 text-xs">
                                {formatDateTime(test.created_at)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Test Results */}
          <div className="p-8 bg-white">
            <div className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center">
                  <div className="w-1 h-8"></div>
                  <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
                    {test?.testName || "Assessment Results"}
                  </h2>
                  <div className="w-1 h-8 "></div>
                </div>
              </div>
            </div>
            {/* Test Results Table Container */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
              {test?.is_cumulative
                ? renderCumulativeReport()
                : renderTestDetails()}
            </div>{" "}
            {/* AI-Generated Cumulative Inference */}
            {isCumulative && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 text-lg">🤖</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    AI-Powered Analysis
                  </h3>
                  <div className="ml-auto">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      BETA
                    </span>
                  </div>
                </div>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                    <span className="ml-4 text-gray-600">
                      Analyzing assessment data...
                    </span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4 font-medium">
                      📊 Based on recent assessments completed:
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                      <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                        {inference}
                      </p>
                    </div>
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs text-amber-800 italic flex items-center">
                        <span className="mr-2">⚠️</span>
                        This analysis is generated by AI and should be reviewed
                        by a qualified professional.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Clinical Notes */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600 text-lg">📝</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Assessment Feedback
                </h3>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  {isStrongScore() &&
                  currentTestData &&
                  currentTestData.strongMessage ? (
                    <>
                      <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full mr-2">
                        ✨ Excellent!
                      </span>
                      {currentTestData.strongMessage}
                    </>
                  ) : showRemedies && currentTestData ? (
                    <>
                      <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 text-sm font-bold rounded-full mr-2">
                        📈 Areas for Improvement
                      </span>
                      {currentTestData.description}
                    </>
                  ) : isCumulative ? (
                    "This comprehensive assessment evaluates multiple cognitive domains relevant to the student's learning profile. Results should be considered alongside overall educational performance."
                  ) : (
                    "This assessment evaluates cognitive abilities relevant to the student&apos;s learning profile. Results should be considered alongside overall educational performance."
                  )}
                </p>
              </div>

              {/* Show remedies only if score is in difficulty range */}
              {showRemedies && currentTestData && (
                <div className="mt-6 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-orange-600 text-sm">💡</span>
                    </div>
                    <h4 className="font-semibold text-gray-800">
                      Recommended Interventions
                    </h4>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {currentTestData.remedies.map((remedy, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>{" "}
            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 mr-2">
                      <Image
                        src="/daira-logo1.png"
                        alt="Logo"
                        width={32}
                        height={32}
                        className="w-full h-full object-contain opacity-60"
                      />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      Jiveesha Assessment Platform
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                    <span>Page 1 of 1</span>
                    <span>•</span>
                    <span>
                      Report ID:{" "}
                      {test?.id ||
                        Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </span>
                    <span>•</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>

        {/* Action buttons */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 print:hidden border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="flex items-center px-6 py-3 bg-white border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-medium shadow-sm"
            >
              <span className="mr-2">✕</span>
              Close Report
            </button>
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm"
              >
                <FaPrint className="mr-2" /> Print Report
              </button>
              <button className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-sm">
                <FaDownload className="mr-2" /> Download PDF
              </button>
              <button className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium shadow-sm">
                <FaEnvelope className="mr-2" /> Email Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestReportPopup;
