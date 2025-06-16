"use client";

import { motion } from "framer-motion";

/**
 * ProgressBar component displays the game's progress as a horizontal bar.
 */
export default function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
}
