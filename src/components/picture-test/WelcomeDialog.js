// components/PictureTest/WelcomeDialog.js
"use client";
import { motion } from "framer-motion";
import Image from 'next/image';
import { useState } from 'react';
import { FaCheck, FaChevronRight, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import EnhanceExperience from "@/components/EnhanceExperience";

// Images from public/picture-test/ folder
const TIDEPOOL_BACKGROUND_IMG_PATH = "/picture-test/backgroundImage.png";
const MIRRORFISH_CHARACTER_IMG_PATH = "/picture-test/characterImage.png";

export default function WelcomeDialog({
  dialogIntroTexts,
  currentDialog,
  handleNextDialog,
  t,
}) {
  const router = useRouter();
  const [showEnhanceExperience, setShowEnhanceExperience] = useState(false);

  // Check if we're on the last dialog to show fullscreen option
  const isLastDialog = currentDialog === dialogIntroTexts.length - 1;

  const handleStartGame = () => {
    handleNextDialog(); // Proceed to the game
  };

  const handleButtonClick = () => {
    if (isLastDialog) {
      // Show fullscreen enhancement option before starting
      setShowEnhanceExperience(true);
    } else {
      handleNextDialog();
    }
  };

  return (
    <>
      {/* Background Image Container */}
      <div className="fixed inset-0 z-40">
        <Image
          src={TIDEPOOL_BACKGROUND_IMG_PATH}
          alt={t('tidepoolBackgroundAlt') || "Tidepool background"}
          fill // Replaces layout="fill"
          style={{ objectFit: "cover" }} // Use style for objectFit
          className="filter blur-md"
          priority
          sizes="100vw" // Good practice for fill images
        />
        <motion.div
          className="absolute inset-0 bg-[#3C6E71]/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Back to Map Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => router.push("/take-tests?skipStart=true")}
        className="fixed top-4 left-4 z-[70] flex items-center gap-2.5 bg-gradient-to-r from-white/90 to-teal-100/90 hover:from-white hover:to-teal-50 text-teal-900 font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all backdrop-blur-sm border border-white/50"
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft className="text-teal-700" />
        {t("backToMap") || "Back to Map"}
      </motion.button>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative max-w-7xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-12"
        >
          {/* Mirrorfish Character Container - Needs to be relative for fill to work */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
            transition={{
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            }}
            className="flex-shrink-0 order-2 lg:order-1 relative h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96" // Parent needs dimensions
          >
            <Image
              src={MIRRORFISH_CHARACTER_IMG_PATH}
              alt={t('mirrorfishCharacterAlt') || "Mira the Mirrorfish"}
              fill // Replaces layout="fill"
              style={{ objectFit: "contain" }} // Use style for objectFit
              priority
              sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px" // Example sizes
            />
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-[#3C6E71]/80 via-[#6CB4A3]/60 to-[#A3D8D0]/80 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border-2 border-[#FFE57F]/20 shadow-2xl flex-1 relative overflow-hidden w-full max-w-none lg:max-w-4xl order-1 lg:order-2"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#A3D8D0] via-[#6CB4A3] to-[#3C6E71]"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#A3D8D0]/20 rounded-full filter blur-2xl opacity-70"></div>

            <motion.div
              key={currentDialog}
              initial={{ opacity: 0.5, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-white mb-8 min-h-[10rem] sm:min-h-[12rem] flex items-center justify-center font-serif leading-relaxed text-center px-4"
              style={{ textShadow: "0 0 8px rgba(163, 216, 208, 0.7)" }}
            >
              {dialogIntroTexts[currentDialog]}
            </motion.div>

            <div className="flex justify-center gap-3 mb-8">
              {dialogIntroTexts.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 rounded-full ${ index <= currentDialog ? "bg-[#FFE57F] shadow-[0_0_10px_2px_rgba(255,229,127,0.7)]" : "bg-[#FFE57F]/30"}`}
                  animate={ index === currentDialog ? { scale: [1, 1.3, 1], y: [0, -5, 0] } : { scale: 1, y: 0 }}
                  transition={ index === currentDialog ? { duration: 1.5, repeat: Infinity, repeatType: "loop" } : { duration: 0.3 }}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleButtonClick}
                className={`flex items-center justify-center gap-3 py-3 px-6 sm:py-4 sm:px-8 lg:px-12 rounded-2xl font-semibold text-lg lg:text-xl shadow-lg transition-all duration-300
                  ${ currentDialog < dialogIntroTexts.length - 1
                    ? "bg-gradient-to-r from-[#FFCAD4] via-[#FDF6E3] to-[#FFE57F] text-[#3E2F2F] hover:from-[#FFCAD4]/90 hover:via-[#FDF6E3]/90 hover:to-[#FFE57F]/90 hover:shadow-[#FFE57F]/50"
                    : "bg-gradient-to-r from-[#FFCAD4] to-[#6CB4A3] text-white hover:from-[#FFCAD4]/90 hover:to-[#3C6E71] hover:shadow-[#6CB4A3]/50"
                  }`}
              >
                {currentDialog < dialogIntroTexts.length - 1 ? (
                  <>
                    <span className="drop-shadow-sm text-[#3E2F2F]">{t("pictureTestButtonNextDialog")}</span>
                    <FaChevronRight className="mt-0.5 drop-shadow-sm text-[#3E2F2F]" />
                  </>
                ) : (
                  <>
                    <span className="drop-shadow-sm text-[#3E2F2F]">{t("imReady")}</span>
                    <FaCheck className="mt-0.5 drop-shadow-sm text-[#3E2F2F]" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Fullscreen Enhancement Modal */}
      {showEnhanceExperience && (
        <EnhanceExperience
          onStartGame={handleStartGame}
          translations={{
            enhanceExperience: t("enhanceExperience"),
            fullScreenRecommendation: t("fullScreenRecommendation"),
            enterFullscreen: t("enterFullscreen"),
            startGame: t("startGame"),
            quit: t("quit")
          }}
          autoTrigger={true}
          showButton={false}
        />
      )}
    </>
  );
}