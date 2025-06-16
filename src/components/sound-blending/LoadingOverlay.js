"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * LoadingOverlay component displays a full-screen overlay with a loading animation and message.
 */
export default function LoadingOverlay({ message = "Processing..." }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-xl p-6 shadow-xl flex flex-col items-center max-w-xs">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{
                rotate: { repeat: Infinity, duration: 1.5, ease: "linear" },
                scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
              }}
              className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600"
            />
          </div>
          <p className="mt-4 text-blue-800 font-medium text-center">{message}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
