// src/components/tests/visual-discrimination/VisualTestDemo.jsx

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuestionRenderer from "./QuestionRenderer";
import { useLanguage } from "../../../contexts/LanguageContext";
import {
  FaInfoCircle,
  FaPlay,
  FaCheckCircle,
  FaTimesCircle,
  FaUndo,
  FaLightbulb,
  FaRegLightbulb,
  FaEye,
  FaMousePointer,
  FaHourglassHalf,
  FaSmileBeam,
  FaThumbsUp,
  FaRocket,
  FaGraduationCap,
  FaSpellCheck,
} from "react-icons/fa";

// --- Enhanced Instructions Modal Component (InstructionsModal) ---
const InstructionsModal = ({ isOpen, onClose, title, instructions, t }) => {
  if (!isOpen) return null;

  // Ensure this array has enough icons for the number of instructions you expect.
  // These icons are examples; adjust them to best fit your instruction content.
  const instructionIcons = [
    <span className="flex items-center">
      <FaEye className="mr-2 text-sky-300" />{" "}
      <FaSpellCheck className="text-sky-300" />
    </span>,
    <FaMousePointer className="text-lime-300" />,
    <FaHourglassHalf className="text-orange-300" />,
    <FaSmileBeam className="text-yellow-300" />,
    <FaThumbsUp className="text-pink-300" />,
    <FaRocket className="text-purple-300" />, // Example for a 6th instruction
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[100] flex items-center justify-center p-4 transition-opacity duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 20 }}
        transition={{ type: "spring", stiffness: 280, damping: 25 }}
        className="relative bg-gradient-to-br from-green-800/80 via-green-900/70 to-yellow-800/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-3xl max-w-xl w-full text-white border-2 border-amber-400/40 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-lime-400 via-amber-300 to-yellow-400 opacity-80"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-500/15 rounded-full filter blur-xl opacity-70"></div>
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-400/15 rounded-full filter blur-xl opacity-70"></div>

        <div className="flex justify-between items-center mb-6 sm:mb-8 relative z-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-amber-300 flex items-center drop-shadow-lg">
            <FaGraduationCap className="mr-3 text-amber-300 text-3xl sm:text-4xl" />{" "}
            {title}
          </h3>
          <motion.button
            whileHover={{ scale: 1.15, rotate: 20 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-amber-200 hover:text-white transition-colors"
            aria-label={t("closeInstructions")}
          >
            <FaTimesCircle size={32} />
          </motion.button>
        </div>
        <div className="mb-8 space-y-4 sm:space-y-5 text-yellow-50 text-base sm:text-lg leading-relaxed font-serif relative z-10 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar-light">
          {instructions.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start bg-white/5 p-3 sm:p-4 rounded-xl border border-white/10 shadow-md"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="mr-3 sm:mr-4 text-2xl sm:text-3xl flex-shrink-0 mt-0.5">
                {instructionIcons[index] || (
                  <FaCheckCircle className="text-emerald-400" />
                )}
              </div>
              <span className="text-yellow-100">{item.text}</span>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center relative z-10">
          <motion.button
            whileHover={{
              scale: 1.05,
              y: -3,
              boxShadow: "0px 5px 20px rgba(251, 191, 36, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex items-center justify-center gap-2.5 py-3.5 px-10 rounded-xl font-bold text-lg sm:text-xl shadow-xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 hover:shadow-amber-500/60"
          >
            {t("gotIt")} <FaThumbsUp />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// --- VisualTestDemo Main Component ---
const VisualTestDemo = ({ onDemoComplete, language, questionsData }) => {
  const { t } = useLanguage();
  const [demoQuestion, setDemoQuestion] = useState(null);
  const [userSelection, setUserSelection] = useState(null);
  const [attemptStatus, setAttemptStatus] = useState(null);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showInitialMessage, setShowInitialMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const demoSpecificInstructions = useMemo(
    () => [
      { text: t("VisualDemoInstruction1") },
      { text: t("VisualDemoInstruction2") },
      { text: t("VisualDemoInstruction3") },
      { text: t("VisualDemoInstruction4") },
      { text: t("VisualDemoInstruction5") },
    ],
    [t]
  );

  useEffect(() => {
    setIsLoading(true);
    setAttemptStatus(null);
    setUserSelection(null);
    const langKey =
      language === "ta"
        ? "tamil"
        : language === "hi"
        ? "hindi"
        : language === "kn"
        ? "kannada"
        : "english";
    const questionsForLang = Array.isArray(questionsData?.[langKey])
      ? questionsData[langKey]
      : [];

    if (questionsForLang.length > 0) {
      setDemoQuestion({ ...questionsForLang[0] });
    } else {
      console.error(
        `VisualTestDemo: No questions found for language: ${langKey}`
      );
      setDemoQuestion(null);
    }
    setTimeout(() => setIsLoading(false), 300);
  }, [language, questionsData]);

  const handleDemoAnswer = (option) => {
    if (attemptStatus === "correct") return;
    setUserSelection(option);
    if (demoQuestion && option === demoQuestion.correct) {
      setAttemptStatus("correct");
    } else {
      setAttemptStatus("incorrect");
    }
  };

  const handleTryAgain = () => {
    setAttemptStatus(null);
    setUserSelection(null);
  };

  const handleStartMainTest = () => {
    onDemoComplete();
  };

  const handleStartDemoQuestion = () => {
    setShowInitialMessage(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white p-4">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="text-5xl text-amber-300 mb-5"
        >
          🧩
        </motion.div>
        <p className="text-xl font-serif text-yellow-100">
          {t("loadingPractice")}
        </p>
      </div>
    );
  }

  if (showInitialMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            duration: 0.8,
            delay: 0.1,
            bounce: 0.3,
          }}
          className="relative bg-gradient-to-br from-green-800/70 via-green-900/60 to-yellow-800/70 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl text-center max-w-2xl w-full border-2 border-white/20 overflow-hidden "
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-lime-300 to-amber-300 opacity-80"></div>
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-400/15 rounded-full filter blur-lg opacity-60"></div>
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-300/15 rounded-full filter blur-lg opacity-60"></div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaLightbulb className="text-yellow-300 text-6xl sm:text-7xl mx-auto mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-5 text-amber-200 drop-shadow-md">
            {t("practiceRoundTitle")}
          </h2>
          <p className="text-lg sm:text-xl mb-5 text-yellow-50 leading-relaxed font-serif">
            {t("practiceRoundIntroVisual")}
          </p>
          <p className="text-md sm:text-lg mb-8 text-lime-100/90 font-serif">
            {t("practiceRoundTip")}
          </p>
          <div className="flex justify-center">
          <motion.button
            whileHover={{
              scale: 1.08,
              y: -3,
              boxShadow: "0px 8px 25px rgba(251, 191, 36, 0.6)",
            }}
            whileTap={{ scale: 0.92 }}
            onClick={handleStartDemoQuestion}
            disabled={!demoQuestion}
            className="flex items-center justify-center gap-3 py-4 px-12 rounded-xl font-bold text-lg sm:text-xl shadow-xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 hover:shadow-amber-500/70 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <FaPlay />{" "}
            {demoQuestion ? t("startPracticeQuestion") : t("loadingPractice")}
          </motion.button>
          </div>
        </motion.div>
        
      </div>
    );
  }

  if (!demoQuestion) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white text-xl p-6 bg-red-700/40 backdrop-blur-sm rounded-xl border border-red-500/60 shadow-lg">
        <FaTimesCircle className="mr-3 text-red-300 text-4xl mb-3" />
        <span className="font-serif text-center">
          {t("errorNoPracticeQuestion")}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
      <motion.button
        aria-label={t("showDemoInstructions")}
        initial={{ opacity: 0, y: -20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        onClick={() => setShowInstructionsModal(true)}
        className="fixed top-4 right-4 z-[60] flex items-center gap-2 bg-white/10 backdrop-blur-md border-2 border-amber-400/50 text-amber-200 hover:bg-white/20 hover:text-amber-100 font-semibold py-2.5 px-4 sm:px-5 rounded-lg shadow-lg transition-all"
        whileHover={{
          scale: 1.08,
          y: -2,
          x: -2,
          shadow: "0px 3px 15px rgba(251,191,36,0.3)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <FaInfoCircle size={20} />{" "}
        <span className="hidden sm:inline">{t("demoInstructionsButton")}</span>
      </motion.button>

      <AnimatePresence>
        {showInstructionsModal && (
          <InstructionsModal
            isOpen={showInstructionsModal}
            onClose={() => setShowInstructionsModal(false)}
            title={t("visualTestDemoInstructionsTitle")}
            instructions={demoSpecificInstructions}
            t={t}
          />
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl mb-4 sm:mb-6">
        <QuestionRenderer
          key={
            attemptStatus === null ? "attempting" : userSelection || "initial"
          }
          questionData={demoQuestion}
          index={0}
          totalQuestions={1}
          onAnswer={handleDemoAnswer}
          onTimeout={() => {}}
          showTimer={false}
          isAttemptBlocked={attemptStatus === "correct"}
        />
      </div>

      <AnimatePresence>
        {attemptStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="relative mt-1 sm:mt-2 text-center bg-gradient-to-br from-green-700/60 via-gray-800/80 to-yellow-700/60 backdrop-blur-lg p-5 sm:p-6 rounded-2xl shadow-xl max-w-md w-full border border-white/20 overflow-hidden"
          >
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full filter blur-md opacity-50"></div>
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-amber-400/10 rounded-full filter blur-md opacity-50"></div>

            {attemptStatus === "correct" && (
              <div className="relative z-10">
                <div className="flex items-center justify-center text-green-300 text-xl sm:text-2xl font-semibold mb-5">
                  <FaCheckCircle className="mr-2.5 text-3xl drop-shadow-md animate-pulse" />
                  {t("visualCorrect")}
                </div>
                <div className='flex justify-center'>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    boxShadow: "0px 5px 15px rgba(251, 191, 36, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartMainTest}
                  className="flex items-center justify-center gap-2.5 py-3.5 px-10 rounded-xl font-bold text-lg sm:text-xl shadow-xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 hover:shadow-amber-500/50"
                >
                  {t("startMainTest")} <FaRocket className="ml-1" />
                </motion.button>
                </div>
              </div>
            )}
            {attemptStatus === "incorrect" && (
              <div className="relative z-10">
                <div className="flex flex-col items-center text-red-300 text-xl sm:text-2xl font-semibold mb-4">
                  <div className="flex items-center">
                    <FaTimesCircle className="mr-2.5 text-3xl drop-shadow-md" />
                    <span className="drop-shadow-sm">
                      {t("practiceIncorrect")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-2 font-sans">
                    {t("practiceSelected", {
                      selection: userSelection || t("notSelected"),
                      correctAnswer: demoQuestion.correct,
                    })}
                  </p>
                </div>
                <div className='flex justify-center'>
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTryAgain}
                  className="flex items-center justify-center gap-2 py-3 px-8 rounded-xl font-bold text-md sm:text-lg shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-lime-100 text-green-900 hover:from-lime-50 hover:to-amber-100 hover:shadow-lime-200/50"
                >
                  <FaUndo /> {t("tryAgain")}
                </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx global>{`
        .custom-scrollbar-light::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.7);
          border-radius: 10px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.9);
        }
      `}</style>
    </div>
  );
};

export { InstructionsModal };
export default VisualTestDemo;
