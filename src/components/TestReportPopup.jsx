"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const TestReportPopup = ({ test, childDetails, onClose, isCumulative }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {isCumulative ? t("cumulativeReport") : test.test_name}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-2 text-blue-100">
            <p>
              {childDetails.name} - {t("id")}: {childDetails.id}
            </p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
          {isCumulative ? (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                {t("overallProgress")}
              </h3>
              {/* Add cumulative report content here */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-700">
                  {t("cumulativeReportDescription")}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {t("score")}
                  </h4>
                  <p className="text-3xl font-bold text-blue-600">
                    {test.score || test.total_score || "N/A"}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {t("dateTaken")}
                  </h4>
                  <p className="text-gray-700">
                    {new Date(test.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {test.test_results && (
                <div className="mt-6">
                  <h4 className="font-semibold text-blue-800 mb-3">
                    {t("detailedResults")}
                  </h4>
                  <div className="bg-white border border-blue-100 rounded-lg overflow-hidden">
                    {/* Add test specific results here */}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("close")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TestReportPopup;
