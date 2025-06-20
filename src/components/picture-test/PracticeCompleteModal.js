// components/PictureTest/PracticeCompleteModal.jsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";

// Ensure this path is correct and the image exists in your public folder
const TIDEPOOL_BACKGROUND_IMG_PATH = "/picture-test/backgroundImage.png";

export default function PracticeCompleteModal({
  t,
  onStartMainTest,
  evaluationResult,
}) {
  let practiceFeedbackMessage = "";
  let feedbackMessageColor = "text-white/90"; // Default color

  if (evaluationResult && t) {
    // Ensure t is available
    if (!evaluationResult.sawImage) {
      practiceFeedbackMessage =
        "Practice: You indicated you couldn't see the image.";
      feedbackMessageColor = "text-yellow-300/90";
    } else if (evaluationResult.score === 2) {
      practiceFeedbackMessage =
        "Practice: Great job! You identified it correctly.";
      feedbackMessageColor = "text-green-300/90";
    } else {
      practiceFeedbackMessage = "Practice: Good try!";
      feedbackMessageColor = "text-red-300/90";
    }
  } else if (evaluationResult) {
    if (!evaluationResult.sawImage)
      practiceFeedbackMessage = "Couldn't see image.";
    else if (evaluationResult.score === 2) practiceFeedbackMessage = "Correct!";
    else practiceFeedbackMessage = "Incorrect.";
  }

  return (
    <>
      <div className="fixed inset-0 z-40">
        {TIDEPOOL_BACKGROUND_IMG_PATH && (
          <Image
            src={TIDEPOOL_BACKGROUND_IMG_PATH}
            alt={t ? t("tidepoolBackgroundAlt") : "Tidepool background"}
            fill
            style={{ objectFit: "cover" }}
            className="filter blur-md"
            priority
            sizes="100vw"
          />
        )}
        <motion.div
          className="absolute inset-0 bg-[#3C6E71]/40"
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
          className="bg-gradient-to-br from-[#4B7F52]/80 via-[#6CB4A3]/70 to-[#A3D8D0]/80
                     backdrop-blur-xl rounded-2xl
                     p-5 sm:p-6
                     border-2 border-[#FFE57F]/30 shadow-2xl
                     max-w-md w-full
                     text-center"
        >
          <motion.h2
            className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
          >
            {"Practice Complete!"}
          </motion.h2>

          {practiceFeedbackMessage && (
            <p
              className={`text-base sm:text-lg font-semibold mb-6 sm:mb-8 ${feedbackMessageColor}`}
            >
              {practiceFeedbackMessage}{" "}
            </p>
          )}

          <p className="text-base sm:text-lg text-white mb-6 sm:mb-8 leading-relaxed">
            {"Well done! The main test will start now. Are you ready?"}
          </p>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartMainTest}
            className="flex items-center justify-center gap-2
                       py-2.5 px-5 sm:py-3 sm:px-6
                       rounded-xl font-semibold
                       text-sm sm:text-base
                       shadow-lg transition-all duration-300
                       bg-gradient-to-r from-[#FFCAD4] to-[#6CB4A3] 
                       text-white /* Changed text color to white */
                       border-2 border-white/80 /* Added white border with slight transparency */
                       hover:from-[#FFCAD4]/90 hover:to-[#3C6E71] hover:border-white /* Keep text white, ensure border remains white on hover */
                       focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3C6E71]/50 /* Added focus states */
                       mx-auto"
          >
            <FaPlay className="mt-0.5" />
            {"Start Main Test"}
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
