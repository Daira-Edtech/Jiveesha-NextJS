"use client";

import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaPlayCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

// PATH CHANGE: Import from the same directory
import CharacterDialog from "./CharacterDialog";
import SoundQuestionDisplay from "./SoundQuestionDisplay";
import InstructionsComponent from "./InstructionsComponent"; // Import the new InstructionsComponent

// PATH CHANGE: Assumes image is in public/sound-test/
const backgroundImageAsset = "/sound-test/whispering-isle.png";

const ProgressBarLocalComponent = ({ current, total, t }) => {
  const progress = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xl font-semibold text-white/90">
          {t("progress")}
        </span>
        <span className="text-xl font-bold text-white">
          {current}/{total} ({Math.round(progress)}%)
        </span>
      </div>
      <div className="w-full h-8 bg-gray-300/50 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-orange-300 via-rose-500 to-indigo-600 relative"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{ opacity: [0, 0.3, 0], x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

const SoundDiscriminationTestOrchestrator = ({
  suppressResultPage = false,
  onComplete,
}) => {
  const { t, language } = useLanguage();
  const router = useRouter();

  const wordPairs = useMemo(
    () => [
      ["dog", "hog"],
      ["gate", "cake"],
      ["bun", "bun"],
      ["let", "net"],
      ["ride", "ride"],
      ["man", "man"],
      ["pit", "bit"],
      ["thing", "sing"],
      ["nut", "ton"],
      ["big", "big"],
      ["no", "mow"],
      ["pot", "top"],
      ["pat", "pat"],
      ["shut", "just"],
      ["name", "game"],
      ["raw", "war"],
      ["feet", "seat"],
      ["fun", "fun"],
      ["day", "bay"],
      ["in", "on"],
    ],
    []
  );
  const demoPair = useMemo(() => wordPairs[0], [wordPairs]);

  // --- State Management ---
  const [currentPhase, setCurrentPhase] = useState("characterDialog"); // 'characterDialog', 'instructions', 'demo', 'mainTest', 'completed'
  const [showInstructionsOverlay, setShowInstructionsOverlay] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(wordPairs.length).fill(null)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoQuestionKey, setDemoQuestionKey] = useState(0);
  const [demoQuestionAnsweredCorrectly, setDemoQuestionAnsweredCorrectly] =
    useState(false);

  // --- Phase Transition Handlers ---
  const handleCharacterDialogComplete = () => {
    setCurrentPhase("instructions");
  };

  const handleInitialInstructionsComplete = () => {
    setCurrentPhase("demo");
    setDemoQuestionKey((prev) => prev + 1);
    setDemoQuestionAnsweredCorrectly(false);
  };

  const handleDemoAnswer = (isSameChoice) => {
    if (demoQuestionAnsweredCorrectly) return;
    const correctAnswer = demoPair[0] === demoPair[1];
    const isUserCorrect = isSameChoice === correctAnswer;
    if (isUserCorrect) {
      setDemoQuestionAnsweredCorrectly(true);
    } else {
      toast.info(t("demoIncorrectToastMessage"), {
        autoClose: 2500,
        icon: <FaExclamationTriangle className="text-yellow-400" />,
      });
      setDemoQuestionKey((prevKey) => prevKey + 1);
    }
  };

  const handleDemoTimeout = () => {
    toast.info(t("demoTimeoutRetry"), {
      autoClose: 2500,
      icon: <FaExclamationTriangle className="text-yellow-400" />,
    });
    setDemoQuestionKey((k) => k + 1);
  };

  const handleProceedToMainTest = () => {
    setCurrentPhase("mainTest");
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOptions(Array(wordPairs.length).fill(null));
  };

  const handleMainTestAnswer = (isSame) => {
    if (currentQuestionIndex >= wordPairs.length) return;
    const currentPair = wordPairs[currentQuestionIndex];
    const correctAnswer = currentPair[0] === currentPair[1];
    const isUserCorrect = isSame === correctAnswer;
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = isSame;
    setSelectedOptions(newSelectedOptions);
    if (isUserCorrect) setScore((prevScore) => prevScore + 1);

    if (currentQuestionIndex < wordPairs.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentPhase("completed");
    }
  };

  const handleMainTestTimeout = () => {
    if (currentQuestionIndex >= wordPairs.length) return;
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = null;
    setSelectedOptions(newSelectedOptions);
    if (currentQuestionIndex < wordPairs.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentPhase("completed");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem("access_token");
    const childId = localStorage.getItem("childId");

    if (!childId) {
      toast.error(t("selectStudentFirst"));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `/api/sound-test/submitResult`,
        {
          childId: childId,
          test_name: t("soundTestApiName"),
          score: score,
        },
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        if (suppressResultPage && typeof onComplete === "function") {
          onComplete(score);
        } else {
          toast.success(t("testSubmittedSuccessfully"), {
            position: "top-center",
            onClose: () => router.push("/"),
          });
        }
      } else {
        toast.error(t("failedToSubmitTestPleaseTryAgain"));
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error(t("errorOccurredGeneric"));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {}, [suppressResultPage, onComplete]);

  // --- Render Logic Based on Phase ---

  if (currentPhase === "characterDialog") {
    return <CharacterDialog onComplete={handleCharacterDialogComplete} />;
  }

  if (currentPhase === "instructions") {
    return (
      <InstructionsComponent
        onComplete={handleInitialInstructionsComplete}
        proceedButtonTextKey={"proceedToDemoButton"}
        isOverlay={false}
      />
    );
  }

  // Common wrapper for Demo, Main Test, and Completion screens
  const TestScreenWrapper = ({ children, showTopButtons = true }) => (
    <div
      className="fixed inset-0 overflow-y-auto flex flex-col items-center justify-center p-4 md:p-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImageAsset})` }}
    >
      {showTopButtons && (
        <div className="fixed top-4 left-4 right-4 z-[100] flex justify-between items-center">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => router.push("/taketests")}
            className="flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft className="text-blue-600" />
            {t("backToTests")}
          </motion.button>

          {(currentPhase === "demo" || currentPhase === "mainTest") && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => setShowInstructionsOverlay(true)}
              className="flex items-center gap-2 bg-blue-500/90 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaInfoCircle />
              {t("showInstructionsButton")}
            </motion.button>
          )}
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto mt-16 sm:mt-20">{children}</div>

      <AnimatePresence>
        {showInstructionsOverlay && (
          <InstructionsComponent
            onComplete={() => setShowInstructionsOverlay(false)}
            proceedButtonTextKey={"gotItButton"}
            isOverlay={true}
          />
        )}
      </AnimatePresence>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );

  if (currentPhase === "demo") {
    return (
      <TestScreenWrapper>
        <motion.div
          key="demo-phase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4 text-center drop-shadow-lg">
            {t("demoRoundTitle")}
          </h2>
          <p className="text-xl text-blue-200 mb-8 text-center max-w-xl drop-shadow-sm">
            {t("demoRoundInstructions")}
          </p>

          {!demoQuestionAnsweredCorrectly ? (
            <SoundQuestionDisplay
              key={`demo-${demoQuestionKey}`}
              pair={demoPair}
              index={0}
              totalQuestions={1}
              onAnswer={handleDemoAnswer}
              onTimeout={handleDemoTimeout}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="bg-black/60 backdrop-blur-md rounded-2xl p-8 shadow-2xl text-center border-2 border-green-400/50"
            >
              <FaCheckCircle className="text-6xl text-green-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-green-300 mb-3">
                {t("demoCorrect")}
              </h3>
              <p className="text-xl text-white mb-8">
                {t("demoCorrectProceed")}
              </p>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0px 8px 20px rgba(0, 220, 150, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProceedToMainTest}
                className="flex items-center justify-center gap-3 py-3 px-8 rounded-xl font-bold text-lg bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white shadow-xl hover:from-green-600 hover:to-teal-700"
              >
                <span>{t("startMainTestButton")}</span> <FaPlayCircle />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </TestScreenWrapper>
    );
  }

  if (currentPhase === "mainTest") {
    const currentPairForMainTest = wordPairs[currentQuestionIndex];
    return (
      <TestScreenWrapper>
        {currentPairForMainTest && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`main-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <ProgressBarLocalComponent
                current={currentQuestionIndex + 1}
                total={wordPairs.length}
                t={t}
              />
              <SoundQuestionDisplay
                pair={currentPairForMainTest}
                index={currentQuestionIndex}
                totalQuestions={wordPairs.length}
                onAnswer={handleMainTestAnswer}
                onTimeout={handleMainTestTimeout}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </TestScreenWrapper>
    );
  }

  if (currentPhase === "completed") {
    return (
      <TestScreenWrapper showTopButtons={false}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-black/60 backdrop-blur-md rounded-2xl p-8 shadow-2xl text-center border-2 border-white/30"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-4xl font-bold text-white mb-3">
              {t("testCompleted")}
            </h2>
            <p className="text-2xl text-blue-300">
              {t("youGot")} {score} {t("outOf")} {wordPairs.length}{" "}
              {t("correct")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-xl text-xl shadow-lg hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block mr-2 text-2xl"
                  >
                    ↻
                  </motion.span>
                  {t("submitting")}
                </span>
              ) : (
                t("submitResults")
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </TestScreenWrapper>
    );
  }

  return null;
};

export default SoundDiscriminationTestOrchestrator;
