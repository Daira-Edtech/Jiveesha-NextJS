"use client"

// components/auditory-sequential/FinalResultsScreen.js

import { motion } from "framer-motion"

const FinalResultsScreen = ({ score, onFinishTest, onViewRewards, t }) => {
  const totalPossible = score.forwardTotal + score.reverseTotal
  const totalCorrect = score.forward + score.reverse
  const percentage = Math.round((totalCorrect / totalPossible) * 100)

  const getPerformanceMessage = () => {
    if (percentage >= 90) return t("excellentMemory")
    if (percentage >= 75) return t("veryGoodJob")
    if (percentage >= 60) return t("goodEffort")
    return t("keepPracticing")
  }

  const getPerformanceEmoji = () => {
    if (percentage >= 90) return "🌟"
    if (percentage >= 75) return "🎵"
    if (percentage >= 60) return "🌊"
    return "💪"
  }

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
        className="relative max-w-md sm:max-w-xl w-full bg-gradient-to-br from-amber-900/90 to-yellow-900/90 rounded-3xl p-8 sm:p-10 border-4 border-amber-400/50 shadow-2xl text-white"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 180, damping: 12 }}
            className="mb-5"
          >
            <span className="text-6xl sm:text-8xl drop-shadow-lg">{getPerformanceEmoji()}</span>
          </motion.div>

          <h2 className="text-2xl sm:text-4xl font-bold text-amber-300 mb-3 drop-shadow-sm">{t("testResults")}</h2>

          <p className="text-base sm:text-lg text-white/80 mb-4">{t("memoryTestCompleted")}</p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg text-amber-200 mb-8"
          >
            {getPerformanceMessage()}
          </motion.div>

          {/* Detailed Score Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-black/30 rounded-2xl p-6 mb-6 shadow-lg border border-amber-400/30"
          >
            <p className="text-lg sm:text-xl text-amber-300 font-semibold mb-4">{t("yourScore")}</p>

            {/* Overall Score */}
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <motion.span
                key={totalCorrect}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-4xl sm:text-6xl font-bold text-amber-300 drop-shadow-md"
              >
                {totalCorrect}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-xl sm:text-3xl text-amber-400 font-medium"
              >
                / {totalPossible}
              </motion.span>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-amber-800/30 rounded-lg p-3">
                <p className="text-amber-200 font-semibold">{t("forwardSequences")}</p>
                <p className="text-white text-lg">
                  {score.forward} / {score.forwardTotal}
                </p>
              </div>
              <div className="bg-amber-800/30 rounded-lg p-3">
                <p className="text-amber-200 font-semibold">{t("reverseSequences")}</p>
                <p className="text-white text-lg">
                  {score.reverse} / {score.reverseTotal}
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-amber-200 mt-4"
            >
              {percentage}% {t("accuracy")}
            </motion.div>
          </motion.div>

          {totalCorrect >= Math.ceil(totalPossible * 0.7) && (
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
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(180, 83, 9, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white rounded-full text-lg sm:text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            onClick={onFinishTest}
          >
            {t("finishTest")} <span className="text-xl">🏁</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default FinalResultsScreen
