'use client';

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
// PATH CHANGE: Adjust to your project structure, e.g., ../../contexts/LanguageContext
import { useLanguage } from "../../../contexts/LanguageContext";
import { FaChevronRight, FaCheck } from "react-icons/fa";

const backgroundImage = "/sound-test/whispering-isle.png";
const echoCharacter = "/sound-test/Goonjarishi.png";

const CharacterDialog = ({ onComplete }) => {
  const { t } = useLanguage();
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);

  const dialogs = useMemo(
    () => [
      t("soundTestEchoDialogAhoy"),
      t("soundTestEchoDialogIntro"),
      t("soundTestEchoDialogIsleDescription"),
      t("soundTestEchoDialogTwoSounds"),
      t("soundTestEchoDialogYourJob"),
      t("soundTestEchoDialogAreTheySame"),
      t("soundTestEchoDialogOrDifferent"),
      t("soundTestEchoDialogReadyPirate"),
      t("imReadysound"),
    ],
    [t]
  );

  const handleNext = () => {
    if (currentDialogIndex < dialogs.length - 1) {
      setCurrentDialogIndex(currentDialogIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative max-w-7xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-12"
        >
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: [1, 1.03, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              y: { duration: 0.6, ease: "backOut" },
              opacity: { duration: 0.8 },
              scale: {
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="flex-shrink-0 order-2 lg:order-1"
          >
            <img
              src={echoCharacter}
              alt={t("altSirEchoTheCrab")}
              className="h-64 sm:h-80 lg:h-96 xl:h-112 object-contain"
            />
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-yellow-800/60 to-indigo-900/60 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border-2 border-white/20 shadow-2xl flex-1 relative overflow-hidden w-full max-w-none lg:max-w-4xl order-1 lg:order-2"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-300 via-rose-500 to-indigo-600"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-orange-100/30 rounded-full filter blur-xl"></div>
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-200/30 rounded-full filter blur-xl"></div>
            <div className="absolute top-1/2 right-8 w-24 h-24 bg-rose-300/10 rounded-full filter blur-lg"></div>
            <div className="absolute bottom-8 left-8 w-32 h-32 bg-indigo-300/10 rounded-full filter blur-lg"></div>
            <motion.div
              key={currentDialogIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white mb-8 lg:mb-12 min-h-48 sm:min-h-56 lg:min-h-64 xl:min-h-72 flex items-center justify-center font-serif font-medium leading-relaxed text-center px-4"
            >
              <span className="drop-shadow-lg">
                {dialogs[currentDialogIndex]}
              </span>
            </motion.div>
            <div className="flex justify-center gap-3 mb-8 lg:mb-10">
              {dialogs.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                    index <= currentDialogIndex
                      ? "bg-gradient-to-r from-white to-blue-200 shadow-lg"
                      : "bg-white/30"
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: index === currentDialogIndex ? 1.3 : 1,
                    y: index === currentDialogIndex ? -4 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              ))}
            </div>
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className={`flex items-center justify-center gap-3 py-4 px-8 lg:px-12 rounded-xl font-bold text-lg lg:text-xl shadow-2xl transition-all duration-300 ${
                  currentDialogIndex < dialogs.length - 1
                    ? "bg-gradient-to-r from-white to-blue-100 text-blue-900 hover:from-blue-50 hover:to-blue-200 hover:shadow-blue-200/50"
                    : "bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-teal-600 hover:shadow-purple-500/50"
                }`}
              >
                {currentDialogIndex < dialogs.length - 1 ? (
                  <>
                    <span className="drop-shadow-sm">{t("next")}</span>
                    <FaChevronRight className="mt-0.5 drop-shadow-sm" />
                  </>
                ) : (
                  <>
                    <span className="drop-shadow-sm">{t("imReadysound")}</span>
                    <FaCheck className="mt-0.5 drop-shadow-sm" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default CharacterDialog;