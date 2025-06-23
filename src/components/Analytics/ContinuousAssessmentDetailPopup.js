import React, { useState, useEffect } from "react";
import { FaPrint } from "react-icons/fa";
import logo from "../../../public/daira-logo.png";
import Image from "next/image";
import { useLanguage } from "../../contexts/LanguageContext";

const ContinuousAssessmentDetailPopup = ({
  assessment,
  childDetails,
  onClose,
}) => {
  const { t } = useLanguage();
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);
  const childId = childDetails?.id || localStorage.getItem("childId");

  const customStyles = `
  .bg-grid-pattern {
    background-image: 
      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  `;

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
    // Just a brief artificial loading state to prevent UI flicker
    const timer = setTimeout(() => {
      setIsLoadingAnalysis(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      document.head.removeChild(styleSheet);
    };
  }, [assessment, customStyles]);

  if (!assessment) {
    console.log(
      "Assessment prop is null, returning null from ContinuousAssessmentDetailPopup"
    );
    return null;
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
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
    return t("Invalid Date");
  };

  const handlePrint = () => {
    const printContent = document.getElementById(
      "continuous-assessment-detail-content"
    );
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    const style = document.createElement("style");
    style.innerHTML = `
      @page { size: auto; margin: 0mm; }
      body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .bg-gradient-to-r {
        background: #1e40af !important;
        color: white !important;
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.body.innerHTML = originalContents;
    // Restore event listeners or reload if necessary
    window.location.reload(); // Or a more targeted re-render
  };
  return (
    <div
      className="fixed inset-0 bg-opacity-60 flex justify-center items-start z-50 p-4 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full min-h-fit my-8 border border-gray-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          id="continuous-assessment-detail-content"
          className="overflow-y-auto flex-1"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {/* Header with report institution */}
          <div className="bg-white p-8 relative overflow-hidden">
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
                      {t("Continuous Assessment Report")}
                    </h1>
                    <div className="flex items-center space-x-4">
                      <p className="text-black text-base font-medium">
                        {t("Individual Assessment Record")}
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
                    ID: {childDetails?.id || "XXXX00000XX"}
                  </p>
                  <div className="border-t border-blue-300 border-opacity-30 pt-2 mt-2">
                    <p className="text-md">director@dairaedtech.in</p>
                    <p className="text-md">https://dairaedtech.in/</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Patient information section */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="p-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-12 gap-6">
                  {/* Left column - Patient details */}
                  <div className="col-span-8">
                    <div className="flex items-center mb-4">
                      <div className="w-2 h-8 mr-3"></div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {childDetails?.name || "Student Name"}
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
                              {childDetails?.id || "Not available"}
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
                          Assessment Information
                        </span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-blue-100"></div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-100">
                          <span className="font-medium text-gray-600">
                            Assessment Date:
                          </span>
                          <span className="text-gray-800 text-xs">
                            {formatDateTime(assessment.created_at)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-100">
                          <span className="font-medium text-gray-600">
                            Total Score:
                          </span>
                          <span className="text-gray-800 text-lg font-bold">
                            {assessment.totalScore !== undefined
                              ? assessment.totalScore
                              : assessment.total_score !== undefined
                              ? assessment.total_score
                              : assessment.score !== undefined
                              ? assessment.score
                              : t("N/A")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="p-8 bg-white">
            <div className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center">
                  <div className="w-1 h-8  mr-3"></div>
                  <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
                    {t("Test Results")}
                  </h2>
                  <div className="w-1 h-8  ml-3"></div>
                </div>
              </div>
            </div>

            {/* Test Results Table Container */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
              {(() => {
                let testResults =
                  assessment.test_results || assessment.testResults;

                if (typeof testResults === "string") {
                  try {
                    testResults = JSON.parse(testResults);
                  } catch (error) {
                    console.error("Error parsing test_results JSON:", error);
                    testResults = []; // Set to empty array on parse error
                  }
                }
                const isValidArray =
                  Array.isArray(testResults) && testResults.length > 0;

                return isValidArray ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                          <th className="p-4 text-left font-semibold">
                            {t("Sub-Test Name")}
                          </th>
                          <th className="p-4 text-center font-semibold">
                            {t("Score")}
                          </th>
                          <th className="p-4 text-center font-semibold">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {testResults.map((result, index) => (
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
                                    {result.test_name || result.testName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    📝 Sub-Assessment
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-800 rounded-full font-bold">
                                {result.score}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                ✅ Completed
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <span className="text-4xl mb-2">📊</span>
                      <p className="text-lg font-medium">No Sub-Test Data</p>
                      <p className="text-sm">
                        {t("No sub-test data available for this assessment.")}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* AI-Generated Analysis Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 text-lg">🤖</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {t("AI-Powered Analysis")}
                </h3>
                <div className="ml-auto">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    BETA
                  </span>
                </div>
              </div>
              {isLoadingAnalysis ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                  <span className="ml-4 text-gray-600">
                    {t("Analyzing assessment data...")}
                  </span>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4 font-medium">
                    📊 Based on continuous assessment data:
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                    <ul className="list-disc pl-10 text-gray-700 leading-relaxed space-y-2">
                      {(
                        assessment.analysis ||
                        assessment.aiAnalysis ||
                        assessment.assessment_analysis ||
                        t("Analysis not available for this assessment.")
                      )
                        .split(/(?<=\.)\s+/)
                        .filter((sentence) => sentence.trim().length > 0)
                        .map((sentence, index) => (
                          <li key={index}>{sentence.trim()}</li>
                        ))}
                    </ul>
                  </div>

                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800 italic flex items-center">
                      <span className="mr-2">⚠️</span>
                      {t(
                        "This analysis is generated by AI and should be reviewed by a qualified professional."
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>

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
                      {assessment?.id ||
                        Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </span>
                    <span>•</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 print:hidden border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="flex items-center px-6 py-3 bg-white border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-medium shadow-sm"
            >
              <span className="mr-2">✕</span>
              {t("Close Report")}
            </button>
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm"
              >
                <FaPrint className="mr-2" /> {t("Print Report")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinuousAssessmentDetailPopup;
