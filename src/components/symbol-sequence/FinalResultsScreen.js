"use client"

// components/symbol-sequence/FinalResultsScreen.js

import { motion } from "framer-motion"

const FinalResultsScreen = ({ score, onFinishTest, onViewRewards, t }) => {
  const handleFinishTest = () => {
    if (onFinishTest) {
      onFinishTest({ correct: score.correct, total: score.total });
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 z-40"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25, duration: 0.4 }}
        className="relative max-w-md sm:max-w-xl w-full bg-gradient-to-br from-[#1a2a3a]/90 to-[#3b2f1d]/90 rounded-3xl p-8 sm:p-10 border-4 border-[#d9a24b]/50 shadow-2xl text-[#f7f1e3]"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 180, damping: 12 }}
            className="mb-5"
          >
            <span className="text-6xl sm:text-8xl drop-shadow-lg">🏆</span>
          </motion.div>

          <h2 className="text-2xl sm:text-4xl font-bold text-[#f3c969] mb-3 drop-shadow-sm">{t("testResults")}</h2>

          <p className="text-base sm:text-lg text-[#f7f1e3]/80 mb-8">{t("testCompletedMessage")}</p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-black/30 rounded-2xl p-6 mb-10 shadow-lg border border-[#d9a24b]/30"
          >
            <p className="text-lg sm:text-xl text-[#f3c969] font-semibold mb-2">{t("yourScore")}</p>
            <div className="flex items-baseline justify-center gap-2">
              <motion.span
                key={score.correct}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-6xl sm:text-8xl font-bold text-[#f3c969] drop-shadow-md"
              >
                {score.correct}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-2xl sm:text-4xl text-[#d9a24b] font-medium"
              >
                / {score.total}
              </motion.span>
            </div>
          </motion.div>

          {score.correct > 7 && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(34, 197, 94, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-full text-lg sm:text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mb-4"
              onClick={onViewRewards}
            >
              {t("viewRewards")} <span className="text-xl">🎁</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(217, 162, 75, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-8 py-3 sm:py-4 bg-gradient-to-r from-[#d9a24b] via-[#f3c969] to-[#d9a24b] text-[#3b2f1d] rounded-full text-lg sm:text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            onClick={handleFinishTest}
          >
            {t("finishTest")} <span className="text-xl">🏁</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default FinalResultsScreen
