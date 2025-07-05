"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const calculateAgeInMonths = (dob) => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
  months -= birthDate.getMonth() + 1;
  months += today.getMonth();
  return months <= 0 ? 0 : months;
};

const AnalysisDisplay = ({ analysis, childDob, onClose }) => {
  const ageInMonths = calculateAgeInMonths(childDob);

  console.log("AnalysisDisplay - Age in months:", ageInMonths);
  console.log("AnalysisDisplay - Analysis data:", analysis);

  const renderContent = () => {
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    const isAbove4Years = ageInMonths > 48;

    return (
      <div className="text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3">
          Assessment Complete!
        </h2>

        {/* Child Age Info */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8 shadow-sm">
          <p className="text-sm sm:text-base md:text-lg text-gray-700">
            <span className="font-semibold text-blue-700">Child's Age:</span>{" "}
            {years} years {months} months
          </p>
        </div>

        {/* Main Message */}
        <div className="bg-white border-2 border-dashed border-blue-300 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8 shadow-sm">
          <div className="mb-2 sm:mb-4">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-500 mx-auto mb-2 sm:mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
            Ready for Detailed Analysis
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Your initial assessment has been successfully processed. For
            comprehensive insights, recommendations, and personalized learning
            strategies, please visit our dedicated analysis page.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 sm:space-y-4">
          <Button
            onClick={() => {
              // TODO: Navigate to analysis page
              console.log("Navigate to analysis page");
              window.location.href = "/analytics";
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
              />
            </svg>
            View Full Analysis
          </Button>

          {isAbove4Years && (
            <Button
              onClick={() => {
                // TODO: Navigate to take-tests page
                console.log("Navigate to take-tests page");
                window.location.href = "/take-tests";
              }}
              variant="outline"
              className="w-full border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Take Comprehensive Tests
            </Button>
          )}

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {isAbove4Years
                ? "For children above 4 years, we recommend taking our comprehensive assessment tests for more detailed insights."
                : "Access your detailed analysis report to understand your child's strengths, learning style, and personalized recommendations."}
            </p>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 z-50 overflow-y-auto">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-xl sm:rounded-2xl my-4 mx-2 sm:mx-4 max-h-[95vh] overflow-y-auto">
        <CardHeader className="text-center pb-2 sm:pb-4 px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Form Submission Successful
          </CardTitle>
          <CardDescription className="text-sm sm:text-base md:text-lg text-gray-600">
            Your child's assessment has been completed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 px-4 sm:px-6">
          {renderContent()}
          <div className="mt-6 sm:mt-8 text-center border-t border-gray-200 pt-4 sm:pt-6">
            <Button
              onClick={onClose}
              variant="ghost"
              className="px-6 sm:px-8 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisDisplay;
