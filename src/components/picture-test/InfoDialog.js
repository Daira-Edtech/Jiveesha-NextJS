// components/PictureTest/InfoDialog.jsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react"; // Added import for useMemo
import { FaLightbulb, FaMicrophone, FaMousePointer, FaTimes } from "react-icons/fa";

// Ensure this path is correct and the image exists in your public folder
const TIDEPOOL_BACKGROUND_IMG_PATH = "/picture-test/backgroundImage.png";

export default function InfoDialog({ t, onClose, title }) {
  const defaultTitle = t ? t("howToPlayTitle", "How to Play") : "How to Play";
  const dialogTitle = title || defaultTitle;

  // Memoize the instructions array. It will only recompute if 't' function instance changes.
  const instructions = useMemo(() => [
    {
      icon: <FaLightbulb className="text-yellow-300 text-2xl sm:text-3xl" />,
      text: t ? t("infoStep1", "You will be shown a series of pictures one by one.") : "You will be shown a series of pictures one by one.",
    },
    {
      icon: <FaMousePointer className="text-blue-300 text-2xl sm:text-3xl" />,
      text: t ? t("infoStep2", "For each picture, first tell us if you can see it clearly by clicking 'Yes' or 'No'.") : "For each picture, first tell us if you can see it clearly by clicking 'Yes' or 'No'.",
    },
    {
      icon: <FaMicrophone className="text-green-300 text-2xl sm:text-3xl" />,
      text: t ? t("infoStep3", "If you see it, you'll then be asked to say what it is and describe it. You can type or use your voice.") : "If you see it, you'll then be asked to say what it is and describe it. You can type or use your voice.",
    },
  ], [t]); // Dependency array includes 't'

  return (
    <>
      <div className="fixed inset-0 z-40">
        {TIDEPOOL_BACKGROUND_IMG_PATH && (
          <Image
            src={TIDEPOOL_BACKGROUND_IMG_PATH}
            alt={t ? t('tidepoolBackgroundAlt', "Tidepool background") : "Tidepool background"}
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
          className="bg-gradient-to-br from-[#4A6D7C]/85 via-[#6A8A9A]/75 to-[#8AA7B4]/85
                     backdrop-blur-xl rounded-2xl
                     p-5 sm:p-6
                     border-2 border-[#B0C4DE]/50 shadow-2xl
                     max-w-lg w-full
                     text-white relative"
        >
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-white/70 hover:text-white transition-colors z-10"
            aria-label={t ? t("closeDialog", "Close dialog") : "Close dialog"}
          >
            <FaTimes size={22} />
          </button>

          <motion.h2
            className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
          >
            {dialogTitle}
          </motion.h2>

          <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
            {instructions.map((item, index) => (
              <motion.div
                key={index} // Using index as key is acceptable here as the list is static and order doesn't change
                className="flex items-start gap-3 sm:gap-4 p-3 bg-white/10 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
              >
                <div className="flex-shrink-0 pt-1">{item.icon}</div>
                <p className="text-sm sm:text-base leading-relaxed text-white/95">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex items-center justify-center gap-2
                       py-2.5 px-5 sm:py-3 sm:px-6
                       rounded-xl font-semibold
                       text-sm sm:text-base
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