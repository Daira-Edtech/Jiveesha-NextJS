// TestInstructionsScreen.jsx
"use client";

import { motion } from "framer-motion";
import { BookOpen, Mic, Upload, CheckCircle, Repeat, PlayCircle, ChevronRight } from "lucide-react";

export default function TestInstructionsScreen({ onStartDemo, t }) {
  const instructions = [
    { icon: <BookOpen className="w-6 h-6 text-amber-300" />, text: t("instructionPoint1") },
    { icon: <Mic className="w-6 h-6 text-red-400" />, text: t("instructionPoint7") },
    { icon: <Upload className="w-6 h-6 text-sky-400" />, text: t("instructionPoint3") },
    { icon: <PlayCircle className="w-6 h-6 text-yellow-400" />, text: t("instructionPoint4") },
    { icon: <Repeat className="w-6 h-6 text-orange-400" />, text: t("instructionPoint5") },
    { icon: <CheckCircle className="w-6 h-6 text-green-400" />, text: t("instructionPoint6") },
    { icon: <Mic className="w-6 h-6 text-gray-400" />, text: t("instructionPoint8") },
  ];

  return (
    // This div is a container for the content, the main coral background is from Test6Controller
    <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-160px)]">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        // Style similar to TestSessionView's control panel or a themed card
        className="bg-black/20 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-xl border border-white/20 w-full"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 text-center drop-shadow-lg">
          {t("testInstructionsTitle")}
        </h2>
        <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
          {instructions.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              // Consistent list item styling
              className="flex items-start gap-3 p-3 bg-white/10 rounded-lg shadow-sm border border-white/10"
            >
              <div className="flex-shrink-0 mt-1">{item.icon}</div>
              <span className="text-gray-100 text-sm sm:text-base">{item.text}</span>
            </motion.li>
          ))}
        </ul>
        <motion.button
          whileHover={{ scale: 1.05, y: -2, boxShadow: "0px 8px 20px rgba(0,0,0,0.3)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartDemo}
          // Button style consistent with main test action buttons
          className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-lg shadow-xl text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
        >
          {t("buttonStartDemo")} <ChevronRight className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </div>
  );
}