"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChildren } from "@/hooks/useChildren";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useLanguage } from "@/contexts/LanguageContext";

import MetricCard from "@/components/dashboard/MetricCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import TestResultCard from "@/components/dashboard/TestResultCard";
import StudentListItem from "@/components/dashboard/StudentListItem";
import SearchByName from "@/components/dashboard/SearchByName";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoadingSpinner = ({ message }) => (
  <div className="h-screen flex items-center justify-center bg-blue-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-blue-700">{message}</p>
    </div>
  </div>
);

const ErrorDisplay = ({ message, onRetry }) => {
  const { t } = useLanguage();

  return (
    <div className="h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("errorLoadingData") || "Error Loading Data"}
        </h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <Button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {t("retry") || "Retry"}
        </Button>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  // Get user details from localStorage
  const userDetails = useMemo(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("user")) || { name: "User" };
      } catch {
        return { name: "User" };
      }
    }
    return { name: "User" };
  }, []);

  const {
    data: childrenData,
    isLoading: studentsLoading,
    error: studentsError,
    refetch: refetchStudents,
  } = useChildren();

  const students = childrenData?.children || [];

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useDashboardData(students);

  const filteredStudents = useMemo(() => {
    return students
      .filter(
        (student) =>
          searchTerm.trim() === "" ||
          student.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice()
      .reverse()
      .slice(0, 10);
  }, [students, searchTerm]);

  const handleSearch = (term) => setSearchTerm(term);

  const handleTestResultClick = (test) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "childId",
        test.studentId?.toString() || test.id?.toString()
      );
      router.push(`/test-reports`);
    }
  };

  const handleStudentClick = (student) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("childId", student.id.toString());
      router.push(`/test-reports`);
    }
  };

  const handleRetry = () => {
    refetchStudents();
    refetchDashboard();
  };

  const isLoading = studentsLoading || dashboardLoading;

  const error = studentsError || dashboardError;

  if (isLoading) {
    return (
      <LoadingSpinner message={t("loadingDashboard") || "Loading Dashboard"} />
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        message={
          error.message ||
          t("errorLoadingData") ||
          "Failed to load dashboard data"
        }
        onRetry={handleRetry}
      />
    );
  }
  const {
    totalScoresByChild = {},
    highestScore = 0,
    averageScore = 0,
    performanceData = [],
    testCount = 0,
    recentTests = [],
  } = dashboardData || {};

  return (
    <div className="h-screen overflow-y-auto bg-blue-50 px-4 text-gray-900">
      <div className="transform scale-[0.96] origin-top mx-auto px-4 py-8 pb-16">
        {/* Header */}
        <Card className="bg-transparent shadow-sm rounded-lg p-3 mb-6">
          <CardHeader className="p-0">
            <h2 className="text-lg font-semibold">
              {t("dashboard") || "Dashboard"},
            </h2>
            <span className="text-sm font-normal text-gray-600">
              {t("studentsPerformanceOverview") ||
                "Students Performance Overview"}
            </span>
            <h3 className="text-xl font-extrabold text-blue-600">
              {userDetails.name}
            </h3>
          </CardHeader>
        </Card>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <MetricCard
            title={t("totalStudents") || "Total Students"}
            value={students.length}
          />
          <MetricCard
            title={t("totalTests") || "Total Tests"}
            value={testCount}
          />
          <MetricCard
            title={t("avgStudentScore") || "Average Student Score"}
            value={averageScore}
            className="text-blue-800"
          />
          <MetricCard
            title={t("highestScore") || "Highest Score"}
            value={highestScore}
          />
        </div>

        {/* Charts and Recent Tests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Performance Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-md font-bold text-blue-600">
                {t("classPerformance") || "Class Performance"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64">
                <PerformanceChart data={performanceData} />
              </div>
            </CardContent>
          </Card>

          {/* Recent Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-bold">
                {t("recentTests") || "Recent Tests"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 overflow-y-auto max-h-64">
                {" "}
                {recentTests.length > 0 ? (
                  recentTests.map((test) => (
                    <TestResultCard
                      key={test._id || test.id}
                      test={test}
                      onClick={() => handleTestResultClick(test)}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    {t("noTests") || "No tests available"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-lg font-bold">
                  {t("students") || "Students"}
                </CardTitle>
                <p className="text-sm mt-1 text-gray-700 font-normal">
                  {t("selectStudentViewReport") ||
                    "Select a student to view their report"}
                </p>
              </div>
              <SearchByName onSearch={handleSearch} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 overflow-y-auto max-h-96">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <StudentListItem
                    key={student.id}
                    student={student}
                    buttonLabel={t("viewResults") || "View Results"}
                    onButtonClick={handleStudentClick}
                    score={totalScoresByChild[student.id] || 0}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  {t("noStudentsFound") || "No students found"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
