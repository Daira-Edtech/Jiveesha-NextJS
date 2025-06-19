"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";
import {
  FaLightbulb,
  FaMicrophone,
  FaMousePointer,
  FaTimes,
} from "react-icons/fa";

const TIDEPOOL_BACKGROUND_IMG_PATH = "/picture-test/backgroundImage.png";

export default function InfoDialog({ t, onClose, title }) {
  const defaultTitle = t ? t("howToPlayTitle", "How to Play") : "How to Play";
  const dialogTitle = title || defaultTitle;

  const instructions = useMemo(
    () => [
      {
        icon: <FaLightbulb className="text-yellow-300 text-3xl sm:text-4xl" />,
        text: t
          ? t("infoStep1", "You will be shown a series of pictures one by one.")
          : "You will be shown a series of pictures one by one.",
      },
      {
        icon: <FaMousePointer className="text-blue-300 text-3xl sm:text-4xl" />,
        text: t
          ? t(
              "infoStep2",
              "For each picture, first tell us if you can see it clearly by clicking 'Yes' or 'No'."
            )
          : "For each picture, first tell us if you can see it clearly by clicking 'Yes' or 'No'.",
      },
      {
        icon: <FaMicrophone className="text-green-300 text-3xl sm:text-4xl" />,
        text: t
          ? t(
              "infoStep3",
              "If you see it, you'll then be asked to say what it is and describe it. You can type or use your voice."
            )
          : "If you see it, you'll then be asked to say what it is and describe it. You can type or use your voice.",
      },
    ],
    [t]
  );

  return (
    <>
      <div className="fixed inset-0 z-40">
        {TIDEPOOL_BACKGROUND_IMG_PATH && (
          <Image
            src={TIDEPOOL_BACKGROUND_IMG_PATH}
            alt={
              t
                ? t("tidepoolBackgroundAlt", "Tidepool background")
                : "Tidepool background"
            }
            fill
            style={{ objectFit: "cover" }}
            className="filter blur-md"
            priority
            sizes="100vw"
          />
        )}
        <motion.div
          className="absolute inset-0 bg-[#3C6E71]/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="bg-gradient-to-br from-[#1fc8db]/90 via-[#2cb5a0]/90 to-[#38ef7d]/90
                     backdrop-blur-xl rounded-2xl
                     p-7 sm:p-10
                     border-2 border-[#B0C4DE]/50 shadow-2xl
                     max-w-2xl w-full
                     text-white relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
            aria-label={t ? t("closeDialog", "Close dialog") : "Close dialog"}
          >
            <FaTimes size={28} />
          </button>

          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
          >
            {dialogTitle}
          </motion.h2>

          <div className="space-y-6 sm:space-y-7 mb-8 sm:mb-10">
            {instructions.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 sm:gap-5 p-4 bg-white/10 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
              >
                <div className="flex-shrink-0 pt-1">{item.icon}</div>
                <p className="text-lg sm:text-xl leading-relaxed text-white/95">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.07, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={onClose}
            className="flex items-center justify-center gap-2
                       py-3 px-7 sm:py-4 sm:px-10
                       rounded-xl font-semibold
                       text-lg sm:text-xl
                       shadow-lg transition-all duration-300
                       bg-gradient-to-r from-[#6CB4A3] to-[#4B7F52]
                       text-white
                       border-2 border-white/80
                       hover:from-[#6CB4A3]/90 hover:to-[#3C6E71]
                       focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3C6E71]/50
                       mx-auto"
          >
            {t ? t("gotItButton", "Got it!") : "Got it!"}
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
