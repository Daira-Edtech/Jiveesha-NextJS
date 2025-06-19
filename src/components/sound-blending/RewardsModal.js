"use client"

// components/sound-blending/RewardsModal.js

import { motion } from "framer-motion"

const RewardsModal = ({ show, onClose, t }) => {
  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 z-[50]"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25, duration: 0.4 }}
        className="relative max-w-md sm:max-w-xl w-full bg-gradient-to-br from-cyan-900/90 to-blue-900/90 rounded-3xl p-8 sm:p-10 border-4 border-cyan-400/50 shadow-2xl text-white"
      >
        <div className="text-center">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-6 drop-shadow-sm"
          >
            {t("rewardsTitle")} <span className="text-3xl sm:text-4xl">🌟</span>
          </motion.h2>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 15 }}
            className="my-6 sm:my-8"
          >
            <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl shadow-lg border-2 border-cyan-400/50 flex items-center justify-center text-8xl">
              🐚
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <p className="text-lg text-cyan-200 mb-2">{t("rewardEarned")}</p>
            <p className="text-xl font-bold text-white">{t("soundMasterShell")}</p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(6, 182, 212, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 text-white rounded-full text-lg sm:text-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            onClick={onClose}
          >
            {t("returnToResults")}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RewardsModal
