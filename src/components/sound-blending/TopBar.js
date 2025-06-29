"use client"

// components/sound-blending/TopBar.js

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { IoIosInformationCircleOutline } from "react-icons/io"

const TopBar = ({ currentWord, totalWords, score, onShowInfo, onSkipTest, t }) => {
  const router = useRouter()

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-0 left-0 right-0 z-30 p-4"
    >
      <div className="flex justify-end items-center">
       

       

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={onShowInfo}
            className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-cyan-300/30"
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
