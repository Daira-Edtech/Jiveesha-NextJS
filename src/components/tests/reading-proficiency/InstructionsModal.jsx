// InstructionsModal.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Mic, Upload, CheckCircle, Repeat, PlayCircle } from "lucide-react";

export default function InstructionsModal({ isOpen, onClose, t }) {
  const instructions = [
    { icon: <BookOpen className="w-5 h-5 text-amber-300" />, text: t("instructionPoint1") },
    { icon: <Mic className="w-5 h-5 text-red-400" />, text: t("instructionPoint7") },
    { icon: <Upload className="w-5 h-5 text-sky-400" />, text: t("instructionPoint3") },
    { icon: <PlayCircle className="w-5 h-5 text-yellow-400" />, text: t("instructionPoint4") },
    { icon: <Repeat className="w-5 h-5 text-orange-400" />, text: t("instructionPoint5") },
    { icon: <CheckCircle className="w-5 h-5 text-green-400" />, text: t("instructionPoint6") },
    { icon: <Mic className="w-5 h-5 text-gray-300" />, text: t("instructionPoint8") },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose} // Close modal on overlay click
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y:20 }}
            animate={{ scale: 1, opacity: 1, y:0 }}
            exit={{ scale: 0.9, opacity: 0, y:20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            // Themed background for modal content, similar to TutorialView bubble
            className="bg-gradient-to-br from-teal-700/80 via-teal-800/80 to-cyan-900/80 backdrop-blur-lg rounded-2xl p-6 max-w-lg w-full relative shadow-2xl border-2 border-white/20"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-300 hover:text-white transition-colors"
              aria-label={t("buttonHideInstructions")}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 text-center drop-shadow-md">
              {t("testInstructionsTitle")}
            </h2>
            <ul className="space-y-3 mb-6">
              {instructions.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-2.5 bg-white/5 rounded-md border border-white/10"
                >
                  <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                  <span className="text-gray-200 text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.03, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="w-full py-2.5 px-6 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-md shadow-lg transition-all"
            >
              {t("buttonHideInstructions") || "Close"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}