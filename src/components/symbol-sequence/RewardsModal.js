"use client"

// components/symbol-sequence/RewardsModal.js

import { motion } from "framer-motion"
import Image from "next/image"
import rewardImagePlaceholder from "../../../public/symbol-sequence/Mystical-Runescape.png"

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
        className="relative max-w-md sm:max-w-xl w-full bg-gradient-to-br from-[#1a2a3a]/90 to-[#3b2f1d]/90 rounded-3xl p-8 sm:p-10 border-4 border-[#f3c969]/50 shadow-2xl text-[#f7f1e3]"
      >
        <div className="text-center">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-[#f3c969] mb-6 drop-shadow-sm"
          >
            {t("rewardsTitle")} <span className="text-3xl sm:text-4xl">🌟</span>
          </motion.h2>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 15 }}
            className="my-6 sm:my-8"
          >
            <Image
              src={rewardImagePlaceholder || "/placeholder.svg"}
              alt="Mystical Crystal Reward"
              width={256}
              height={256}
              className="w-48 h-48 sm:w-64 sm:h-64 mx-auto object-contain rounded-xl shadow-lg border-2 border-[#f3c969]/50"
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(243, 201, 105, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-8 py-3 sm:py-4 bg-gradient-to-r from-[#d9a24b] via-[#f3c969] to-[#d9a24b] text-[#3b2f1d] rounded-full text-lg sm:text-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
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
