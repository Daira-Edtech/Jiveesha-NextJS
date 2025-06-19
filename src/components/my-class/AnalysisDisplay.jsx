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

  const renderAnalysis = () => {
    if (!analysis) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No analysis available at this time.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Overall Assessment */}
        {analysis.overallAssessment && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">
              Overall Assessment
            </h3>
            <p className="text-blue-700">{analysis.overallAssessment}</p>
          </div>
        )}

        {/* Strengths */}
        {analysis.strengths && analysis.strengths.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Strengths</h3>
            <ul className="list-disc list-inside text-green-700 space-y-1">
              {analysis.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas of Concern */}
        {analysis.areasOfConcern && analysis.areasOfConcern.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-semibold text-orange-800 mb-2">
              Areas for Attention
            </h3>
            <ul className="list-disc list-inside text-orange-700 space-y-1">
              {analysis.areasOfConcern.map((concern, index) => (
                <li key={index}>{concern}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Learning Style */}
        {analysis.learningStyle && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2">
              Learning Style
            </h3>
            <p className="text-purple-700">{analysis.learningStyle}</p>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-800 mb-3">
              Recommendations
            </h3>

            {analysis.recommendations.forParents &&
              analysis.recommendations.forParents.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-medium text-indigo-700 mb-2">
                    For Parents:
                  </h4>
                  <ul className="list-disc list-inside text-indigo-600 space-y-1 ml-4">
                    {analysis.recommendations.forParents.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

            {analysis.recommendations.forTeachers &&
              analysis.recommendations.forTeachers.length > 0 && (
                <div>
                  <h4 className="font-medium text-indigo-700 mb-2">
                    For Teachers:
                  </h4>
                  <ul className="list-disc list-inside text-indigo-600 space-y-1 ml-4">
                    {analysis.recommendations.forTeachers.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        {/* Next Steps */}
        {analysis.nextSteps && analysis.nextSteps.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Next Steps</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {analysis.nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  const renderContent = () => {
    if (ageInMonths >= 6 && ageInMonths <= 48) {
      return (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Assessment Analysis Complete
            </h2>
            <p className="text-gray-600">
              Child's age: {Math.floor(ageInMonths / 12)} years{" "}
              {ageInMonths % 12} months
            </p>
          </div>
          {renderAnalysis()}
        </div>
      );
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;

      return (
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-blue-600"
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

          <h2 className="text-2xl font-bold text-blue-600 mb-3">
            Next Steps Required
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 mb-2">
              <strong>Child's age:</strong> {years} years {months} months
            </p>
            <p className="text-blue-700">
              Based on the child's age (over 4 years), we recommend proceeding
              with our Continuous Assessment Test for a more comprehensive
              evaluation.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => {
                // TODO: Implement redirect to Continuous Assessment Test
                console.log("Redirect to Continuous Assessment Test");
                alert("Redirecting to Continuous Assessment Test...");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
            >
              Take Continuous Assessment Test
            </Button>

            <p className="text-sm text-gray-600">
              This comprehensive test will provide detailed insights into your
              child's learning needs.
            </p>
          </div>
        </div>
      );
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">
            Form Submission Successful
          </CardTitle>
          <CardDescription>
            Your child's assessment has been completed and analyzed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
          <div className="mt-8 text-center border-t pt-6">
            <Button onClick={onClose} variant="outline" className="px-8 py-2">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisDisplay;
