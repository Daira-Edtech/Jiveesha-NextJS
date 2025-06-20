"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import PropTypes from "prop-types";
import { useState } from "react";
import { FaCheck, FaChevronRight } from "react-icons/fa";
import EnhanceExperience from "@/components/EnhanceExperience";

// Import local images relative to this component's location
import localBackgroundImageForDialog from "../../../public/grapheme-test/backgroundImage.webp";
import birdCharacterImage from "../../../public/grapheme-test/characterImage.webp";

const WelcomeDialog = ({
  dialog,
  currentDialog,
  onNextDialog,
  onStartTest,
  t,
}) => {
  const [showEnhanceExperience, setShowEnhanceExperience] = useState(false);
  
  // Check if we're on the last dialog to show fullscreen option
  const isLastDialog = currentDialog === dialog.length - 1;

  const handleStartTest = () => {
    setShowEnhanceExperience(false);
    onStartTest();
  };

  const handleButtonClick = () => {
    if (isLastDialog) {
      // Show fullscreen enhancement option before starting test
      setShowEnhanceExperience(true);
    } else {
      onNextDialog();
    }
  };

  return (
    <>
      {/* Background with local image */}
      <div className="fixed inset-0 z-40">
        <Image
          src={localBackgroundImageForDialog}
          alt="Welcome dialog background"
          layout="fill"
          objectFit="cover"
          quality={70} // Slightly lower quality for blurred background can be fine
          className="filter blur-lg" // Apply blur effect
          priority // Important for LCP if this is the first thing seen
          placeholder="blur" // Use automatic blur placeholder
        />
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-blue-900/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main content container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative max-w-7xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-12"
        >
          {/* Character image */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
            transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" }}}
            className="flex-shrink-0 order-2 lg:order-1"
          >
            <Image
              src={birdCharacterImage} // Use imported local image
              alt="Riff & Raff Songbirds"
              width={384} // Provide intrinsic width for better performance and layout stability
              height={384} // Provide intrinsic height
              className="h-64 w-auto sm:h-80 lg:h-96 object-contain" // Tailwind for responsive display
              priority // If LCP
            />
          </motion.div>

          {/* Dialog box */}
          <motion.div
            className="bg-gradient-to-br from-purple-900/80 via-blue-800/60 to-purple-700/90 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border-2 border-blue-400/20 shadow-2xl flex-1 relative overflow-hidden w-full max-w-none lg:max-w-4xl order-1 lg:order-2"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-blue-500 to-blue-600"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-400/20 rounded-full filter blur-2xl"></div>

            {/* Dialog text */}
            <motion.div
              key={currentDialog} // For re-animation on change
              className="text-xl sm:text-2xl lg:text-3xl text-white mb-8 min-h-[10rem] sm:min-h-[12rem] flex items-center justify-center font-serif leading-relaxed text-center px-4"
              style={{ textShadow: "0 0 8px rgba(173, 216, 230, 0.7)" }}
              initial={{ opacity: 0.5, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {dialog[currentDialog]}
            </motion.div>

            {/* Progress indicators */}
            <div className="flex justify-center gap-3 mb-8">
              {dialog.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 rounded-full ${ index <= currentDialog ? "bg-blue-300 shadow-[0_0_10px_2px_rgba(100,200,255,0.7)]" : "bg-blue-300/30" }`}
                  animate={{ scale: index === currentDialog ? [1, 1.3, 1] : 1, y: index === currentDialog ? [0, -5, 0] : 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                />
              ))}
            </div>

            {/* Continue button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleButtonClick}
                className={`flex items-center justify-center gap-3 py-4 px-8 lg:px-12 rounded-2xl font-semibold text-lg lg:text-xl shadow-lg transition-all duration-300
                  ${ currentDialog < dialog.length - 1 ? "bg-gradient-to-r from-teal-300 via-blue-200 to-teal-400 text-blue-900 hover:from-teal-200 hover:via-blue-100 hover:to-teal-300 hover:shadow-blue-200/50" : "bg-gradient-to-r from-teal-400 to-blue-500 text-white hover:from-teal-500 hover:to-blue-600 hover:shadow-blue-300/50" }`}
              >
                {currentDialog < dialog.length - 1 ? (
                  <><span className="drop-shadow-sm text-blue-950">Next</span><FaChevronRight className="mt-0.5 drop-shadow-sm text-blue-950" /></>
                ) : (
                  <><span className="drop-shadow-sm text-blue-950">{t("imReady")}</span><FaCheck className="mt-0.5 drop-shadow-sm text-blue-950" /></>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhance Experience Component for fullscreen option */}
      {showEnhanceExperience && (
        <EnhanceExperience
          onClose={() => setShowEnhanceExperience(false)}
          onConfirm={handleStartTest}
          t={t}
        />
      )}
    </>
  );
};

WelcomeDialog.propTypes = {
  dialog: PropTypes.array.isRequired,
  currentDialog: PropTypes.number.isRequired,
  onNextDialog: PropTypes.func.isRequired,
  onStartTest: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default WelcomeDialog;