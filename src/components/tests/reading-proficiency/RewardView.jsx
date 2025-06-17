"use client";

import { motion } from "framer-motion";

export default function RewardView({ shellImage, onClose, t }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: "spring", damping: 15, stiffness: 200 }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="bg-gradient-to-br from-yellow-300 to-amber-400 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-yellow-200 max-w-md text-center">
        <motion.img
          src={shellImage}
          className="w-36 h-36 mx-auto mb-4"
          alt={t("altEarnedShellImage")}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 15, -15, 0, 360],
          }}
          transition={{
            y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 5, repeat: Infinity, ease: "linear" },
          }}
        />
        <h3
          className="text-3xl font-bold text-yellow-900 mb-2"
          style={{ textShadow: "1px 1px 2px white" }}
        >
          {t("titleShellOfFluencyEarned")}
        </h3>
        <p className="text-yellow-800 text-lg mb-6">
          {t("messagePronunciationShining")}
        </p>
        <motion.button
          className="px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full font-bold shadow-lg text-lg"
          whileHover={{
            scale: 1.05,
            y: -2,
            boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
        >
          {t("buttonCollectTreasure")}
        </motion.button>
      </div>
    </motion.div>
  );
}