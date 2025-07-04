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
import { useTestReports, useFilteredTests } from "@/hooks/useTestReports";
import { LoadingSpinner, ErrorComponent } from "@/components/LoadingAndError";
import Image from "next/image";

const TestResultsTable = () => {
  // UI State
  const [selectedTestForReport, setSelectedTestForReport] = useState(null);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [selectedContinuousAssessment, setSelectedContinuousAssessment] =
    useState(null);
  const [showContinuousDetailPopup, setShowContinuousDetailPopup] =
    useState(false);
  const [showCumulativeReport, setShowCumulativeReport] = useState(false);
  const [currentView, setCurrentView] = useState("all");
  const [childId, setChildId] = useState(null);
  const [userDetails, setUserDetails] = useState({});

  const { t } = useLanguage();

  // Get childId and user details from localStorage
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

  // Use the optimized hook for fetching test reports
  const {
    data: testReportsData,
    isLoading,
    error,
    refetch,
  } = useTestReports(childId);

  // Extract data from the unified response
  const childDetails = testReportsData?.childDetails || {};
  const allTests = testReportsData?.allTests || [];
  const testsByType = testReportsData?.testsByType || {};

  // Use the filtered tests hook
  const displayedTests = useFilteredTests(allTests, currentView); // Handle loading and error states
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorComponent error={error} onRetry={refetch} />;
  }
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
                {" "}
                <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
                  {childDetails.name || "Unknown Student"}
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
            </div>{" "}
            {/* Cumulative Report Button */}
            {allTests.length > 0 && (
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
                {displayedTests.length === 0 ? (
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
                        </td>{" "}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
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
