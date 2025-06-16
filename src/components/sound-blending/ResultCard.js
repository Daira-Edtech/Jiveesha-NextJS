"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

/**
 * ResultCard component displays the outcome for a single word in the results screen.
 */
export default function ResultCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-lg shadow-md transition-all duration-300 ${
        item.isCorrect
          ? "bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-400"
          : "bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium text-blue-900">
          Word {index + 1}: <span className="font-bold">{item.word}</span>
        </span>
        <span
          className={`flex items-center font-bold ${
            item.isCorrect ? "text-green-600" : "text-red-600"
          }`}
        >
          {item.isCorrect ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-green-100 p-1 rounded-full"
            >
              <Check size={16} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-red-100 p-1 rounded-full"
            >
              <X size={16} />
            </motion.div>
          )}
        </span>
      </div>
      <div className="mt-2 text-sm text-blue-800">
        <p>
          You said:{" "}
          <span
            className={`font-medium ${
              item.isCorrect ? "text-green-600" : "text-red-500"
            }`}
          >
            {item.response || "No response"}
          </span>
        </p>
        {!item.isCorrect && (
          <p className="text-blue-700 mt-1">
            Correct answer: <span className="font-medium">{item.word}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
