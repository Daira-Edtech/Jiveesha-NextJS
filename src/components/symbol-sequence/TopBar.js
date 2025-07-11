"use client";

// components/symbol-sequence/TopBar.js

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { IoIosInformationCircleOutline } from "react-icons/io";

// CHANGED: Removed unused props (currentRound, totalRounds, score)
const TopBar = ({ onShowInfo, onSkipTest, t }) => {
  const router = useRouter();

  const handleShowInfo = () => {
    onShowInfo();
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-0 left-0 right-0 z-30 p-4"
    >
      {/* CHANGED: Reverted to a simple flex container to align items to the end (right). */}
      <div className="flex justify-end items-center">

        {/* REMOVED: The entire progress bar section and the empty spacer div have been deleted. */}

        {/* This div now sits directly in the flex container and is pushed to the right. */}
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
  );
};

export default TopBar;