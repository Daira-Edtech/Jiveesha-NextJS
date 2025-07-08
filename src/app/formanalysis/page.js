"use client";

import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaChartBar,
  FaLightbulb,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowLeft,
  FaBrain,
  FaGraduationCap,
  FaHeart,
} from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFormData } from "@/hooks/useTestReports";
import { LoadingSpinner, ErrorComponent } from "@/components/LoadingAndError";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Utility function to render markdown-style text
const renderMarkdownText = (text) => {
  if (!text) return text;

  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-gray-900">
          {boldText}
        </strong>
      );
    }
    return part;
  });
};

// Enhanced text display component
const EnhancedTextDisplay = ({ text, className = "" }) => {
  if (!text) return null;

  // Split text by paragraphs first, but also handle cases where numbered lists are in the same paragraph
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((paragraph, pIndex) => {
        // Check if the paragraph contains numbered list items
        const hasNumberedItems = /\d+\.\s/.test(paragraph);

        if (hasNumberedItems) {
          // Split by sentences that start with numbers, but preserve the number
          const parts = paragraph.split(/(?=\d+\.\s)/);
          const listItems = parts.filter(
            (part) => part.trim() && /^\d+\.\s/.test(part.trim())
          );

          if (listItems.length > 0) {
            return (
              <div key={pIndex} className="space-y-3">
                {/* Check if there's text before the first numbered item */}
                {parts[0] &&
                  !/^\d+\.\s/.test(parts[0].trim()) &&
                  parts[0].trim() && (
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {renderMarkdownText(parts[0].trim())}
                    </p>
                  )}

                <ol className="list-decimal list-inside space-y-3 ml-4">
                  {listItems.map((item, lIndex) => {
                    // Remove the number and dot from the beginning
                    const cleanItem = item.replace(/^\d+\.\s*/, "").trim();
                    return (
                      <li
                        key={lIndex}
                        className="text-gray-700 leading-relaxed pl-2"
                      >
                        {renderMarkdownText(cleanItem)}
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          }
        }

        // It's a regular paragraph
        return (
          <p key={pIndex} className="text-gray-700 leading-relaxed">
            {renderMarkdownText(paragraph.trim())}
          </p>
        );
      })}
    </div>
  );
};

const FormAnalysisPage = () => {
  // UI State
  const [childId, setChildId] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const { t } = useLanguage();
  const router = useRouter();

  // Get childId and user details from localStorage
  useEffect(() => {
    const storedChildId = localStorage.getItem("childId");
    setChildId(storedChildId);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUserDetails(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Use the custom hook for fetching form data
  const {
    data: formDataResponse,
    isLoading,
    error,
    refetch,
  } = useFormData(childId);

  // Extract data from the response
  const childDetails = formDataResponse?.data?.childDetails || {};
  const formData = formDataResponse?.data?.formData || [];

  const formatDateTime = (dateString) => {
    if (!dateString) return { datePart: "N/A", timePart: "N/A" };
    const date = new Date(dateString);
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

  const handleViewAnalysis = (analysis) => {
    setSelectedAnalysis(analysis);
  };

  const closeAnalysisModal = () => {
    setSelectedAnalysis(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorComponent error={error} onRetry={refetch} />;
  }

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
              {/* User Information */}
              <div className="flex-1 text-white">
                <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
                  {t("formAnalysis")} for{" "}
                  {childDetails.name || "Unknown Student"}
                </h1>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
                  {userDetails.role && (
                    <div className="flex items-center">
                      <FaIdCard className="mr-2" />
                      <span className="font-medium">Role</span>
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
                </div>
                {/* Student Info Banner */}
                <div className="mt-4 flex flex-col md:flex-row gap-4 md:gap-8 bg-white/10 p-3 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-blue-100">Student</span>
                    <span className="ml-2 font-semibold">
                      {childDetails.name || "Student"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-100">Student Roll No: </span>
                    <span className="ml-2 font-semibold">
                      {childDetails.rollno || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-100">Age</span>
                    <span className="ml-2 font-semibold">
                      {childDetails.dateOfBirth
                        ? `${
                            new Date().getFullYear() -
                            new Date(childDetails.dateOfBirth).getFullYear()
                          } years`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-100">
                      {t("formSubmissions")}
                    </span>
                    <span className="ml-2 font-semibold">
                      {formData.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Analysis Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-100 bg-blue-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <h2 className="font-semibold text-blue-700">
                {t("formAnalysisResults")}
              </h2>
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                {formData.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t("submissionDate")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                    {t("formVersion")}
                  </th>

                  <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {formData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      {t("noFormDataFound")}
                    </td>
                  </tr>
                ) : (
                  formData.map((form, index) => {
                    const { datePart, timePart } = formatDateTime(
                      form.createdAt
                    );
                    return (
                      <tr
                        key={form.id || index}
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-blue-800 font-medium">
                          <div>
                            <div>{datePart}</div>
                            <div className="text-sm text-gray-500">
                              {timePart}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {form.formVersion || "1.0"}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleViewAnalysis(form.analysisNew)}
                            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors duration-200"
                            disabled={!form.analysisNew}
                          >
                            {form.analysisNew ? "View Details" : "No Analysis"}
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

      {/* Analysis Detail Modal */}
      {selectedAnalysis && (
        <div
          className="fixed inset-0  bg-opacity-60 flex justify-center items-start z-50 p-4 backdrop-blur-sm overflow-y-auto"
          onClick={closeAnalysisModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full min-h-fit my-8 border border-gray-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with grid pattern background */}
            <div className="bg-white p-8 relative overflow-hidden rounded-t-2xl">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                }}
              ></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-16 h-16 mr-6 bg-white rounded-full p-2 shadow-lg border-2 border-blue-100">
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <FaBrain className="text-white text-xl" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-black text-3xl font-bold tracking-wide mb-2">
                        {t("detailedFormAnalysis")}
                      </h1>
                      <div className="flex items-center space-x-4">
                        <p className="text-gray-600 text-base font-medium">
                          Student: {childDetails.name || "Unknown Student"}
                        </p>
                        <span className="text-gray-400">•</span>
                        <p className="text-gray-600 text-base">
                          Comprehensive Assessment Report
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeAnalysisModal}
                    className="text-gray-400 hover:text-gray-600 text-3xl font-light transition-colors duration-200 ml-4"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 300px)" }}
            >
              <div className="p-8 space-y-8">
                

                {/* Psychology Report Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                      <FaBrain className="text-white text-lg" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Psychology Assessment Report
                    </h3>
                  </div>

                  <div className="grid gap-4">
                    {selectedAnalysis.developmentalMilestones && (
                      <div className="bg-white rounded-lg p-5 border border-blue-100">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                          Developmental Milestones
                        </h4>
                        <EnhancedTextDisplay
                          text={selectedAnalysis.developmentalMilestones}
                          className="text-sm"
                        />
                      </div>
                    )}

                    {selectedAnalysis.questionnaireInterpretation && (
                      <div className="bg-white rounded-lg p-5 border border-blue-100">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                          Questionnaire Interpretation
                        </h4>
                        <EnhancedTextDisplay
                          text={selectedAnalysis.questionnaireInterpretation}
                          className="text-sm"
                        />
                      </div>
                    )}

                    {selectedAnalysis.furtherAssessmentRecommendations && (
                      <div className="bg-white rounded-lg p-5 border border-blue-100">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                          Further Assessment Recommendations
                        </h4>
                        <EnhancedTextDisplay
                          text={
                            selectedAnalysis.furtherAssessmentRecommendations
                          }
                          className="text-sm"
                        />
                      </div>
                    )}

                    {selectedAnalysis.parentSupportSuggestions && (
                      <div className="bg-white rounded-lg p-5 border border-blue-100">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                          Parent Support Suggestions
                        </h4>
                        <EnhancedTextDisplay
                          text={selectedAnalysis.parentSupportSuggestions}
                          className="text-sm"
                        />
                      </div>
                    )}

                    {selectedAnalysis.psychologicalFrameworks && (
                      <div className="bg-white rounded-lg p-5 border border-blue-100">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                          Psychological Frameworks
                        </h4>
                        <EnhancedTextDisplay
                          text={selectedAnalysis.psychologicalFrameworks}
                          className="text-sm"
                        />
                      </div>
                    )}

                    {selectedAnalysis.observedSymptoms &&
                      selectedAnalysis.observedSymptoms.length > 0 && (
                        <div className="bg-white rounded-lg p-5 border border-blue-100">
                          <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                            Observed Symptoms
                          </h4>
                          <ul className="space-y-2 text-gray-700 text-sm">
                            {selectedAnalysis.observedSymptoms.map(
                              (symptom, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-blue-500 mr-3 mt-1 text-lg">
                                    •
                                  </span>
                                  <div className="flex-1">
                                    <EnhancedTextDisplay text={symptom} />
                                  </div>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {selectedAnalysis.familyHistory && (
                      <div className="bg-white rounded-lg p-5 border border-blue-100">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                          Family History
                        </h4>
                        <EnhancedTextDisplay
                          text={selectedAnalysis.familyHistory}
                          className="text-sm"
                        />
                      </div>
                    )}

                    {selectedAnalysis.culturalEnvironmentalFactors && (
                      <div className="bg-white rounded-lg p-5 border border-blue-100">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                          Cultural & Environmental Factors
                        </h4>
                        <EnhancedTextDisplay
                          text={selectedAnalysis.culturalEnvironmentalFactors}
                          className="text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Sensory & Occupational Report Section */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <FaCheckCircle className="text-white text-lg" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Sensory & Occupational Assessment
                    </h3>
                  </div>

                  <div className="grid gap-4">
                    {/* Sensory Scores */}
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Winnie Dunn Sensory Scores
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedAnalysis.sensorySeekingScore !== null && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              {selectedAnalysis.sensorySeekingScore}
                            </div>
                            <div className="text-xs text-gray-600">Seeking</div>
                          </div>
                        )}
                        {selectedAnalysis.sensoryAvoidingScore !== null && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-600">
                              {selectedAnalysis.sensoryAvoidingScore}
                            </div>
                            <div className="text-xs text-gray-600">
                              Avoiding
                            </div>
                          </div>
                        )}
                        {selectedAnalysis.sensorySensitivityScore !== null && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-600">
                              {selectedAnalysis.sensorySensitivityScore}
                            </div>
                            <div className="text-xs text-gray-600">
                              Sensitivity
                            </div>
                          </div>
                        )}
                        {selectedAnalysis.sensoryRegistrationScore !== null && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">
                              {selectedAnalysis.sensoryRegistrationScore}
                            </div>
                            <div className="text-xs text-gray-600">
                              Registration
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedAnalysis.sensoryProcessingInterpretation && (
                      <div className="bg-white rounded-lg p-5 border border-green-100">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                          Sensory Processing Interpretation
                        </h4>
                        <EnhancedTextDisplay
                          text={
                            selectedAnalysis.sensoryProcessingInterpretation
                          }
                          className="text-sm"
                        />
                      </div>
                    )}

                    {selectedAnalysis.sensoryFollowUpStrategy && (
                      <div className="bg-white rounded-lg p-5 border border-green-100">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                          Follow-up Strategy
                        </h4>
                        <EnhancedTextDisplay
                          text={selectedAnalysis.sensoryFollowUpStrategy}
                          className="text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Speech & Language Report Section */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                      <FaGraduationCap className="text-white text-lg" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Speech & Language Assessment
                    </h3>
                  </div>

                  <div className="grid gap-4">
                    {selectedAnalysis.phonologicalDisorderAssessment && (
                      <div className="bg-white rounded-lg p-5 border border-purple-100">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                          Phonological Disorder Assessment
                        </h4>
                        <EnhancedTextDisplay
                          text={selectedAnalysis.phonologicalDisorderAssessment}
                          className="text-sm"
                        />
                      </div>
                    )}

                    {selectedAnalysis.attentionDifficultiesEvaluation && (
                      <div className="bg-white rounded-lg p-5 border border-purple-100">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                          Attention Difficulties Evaluation
                        </h4>
                        <EnhancedTextDisplay
                          text={
                            selectedAnalysis.attentionDifficultiesEvaluation
                          }
                          className="text-sm"
                        />
                      </div>
                    )}

                    {selectedAnalysis.dysarthriaAssessment && (
                      <div className="bg-white rounded-lg p-5 border border-purple-100">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                          Dysarthria Assessment
                        </h4>
                        <EnhancedTextDisplay
                          text={selectedAnalysis.dysarthriaAssessment}
                          className="text-sm"
                        />
                      </div>
                    )}

                    {selectedAnalysis.voiceDisorderEvaluation && (
                      <div className="bg-white rounded-lg p-5 border border-purple-100">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                          Voice Disorder Evaluation
                        </h4>
                        <EnhancedTextDisplay
                          text={selectedAnalysis.voiceDisorderEvaluation}
                          className="text-sm"
                        />
                      </div>
                    )}

                    {selectedAnalysis.eyeContactDifficulties && (
                      <div className="bg-white rounded-lg p-5 border border-purple-100">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                          Eye Contact Difficulties
                        </h4>
                        <EnhancedTextDisplay
                          text={selectedAnalysis.eyeContactDifficulties}
                          className="text-sm"
                        />
                      </div>
                    )}

                    {selectedAnalysis.earlyInterventionImportance && (
                      <div className="bg-white rounded-lg p-5 border border-purple-100">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                          Early Intervention Importance
                        </h4>
                        <EnhancedTextDisplay
                          text={selectedAnalysis.earlyInterventionImportance}
                          className="text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormAnalysisPage;
