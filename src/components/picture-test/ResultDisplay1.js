// components/PictureTest/ResultsDisplay1.js
"use client";
import { motion } from "framer-motion";
import { FaRedo, FaTrophy } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

export default function ResultsDisplay1({ testResults, t, onRetakeTest }) {
  if (!testResults) {
    return <LoadingSpinner text={t("loadingResultsText")} />;
  }

  // --- This logic to calculate the score remains the same ---
  const isArray = Array.isArray(testResults);
  let responses = [];
  if (isArray) {
    responses = testResults;
  } else if (Array.isArray(testResults?.responses)) {
    responses = testResults.responses;
  } else if (typeof testResults?.responses === "string") {
    try {
      responses = JSON.parse(testResults.responses);
    } catch (e) {
      console.error("Failed to parse responses JSON:", e);
      responses = [];
    }
  }

  const score = isArray
    ? responses.reduce((sum, r) => sum + (r.totalForThisImage ?? 0), 0)
    : testResults?.score ?? 0;
  const totalPossibleScore = isArray
    ? responses.length * 2
    : testResults?.totalPossibleScore ?? responses.length * 2;
  // --- End of score calculation logic ---
   console.log("ResultsDisplay Debug:", {
    testResults,
    isArray,
    responses,
    score,
    totalPossibleScore,
    responsesLength: responses?.length,
    responsesType: typeof testResults?.responses,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Each child will animate 0.2s after the previous one
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

 return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-4 md:p-6 flex items-center justify-center overflow-hidden">
      {/* ADDED: Decorative background glows for depth */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-300/50 rounded-full filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-400/50 rounded-full filter blur-3xl opacity-70 animate-pulse animation-delay-2000"></div>

      <motion.div
        // Use variants for clean, staggered animations
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        // CHANGED: Main card with a subtle gradient, backdrop blur, and more padding
        className="relative z-10 max-w-lg w-full mx-auto bg-gradient-to-br from-white/95 to-blue-50/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 text-center p-8 md:p-12"
      >
        <motion.div variants={itemVariants} className="flex justify-center items-center gap-3">
          <FaTrophy className="text-3xl text-yellow-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 tracking-wide">
            {t("wellDoneTitle")}
          </h1>
        </motion.div>
        
        <motion.p variants={itemVariants} className="mt-3 text-base md:text-lg text-blue-700/80">
          {t("encouragingResultsMessage")}
        </motion.p>
        
        {/* CHANGED: Score is now in a visually distinct circle */}
        <motion.div
          variants={itemVariants}
          className="my-8 flex justify-center"
        >
          <div className="relative w-48 h-48 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-full shadow-2xl border-4 border-white/80">
            <h2 className="text-sm font-semibold text-blue-200 uppercase tracking-widest">{t("finalScoreTitle")}</h2>
            <p className="text-6xl font-extrabold text-white mt-1" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
              {score ?? 0}<span className="text-4xl opacity-70">/{totalPossibleScore}</span>
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.button
            whileHover={{ scale: 1.05, y: -3, boxShadow: '0 10px 20px -5px rgba(30, 64, 175, 0.4)' }}
            whileTap={{ scale: 0.95, y: 0 }}
            onClick={onRetakeTest}
            className="flex items-center justify-center gap-3 mx-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300"
          >
            <FaRedo />
            {t("buttonTakeNewTest")}
          </motion.button>
        </motion.div>

      </motion.div>
    </div>
  );
}