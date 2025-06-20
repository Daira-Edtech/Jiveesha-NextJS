// components/PictureTest/LoadingSpinner.js
"use client";
import { motion } from "framer-motion";

export default function LoadingSpinner({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"
      />
      {text && (
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-blue-700 text-lg font-medium"
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
}