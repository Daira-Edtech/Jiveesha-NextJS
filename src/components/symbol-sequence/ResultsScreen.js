"use client"

// components/symbol-sequence/ResultsScreen.js

import { motion } from "framer-motion"

const ResultsScreen = ({ feedback, userSequence, currentSequence, currentRound, totalRounds, onContinue, t }) => {
  const isCorrect = feedback.includes(t("correct"))

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-gradient-to-br from-[#1a2a3a]/80 to-[#3b2f1d]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(217,162,75,0.7)] p-12 w-full max-w-4xl text-center border-2 border-[#d9a24b]/30 relative overflow-hidden"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {/* Glow effects */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#d9a24b]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#f3c969]/10 rounded-full filter blur-3xl"></div>

        {/* Result Feedback */}
        <motion.h2
          className={`text-4xl font-bold mb-12 tracking-wider ${isCorrect ? "text-[#f3c969]" : "text-[#d9a24b]"}`}
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          style={{
            textShadow: isCorrect ? "0 0 20px rgba(243, 201, 105, 0.7)" : "0 0 20px rgba(217, 162, 75, 0.7)",
          }}
        >
          {feedback}
        </motion.h2>

        {/* Comparison Grid */}
        <div className="space-y-16 mt-10 mb-16">
          {/* User Sequence Row */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-[#f7f1e3] tracking-wider">{t("yourSequence").toUpperCase()}</h3>
            <div className="flex justify-center flex-wrap gap-8">
              {userSequence.map((symbol, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`w-28 h-28 flex items-center justify-center text-6xl rounded-2xl ${
                      symbol === currentSequence[index]
                        ? "bg-[#3b2f1d]/20 border-2 border-[#f3c969] shadow-[0_0_20px_rgba(243,201,105,0.3)]"
                        : "bg-[#1a2a3a]/20 border-2 border-[#d9a24b] shadow-[0_0_20px_rgba(217,162,75,0.3)]"
                    }`}
                  >
                    {symbol}
                  </div>
                  {symbol !== currentSequence[index] && (
                    <motion.div
                      className="absolute -top-3 -right-3 w-8 h-8 bg-[#d9a24b] rounded-full flex items-center justify-center text-[#3b2f1d] text-sm font-bold shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      !
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Correct Sequence Row */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-[#f7f1e3] tracking-wider">
              {t("correctSequence").toUpperCase()}
            </h3>
            <div className="flex justify-center flex-wrap gap-8">
              {currentSequence.map((symbol, index) => (
                <motion.div
                  key={index}
                  className="w-28 h-28 flex items-center justify-center text-6xl rounded-2xl bg-[#3b2f1d]/20 border-2 border-[#f3c969] shadow-[0_0_20px_rgba(243,201,105,0.3)]"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {symbol}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <motion.button
          onClick={onContinue}
          className="mt-8 bg-gradient-to-r from-[#f3c969] to-[#d9a24b] text-[#3b2f1d] font-bold py-4 px-12 rounded-xl text-lg shadow-lg hover:shadow-[#d9a24b]/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {currentRound >= totalRounds ? t("viewResults") : t("continue")}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default ResultsScreen
