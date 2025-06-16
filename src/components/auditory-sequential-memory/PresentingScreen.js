"use client"; // This component uses framer-motion, which requires client-side execution.

import { AnimatePresence, motion } from "framer-motion";

/**
 * PresentingScreen component displays the digits one by one during the presentation phase.
 */
export default function PresentingScreen({ displayedDigit, digitIndex, t }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-6 sm:space-y-10 min-h-[calc(100vh-10rem)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative h-60 w-60 sm:h-80 sm:w-80 flex items-center justify-center">
        <AnimatePresence>
          {displayedDigit !== null && (
            <motion.div
              key={digitIndex} // Key ensures re-animation on new digit
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
                transition: { type: "spring", stiffness: 200, damping: 15 },
              }}
              exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-7xl sm:text-9xl font-bold text-blue-600 p-8 sm:p-10 bg-white rounded-2xl shadow-lg border border-gray-100">
                {displayedDigit}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        className="text-xl sm:text-2xl font-medium text-gray-700 bg-blue-50 px-6 py-3 sm:px-8 sm:py-4 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("listen_carefully")}
      </motion.div>
    </motion.div>
  );
}
