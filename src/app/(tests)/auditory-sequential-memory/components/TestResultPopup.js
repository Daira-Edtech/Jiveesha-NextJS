'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../../contexts/LanguageContext';

export default function TestResultPopup({ questions, selectedOptions, onClose }) {
  const { t } = useLanguage();

  const getErrorText = (correct, selected) => {
    if (selected === null || selected === "Not Answered") return t("notAnswered") || "Not Answered";
    return correct === selected ? t("correct") || "Correct" : t("incorrect") || "Incorrect";
  };

  const getRowColor = (correct, selected) => {
    if (selected === null || selected === "Not Answered") return "bg-gray-50";
    return correct === selected ? "bg-green-50" : "bg-red-50";
  };

  const getErrorColor = (correct, selected) => {
    if (selected === null || selected === "Not Answered") return "text-gray-600";
    return correct === selected ? "text-green-600" : "text-red-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <h2 className="text-2xl font-bold">
            {t("detailedResults") || "Detailed Results"}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    {t("questionNumber") || "Question #"}
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    {t("word") || "Word"}
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                    {t("correctAnswer") || "Correct Answer"}
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                    {t("yourAnswer") || "Your Answer"}
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                    {t("result") || "Result"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, index) => {
                  const selected = selectedOptions[index] || null;
                  const error = getErrorText(q.correct, selected);
                  const rowColor = getRowColor(q.correct, selected);
                  const errorColor = getErrorColor(q.correct, selected);
                  
                  return (
                    <tr key={index} className={rowColor}>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-blue-700">
                        {q.word}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-700">
                        {q.correct}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                        {selected || (
                          <span className="text-gray-400 italic">
                            {t("notAnswered") || "Not Answered"}
                          </span>
                        )}
                      </td>
                      <td className={`border border-gray-300 px-4 py-3 text-center font-semibold ${errorColor}`}>
                        {error}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">
                {questions.filter((q, i) => selectedOptions[i] === q.correct).length}
              </div>
              <div className="text-green-600 font-medium">
                {t("correct") || "Correct"}
              </div>
            </div>
            
            <div className="bg-red-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-700">
                {questions.filter((q, i) => selectedOptions[i] && selectedOptions[i] !== q.correct).length}
              </div>
              <div className="text-red-600 font-medium">
                {t("incorrect") || "Incorrect"}
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-700">
                {questions.filter((q, i) => !selectedOptions[i]).length}
              </div>
              <div className="text-gray-600 font-medium">
                {t("unanswered") || "Unanswered"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            {t("close") || "Close"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}