"use client";

import { motion } from "framer-motion";

// SpeechBubble component defined internally as it's not used elsewhere based on original Test6.jsx
// If SpeechBubble were used, its definition would go here or be passed as a prop.


 //const SpeechBubble = ({ text, visible, isLastMessage = false, onConfirm, t }) => ( ... );

export default function TutorialView({
  tutorialMessages,
  tutorialPhase,
  handleNextTutorialStep,
  onTutorialComplete,
  introMessage,
  coralineImage,
  coralineAnimationState, 
  t,
}) {
  return (
    <>
      <div className="fixed inset-0 z-40">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
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
              src={coralineImage}
              alt={t("altCoralineCharacter")}
              className="h-64 sm:h-80 lg:h-96 xl:h-[500px] object-contain"
            />
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-brown-700/70 to-brown-900/70 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border-2 border-white/20 shadow-2xl flex-1 relative overflow-hidden w-full max-w-none lg:max-w-4xl order-1 lg:order-2"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-amber-500"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-400/20 rounded-full filter blur-xl"></div>
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-400/20 rounded-full filter blur-xl"></div>
            <div className="absolute top-1/2 right-8 w-24 h-24 bg-purple-400/10 rounded-full filter blur-lg"></div>
            <div className="absolute bottom-8 left-8 w-32 h-32 bg-cyan-400/10 rounded-full filter blur-lg"></div>
            <motion.div
              key={tutorialPhase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="text-2xl sm:text-3xl lg:text-4xl text-white mb-8 lg:mb-12 min-h-48 sm:min-h-56 lg:min-h-64 flex items-center font-serif font-medium leading-relaxed px-4"
            >
              <span className="drop-shadow-lg">{introMessage}</span>
            </motion.div>
            <div className="flex justify-center gap-3 mb-8 lg:mb-10">
              {tutorialMessages.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                    index <= tutorialPhase
                      ? "bg-gradient-to-r from-white to-blue-200 shadow-lg"
                      : "bg-white/30"
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: index === tutorialPhase ? 1.3 : 1,
                    y: index === tutorialPhase ? -4 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              ))}
            </div>
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={
                  tutorialPhase === tutorialMessages.length - 1
                    ? onTutorialComplete
                    : handleNextTutorialStep
                }
                className={`flex items-center justify-center gap-3 py-4 px-8 lg:px-12 rounded-xl font-bold text-lg lg:text-xl shadow-2xl transition-all duration-300 ${
                  tutorialPhase < tutorialMessages.length - 1
                    ? "bg-gradient-to-r from-white to-amber-100 text-black hover:from-green-50 hover:to-green-200 hover:shadow-amber-200/50"
                    : "bg-gradient-to-r from-amber-300 to-amber-500 text-black hover:from-amber-600 hover:to-amber-700 hover:shadow-amber-500/50"
                }`}
              >
                {tutorialPhase < tutorialMessages.length - 1 ? (
                  <>
                    <span className="drop-shadow-sm">{t("next")}</span>
                    <span className="drop-shadow-sm">➔</span>
                  </>
                ) : (
                  <>
                    <span className="drop-shadow-sm">
                      {t("buttonTutorialConfirmReady")}
                    </span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}