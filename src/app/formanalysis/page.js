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
                            onClick={() => handleViewAnalysis(form.analysis)}
                            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors duration-200"
                            disabled={!form.analysis}
                          >
                            {form.analysis ? "View Details" : "No Analysis"}
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
                {/* Overall Assessment */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                      <FaBrain className="text-white text-lg" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("overallAssessment")}
                    </h3>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {selectedAnalysis.overallAssessment}
                    </p>
                  </div>
                </div>

                {/* Strengths */}
                {selectedAnalysis.strengths &&
                  selectedAnalysis.strengths.length > 0 && (
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                          <FaCheckCircle className="text-white text-lg" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {t("strengths")}
                        </h3>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-emerald-100">
                        <ul className="space-y-3">
                          {selectedAnalysis.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                                <FaCheckCircle className="text-emerald-600 text-sm" />
                              </div>
                              <span className="text-gray-700 leading-relaxed">
                                {strength}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                {/* Areas of Concern */}
                {selectedAnalysis.areasOfConcern &&
                  selectedAnalysis.areasOfConcern.length > 0 && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mr-4">
                          <FaExclamationTriangle className="text-white text-lg" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {t("areasOfConcern")}
                        </h3>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-amber-100">
                        <ul className="space-y-3">
                          {selectedAnalysis.areasOfConcern.map(
                            (concern, index) => (
                              <li key={index} className="flex items-start">
                                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                                  <FaExclamationTriangle className="text-amber-600 text-sm" />
                                </div>
                                <span className="text-gray-700 leading-relaxed">
                                  {concern}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  )}

                {/* Learning Style */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                      <FaGraduationCap className="text-white text-lg" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t("learningStyle")}
                    </h3>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {selectedAnalysis.learningStyle}
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                {selectedAnalysis.recommendations && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                        <FaLightbulb className="text-white text-lg" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {t("recommendations")}
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {selectedAnalysis.recommendations.forParents &&
                        selectedAnalysis.recommendations.forParents.length >
                          0 && (
                          <div className="bg-white rounded-lg p-4 border border-pink-100">
                            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                                <FaHeart className="text-pink-600 text-sm" />
                              </div>
                              {t("forParents")}
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                              {selectedAnalysis.recommendations.forParents.map(
                                (rec, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-pink-500 mr-2 mt-1">
                                      •
                                    </span>
                                    <span className="leading-relaxed">
                                      {rec}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      {selectedAnalysis.recommendations.forTeachers &&
                        selectedAnalysis.recommendations.forTeachers.length >
                          0 && (
                          <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <FaGraduationCap className="text-blue-600 text-sm" />
                              </div>
                              {t("forTeachers")}
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                              {selectedAnalysis.recommendations.forTeachers.map(
                                (rec, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-blue-500 mr-2 mt-1">
                                      •
                                    </span>
                                    <span className="leading-relaxed">
                                      {rec}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {selectedAnalysis.nextSteps &&
                  selectedAnalysis.nextSteps.length > 0 && (
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center mr-4">
                          <FaChartBar className="text-white text-lg" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {t("nextSteps")}
                        </h3>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-violet-100">
                        <ul className="space-y-4">
                          {selectedAnalysis.nextSteps.map((step, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </div>
                              <span className="text-gray-700 leading-relaxed">
                                {step}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormAnalysisPage;
