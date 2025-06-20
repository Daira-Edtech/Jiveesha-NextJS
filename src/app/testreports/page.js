"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";
import TestReportPopup from "@/components/Analytics/TestReportPopup";
import ContinuousAssessmentDetailPopup from "@/components/Analytics/ContinuousAssessmentDetailPopup";
import { useLanguage } from "@/contexts/LanguageContext";
import axios from "axios";
import Image from "next/image";

const TestResultsTable = () => {
  const [data, setData] = useState([]);
  const [childDetails, setChildDetails] = useState({});
  const [visualTestData, setVisualTestData] = useState([]);
  const [soundTestData, setSoundTestData] = useState([]);
  const [auditoryTestData, setAuditoryTestData] = useState([]);
  const [graphemeTestData, setGraphemeTestData] = useState([]);
  const [pictureTestData, setPictureTestData] = useState([]);
  const [sequenceTestData, setSequenceTestData] = useState([]);
  const [soundBlendingTestData, setSoundBlendingTestData] = useState([]);
  const [symbolSequenceTestData, setSymbolSequenceTestData] = useState([]);
  const [vocalTestData, setVocalTestData] = useState([]);
  const [continuousAssessmentData, setContinuousAssessmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTestForReport, setSelectedTestForReport] = useState(null);
  const [showReportPopup, setShowReportPopup] = useState(false);

  const [selectedContinuousAssessment, setSelectedContinuousAssessment] =
    useState(null);
  const [showContinuousDetailPopup, setShowContinuousDetailPopup] =
    useState(false);

  const [userDetails, setUserDetails] = useState({});
  const [showCumulativeReport, setShowCumulativeReport] = useState(false);
  const [currentView, setCurrentView] = useState("all");
  const [childId, setChildId] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    setChildId(localStorage.getItem("childId"));

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUserDetails(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  useEffect(() => {
    if (!childId) return;

    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/reading-test/getResultByChild?childId=${childId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const fetchedData = response.data.tests;
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set empty array as fallback when API returns 404
        if (error.response && error.response.status === 404) {
          setData([]);
        }
      }
    };
    const fetchVisualTestData = async () => {
      if (!childId) return;
      try {
        const response = await axios.get(
          `/api/visual-test/getResultByChild?childId=${childId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setVisualTestData(response.data.tests);
      } catch (error) {
        console.error("Error fetching visual test data:", error);
        if (error.response && error.response.status === 404) {
          setVisualTestData([]);
        }
      }
    };

    const fetchSoundTestData = async () => {
      if (!childId) return;
      try {
        const response = await axios.get(
          `/api/sound-test/getResultByChild?childId=${childId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setSoundTestData(response.data.tests);
      } catch (error) {
        console.error("Error fetching sound test data:", error);
        if (error.response && error.response.status === 404) {
          setSoundTestData([]);
        }
      }
    };
    const fetchAuditoryTestData = async () => {
      if (!childId) return;
      try {
        const response = await axios.get(
          `/api/auditory-test/getResultByChild?childId=${childId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setAuditoryTestData(response.data.tests);
      } catch (error) {
        console.error("Error fetching auditory test data:", error);
        if (error.response && error.response.status === 404) {
          setAuditoryTestData([]);
        }
      }
    };

    const fetchGraphemeTestData = async () => {
      if (!childId) return;
      try {
        const response = await axios.get(
          `/api/grapheme-test/getResultByChild?childId=${childId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setGraphemeTestData(response.data.tests);
      } catch (error) {
        console.error("Error fetching grapheme test data:", error);
        if (error.response && error.response.status === 404) {
          setGraphemeTestData([]);
        }
      }
    };
    const fetchPictureTestData = async () => {
      if (!childId) return;
      try {
        const response = await axios.get(
          `/api/picture-test/getResultByChild?childId=${childId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setPictureTestData(response.data.tests);
      } catch (error) {
        console.error("Error fetching picture test data:", error);
        if (error.response && error.response.status === 404) {
          setPictureTestData([]);
        }
      }
    };

    const fetchSequenceTestData = async () => {
      if (!childId) return;
      try {
        const response = await axios.get(
          `/api/sequence-test/getResultByChild?childId=${childId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setSequenceTestData(response.data.tests);
      } catch (error) {
        console.error("Error fetching sequence test data:", error);
        if (error.response && error.response.status === 404) {
          setSequenceTestData([]);
        }
      }
    };
    const fetchSoundBlendingTestData = async () => {
      if (!childId) return;
      try {
        const response = await axios.get(
          `/api/soundBlending-test/getResultByChild?childId=${childId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setSoundBlendingTestData(response.data.tests);
      } catch (error) {
        console.error("Error fetching sound blending test data:", error);
        if (error.response && error.response.status === 404) {
          setSoundBlendingTestData([]);
        }
      }
    };

    const fetchSymbolSequenceTestData = async () => {
      if (!childId) return;
      try {
        const response = await axios.get(
          `/api/symbolsequence-test/getResultByChild?childId=${childId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setSymbolSequenceTestData(response.data.tests);
      } catch (error) {
        console.error("Error fetching symbol sequence test data:", error);
        if (error.response && error.response.status === 404) {
          setSymbolSequenceTestData([]);
        }
      }
    };
    const fetchVocalTestData = async () => {
      if (!childId) return;
      try {
        const response = await axios.get(
          `/api/vocabscale-test/getResultByChild?childId=${childId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setVocalTestData(response.data.tests);
        console.log("Vocal test data:", response.data.tests);
      } catch (error) {
        console.error("Error fetching vocal test data:", error);
        if (error.response && error.response.status === 404) {
          setVocalTestData([]);
        }
      }
    };

    const fetchContinuousAssessmentData = async () => {
      if (!childId) return;
      try {
        const response = await axios.get(
          `/api/continous-test/getResultByChild?childId=${childId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log("Continuous Assessment Data:", response.data);
        setContinuousAssessmentData(response.data.data || []);
      } catch (error) {
        console.error("Error fetching continuous assessment data:", error);
        if (error.response && error.response.status === 404) {
          setContinuousAssessmentData([]);
        }
      }
    };

    const fetchChildDetails = async () => {
      if (!childId) return;
      try {
        const response = await axios.get(`/api/getChild?childId=${childId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setChildDetails(response.data.child);
        console.log("Child details:", response.data.child);
      } catch (error) {
        console.error("Error fetching child details:", error);
        if (error.response && error.response.status === 404) {
          // Set some default values if child details aren't available
          setChildDetails({
            name: "Unknown Student",
            age: "N/A",
          });
        }
      }
    };

    setLoading(true); // Set loading to true before fetching data

    // Use Promise.all to track all fetch operations
    Promise.all([
      fetchData(),
      fetchVisualTestData(),
      fetchSoundTestData(),
      fetchAuditoryTestData(),
      fetchGraphemeTestData(),
      fetchPictureTestData(),
      fetchSequenceTestData(),
      fetchSoundBlendingTestData(),
      fetchSymbolSequenceTestData(),
      fetchVocalTestData(),
      fetchContinuousAssessmentData(),
      fetchChildDetails(),
    ]).finally(() => {
      // Set loading to false after all requests complete (success or error)
      setLoading(false);
    });
  }, [childId]);
  const formatDateTime = (dateString) => {
    if (!dateString) return { datePart: "N/A", timePart: "N/A" };
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return { datePart: "N/A", timePart: "N/A" };

    const datePart = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timePart = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { datePart, timePart };
  };
  const handleViewReport = (test) => {
    if (test.type === "continuous") {
      setSelectedContinuousAssessment(test); // test object already has test_results, total_score etc.
      setShowContinuousDetailPopup(true);
      setShowReportPopup(false); // Ensure other popup is closed
      setShowCumulativeReport(false);
    } else {
      // For other individual tests, use the existing TestReportPopup
      setSelectedTestForReport({
        ...test,
        created_at: test.created_at || test.createdAt,
        report_view_type: "single_test_detail",
      });
      setShowReportPopup(true);
      setShowContinuousDetailPopup(false); // Ensure other popup is closed
      setShowCumulativeReport(false);
    }
  };
  const handleViewCumulativeReport = () => {
    // This is for the main, overall cumulative report using TestReportPopup
    setSelectedTestForReport({
      testName: "Cumulative Assessment Report",
      created_at: new Date().toISOString(),
      report_view_type: "main_cumulative",
      allTests: allTests.map((test) => ({
        ...test,
        created_at: test.created_at || test.createdAt,
      })), // Pass the grand list of all tests (unfiltered)
    });
    setShowCumulativeReport(true); // This flag is used by TestReportPopup for its 'isCumulative' prop
    setShowReportPopup(true);
    setShowContinuousDetailPopup(false); // Ensure other popup is closed
  };

  const closeReportPopup = () => {
    setShowReportPopup(false);
    setSelectedTestForReport(null);
    setShowCumulativeReport(false); // Reset this flag as well
  };

  const closeContinuousDetailPopup = () => {
    setShowContinuousDetailPopup(false);
    setSelectedContinuousAssessment(null);
  };

  const allTests = useMemo(
    () =>
      [
        ...data.map((test) => ({
          ...test,
          type: "reading",
          testName: test.testName || "Reading Proficiency Test",
          created_at: test.createdAt || test.created_at,
        })),
        ...visualTestData.map((test) => ({
          ...test,
          type: "visual",
          testName: test.testName || "Visual Discrimination",
          created_at: test.createdAt || test.created_at,
        })),
        ...soundTestData.map((test) => ({
          ...test,
          type: "sound",
          testName: test.testName || "Sound Discrimination",
          created_at: test.createdAt || test.created_at,
        })),
        ...auditoryTestData.map((test) => ({
          ...test,
          type: "auditory",
          testName: test.testName || "Auditory Memory",
          created_at: test.createdAt || test.created_at,
        })),
        ...graphemeTestData.map((test) => ({
          ...test,
          type: "grapheme",
          testName: test.testName || "Grapheme Matching",
          created_at: test.createdAt || test.created_at,
        })),
        ...pictureTestData.map((test) => ({
          ...test,
          type: "picture",
          testName: test.testName || "Picture Recognition",
          created_at: test.createdAt || test.created_at,
        })),
        ...sequenceTestData.map((test) => ({
          ...test,
          type: "sequence",
          testName: test.testName || "Sequence Arrangement",
          created_at: test.createdAt || test.created_at,
        })),
        ...soundBlendingTestData.map((test) => ({
          ...test,
          type: "soundBlending",
          testName: test.testName || "Sound Blending",
          created_at: test.createdAt || test.created_at,
        })),
        ...symbolSequenceTestData.map((test) => ({
          ...test,
          type: "symbol",
          testName: test.testName || "Symbol Sequence",
          created_at: test.createdAt || test.created_at,
        })),
        ...vocalTestData.map((test) => ({
          ...test,
          type: "vocabulary",
          testName: test.testName || "Vocabulary Scale Test",
          created_at: test.createdAt || test.created_at,
        })),
        ...(Array.isArray(continuousAssessmentData)
          ? continuousAssessmentData.map((test) => ({
              ...test,
              type: "continuous",
              testName: "Continuous Assessment",
              score: test.totalScore,
              created_at: test.createdAt || test.created_at,
            }))
          : []),
      ].sort(
        (a, b) =>
          new Date(b.created_at || b.createdAt) -
          new Date(a.created_at || a.createdAt)
      ),
    [
      data,
      visualTestData,
      soundTestData,
      auditoryTestData,
      graphemeTestData,
      pictureTestData,
      sequenceTestData,
      soundBlendingTestData,
      symbolSequenceTestData,
      vocalTestData,
      continuousAssessmentData,
    ]
  );

  const displayedTests = useMemo(() => {
    if (currentView === "continuous") {
      return allTests.filter((test) => test.type === "continuous");
    } else if (currentView === "individual") {
      return allTests.filter((test) => test.type !== "continuous");
    }
    return allTests;
  }, [allTests, currentView]);
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-blue-50/80 to-white p-4 md:p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* User Profile Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* User Avatar */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                  {userDetails.profilePic ? (
                    <Image
                      src={userDetails.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      fill={false}
                    />
                  ) : (
                    <FaUser className="w-16 h-16 text-blue-300" />
                  )}
                </div>
              </div>
              {/* User Information */}{" "}
              <div className="flex-1 text-white">
                <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
                  {loading
                    ? "Loading..."
                    : childDetails.name || "Unknown Student"}
                </h1>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
                  {userDetails.role && (
                    <div className="flex items-center">
                      <FaIdCard className="mr-2" />
                      <span className="font-medium">{t("role")}</span>
                      <span className="ml-2 bg-blue-700 px-2 py-0.5 rounded text-sm">
                        {userDetails.role}
                      </span>
                    </div>
                  )}
                  {userDetails.email && (
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2" />
                      <span>{userDetails.email}</span>
                    </div>
                  )}
                  {userDetails.phone && (
                    <div className="flex items-center">
                      <FaPhone className="mr-2" />
                      <span>{userDetails.phone}</span>
                    </div>
                  )}
                  {userDetails.since && (
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      <span>
                        {t("memberSince")}{" "}
                        {new Date(userDetails.since).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Student Info Banner */}
                <div className="mt-4 flex flex-col md:flex-row gap-4 md:gap-8 bg-white/10 p-3 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-blue-100">
                      {t("viewingResultsFor")}
                    </span>
                    <span className="ml-2 font-semibold">
                      {childDetails.name || "Student"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-100">{t("studentId")}</span>
                    <span className="ml-2 font-semibold">
                      {childId || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-100">{t("studentAge")}</span>
                    <span className="ml-2 font-semibold">
                      {childDetails.dateOfBirth
                        ? `${
                            new Date().getFullYear() -
                            new Date(childDetails.dateOfBirth).getFullYear()
                          } ${t("years")}`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-100">{t("testsCount")}</span>
                    <span className="ml-2 font-semibold">
                      {allTests.length} {/* This shows total tests available */}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-100 bg-blue-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <h2 className="font-semibold text-blue-700">
                {currentView === "all" && t("allTestResults")}
                {currentView === "individual" && t("individualTestResults")}
                {currentView === "continuous" &&
                  t("continuousAssessmentResults")}
              </h2>
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                {displayedTests.length}
              </span>
            </div>

            {/* View Toggle Buttons */}
            <div className="flex flex-wrap gap-2 my-2 md:my-0">
              <button
                onClick={() => setCurrentView("all")}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  currentView === "all"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t("allTestsView")}
              </button>
              <button
                onClick={() => setCurrentView("individual")}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  currentView === "individual"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t("individualTestsView")}
              </button>
              <button
                onClick={() => setCurrentView("continuous")}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  currentView === "continuous"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t("continuousAssessmentsView")}
              </button>
            </div>

            {/* Cumulative Report Button */}
            {!loading && allTests.length > 0 && (
              <button
                onClick={handleViewCumulativeReport}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-md shadow-sm transition-all duration-200 w-full md:w-auto justify-center"
              >
                <FaChartLine className="text-blue-200" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{t("cumulativeReport")}</span>
                  <span className="text-xs text-blue-200">
                    {t("viewComprehensiveAssessment")}
                  </span>
                </div>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t("testName")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t("dateTaken")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t("timeTaken")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t("score")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                    {t("actions")}
                  </th>
                </tr>
              </thead>{" "}
              <tbody className="divide-y divide-blue-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-300 border-blue-200 rounded-full animate-spin mb-2"></div>
                        <p>Loading test results...</p>
                      </div>
                    </td>
                  </tr>
                ) : displayedTests.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      {t("noTestResultsFoundAtAll")}
                    </td>
                  </tr>
                ) : (
                  displayedTests.map((test, index) => {
                    const { datePart, timePart } = formatDateTime(
                      test.created_at || test.createdAt
                    );
                    const displayName =
                      test.testName === "Reading Test"
                        ? "Reading Proficiency Test"
                        : t(test.testName) || test.testName; // Apply translation here
                    return (
                      <tr
                        key={`${test.type}-${test.id || test._id || index}`}
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-blue-800 font-medium">
                          {displayName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {datePart}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {timePart}
                        </td>{" "}
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {test.score !== undefined
                            ? test.score
                            : test.total_score !== undefined
                            ? test.total_score
                            : test.totalScore !== undefined
                            ? test.totalScore
                            : "N/A"}
                        </td>                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleViewReport(test)}
                            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors duration-200"
                          >
                            {t("viewReport")}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Conditional rendering for popups */}
      {showReportPopup && selectedTestForReport && (
        <TestReportPopup
          test={selectedTestForReport}
          childDetails={{ ...childDetails, id: childId }}
          onClose={closeReportPopup}
          isCumulative={showCumulativeReport} // This controls if TestReportPopup shows cumulative view
        />
      )}

      {showContinuousDetailPopup && selectedContinuousAssessment && (
        <ContinuousAssessmentDetailPopup
          assessment={selectedContinuousAssessment}
          childDetails={{ ...childDetails, id: childId }}
          onClose={closeContinuousDetailPopup}
        />
      )}
    </div>
  );
};

export default TestResultsTable;
