"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ResultCard from "./ResultCard";
import Button from "./Button";

/**
 * ResultsDisplay component shows the final score and a detailed breakdown of each word's result.
 */
export default function ResultsDisplay({
  finalScore,
  percentage,
  responses,
  totalWords,
  error,
  onComplete,
  suppressResultPage,
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-50 p-6 font-inter">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6"
      >
        <div className="text-center">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-block bg-blue-100 p-3 rounded-full mb-4"
          >
            {finalScore >= 8 ? "🎉" : finalScore >= 5 ? "👍" : "🌱"}
          </motion.div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
            Test Completed!
          </h1>
          {/* Show error message if submission failed */}
          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
              {error}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <svg className="w-36 h-36" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e6e6e6"
                strokeWidth="3"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${percentage}, 100` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500"
              >
                {finalScore}/10
              </motion.span>
              <span className="text-sm font-medium text-blue-800">
                {responses.filter((r) => r.isCorrect).length}/{totalWords}{" "}
                correct
              </span>
            </div>
          </motion.div>
        </div>
        <div className="max-h-64 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 p-1">
          <AnimatePresence>
            {responses.map((item, index) => (
              <ResultCard
                key={item.wordId || index} // Use wordId if available, fallback to index
                item={item}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
        {/* Button depends on suppressResultPage */}
        <Button
          onClick={() => onComplete && onComplete(finalScore)}
          variant="primary"
          className="w-full"
        >
          <ArrowRight className="h-5 w-5" />
          {suppressResultPage ? "Next Test" : "Finish"}
        </Button>
      </motion.div>
    </div>
  );
}
