"use client"; // This component uses framer-motion, which requires client-side execution.

import { motion } from "framer-motion";
import { CheckCircle, Send } from "lucide-react"; // Importing icons

/**
 * ResultsScreen component displays the final scores after the test is completed.
 */
export default function ResultsScreen({
  forwardScore,
  reverseScore,
  STARTING_FORWARD_SEQUENCES,
  STARTING_REVERSE_SEQUENCES,
  onSubmitResults,
  suppressResultPage,
  t,
}) {
  // Calculate final score
  const finalScore = Math.round((forwardScore + reverseScore) / 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 max-w-sm sm:max-w-xl md:max-w-2xl mx-auto mt-6 sm:mt-10 border border-blue-200 text-center flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]"
    >
      <CheckCircle size={64} className="sm:size-80 mx-auto text-blue-600 mb-6" />
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 sm:mb-10">
        {t("challenge_complete")}!
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10 w-full">
        <div className="bg-blue-50 p-6 sm:p-8 rounded-xl">
          <h3 className="text-lg sm:text-xl text-gray-700 mb-2 sm:mb-3">{t("forward_score")}</h3>
          <p className="text-3xl sm:text-4xl font-bold text-blue-600">
            {forwardScore} / {STARTING_FORWARD_SEQUENCES.length}
          </p>
        </div>
        <div className="bg-blue-50 p-6 sm:p-8 rounded-xl">
          <h3 className="text-lg sm:text-xl text-gray-700 mb-2 sm:mb-3">{t("reverse_score")}</h3>
          <p className="text-3xl sm:text-4xl font-bold text-blue-600">
            {reverseScore} / {STARTING_REVERSE_SEQUENCES.length}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 sm:p-10 rounded-xl mb-8 sm:mb-10 w-full">
        <h3 className="text-xl sm:text-2xl text-gray-700 mb-2 sm:mb-3">{t("final_score")}</h3>
        <p className="text-5xl sm:text-6xl font-extrabold text-blue-600">
          {finalScore} / 10
        </p>
      </div>

      {!suppressResultPage && (
        <motion.button
          onClick={onSubmitResults}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white text-lg sm:text-xl font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300 hover:shadow-lg"
        >
          <Send size={20} className="sm:size-24" />
          <span>{t("submit_results")}</span>
        </motion.button>
      )}
    </motion.div>
  );
}
