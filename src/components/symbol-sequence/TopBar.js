"use client"

// components/symbol-sequence/TopBar.js

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { IoIosInformationCircleOutline } from "react-icons/io"

const TopBar = ({ currentRound, totalRounds, score, onShowInfo, onSkipTest, t }) => {
  const router = useRouter()

  const handleShowInfo = () => {
    onShowInfo()
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-0 left-0 right-0 z-30 p-4"
    >
      <div className="flex justify-end items-center">
     
      
        {currentRound > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-4 bg-black/60 backdrop-blur-md rounded-full px-6 py-3 border-2 border-[#d9a24b]/50"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#f3c969] font-bold text-lg">{t("progress")}:</span>
              <div className="flex gap-1">
                {Array(totalRounds)
                  .fill(0)
                  .map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index < currentRound ? "bg-gradient-to-r from-[#f3c969] to-[#d9a24b] shadow-lg" : "bg-white/30"
                      }`}
                    />
                  ))}
              </div>
            </div>

            <div className="w-px h-6 bg-[#d9a24b]/50"></div>

            <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2 text-[#f3c969]">
              <span className="text-3xl">🏆</span>
              <span className="font-bold text-xl">
                {score}/{totalRounds}
              </span>
            </motion.div>
          </motion.div>
        )}

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShowInfo}
            className="p-3 bg-gradient-to-r from-[#d9a24b] to-[#f3c969] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#f3c969]/30"
          >
            <IoIosInformationCircleOutline className="text-3xl text-white" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSkipTest}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-red-400"
          >
            <span className="text-2xl">🚪</span>
            <span className="font-semibold text-lg">{t("skipTest")}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default TopBar
