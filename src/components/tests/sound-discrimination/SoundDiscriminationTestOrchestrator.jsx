'use client';

import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
// PATH CHANGE: Adjust to your project structure, e.g., ../../../config/definedURL
//import { backendURL } from "../../../definedURL";
// PATH CHANGE: Adjust to your project structure, e.g., ../../../contexts/LanguageContext
import { useLanguage } from "../../../contexts/LanguageContext";
import { FaArrowLeft } from "react-icons/fa";

// PATH CHANGE: Import from the same directory
import CharacterDialog from "./CharacterDialog";
import SoundQuestionDisplay from "./SoundQuestionDisplay";

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
      ["dog", "hog"], ["gate", "cake"], ["bun", "bun"], ["let", "net"],
      ["ride", "ride"], ["man", "man"], ["pit", "bit"], ["thing", "sing"],
      ["nut", "ton"], ["big", "big"], ["no", "mow"], ["pot", "top"],
      ["pat", "pat"], ["shut", "just"], ["name", "game"], ["raw", "war"],
      ["feet", "seat"], ["fun", "fun"], ["day", "bay"], ["in", "on"],
    ],
    []
  );

  const [score, setScore] = useState(0);
  const [showCharacter, setShowCharacter] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(wordPairs.length).fill(null)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startTest = () => {
    setShowCharacter(false);
    setTestStarted(true);
  };

  const handleAnswer = (isSame) => {
    if (currentQuestionIndex >= wordPairs.length) return;

    const currentPair = wordPairs[currentQuestionIndex];
    const correctAnswer = currentPair[0] === currentPair[1];
    const isUserCorrect = isSame === correctAnswer;

    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = isSame;
    setSelectedOptions(newSelectedOptions);

    if (isUserCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < wordPairs.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        setTestCompleted(true);
      }
    }, 1500);
  };

  const handleTimeout = () => {
    if (currentQuestionIndex >= wordPairs.length) return;

    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = null;
    setSelectedOptions(newSelectedOptions);

    setTimeout(() => {
        if (currentQuestionIndex < wordPairs.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
            setTestCompleted(true);
        }
    }, 200);
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
        `${backendURL}/addTest16`,
        {
          childId: childId,
          test_name: t("soundTestApiName"),
          score: score,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
    } catch (error)      {
      console.error("Error submitting test:", error);
      toast.error(
        t("anErrorOccurredWhileSubmittingTheTestPleaseTryAgain") ||
          t("errorOccurred")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

   useEffect(() => {
    // This effect can remain if needed for props passed to the Orchestrator directly
   }, [suppressResultPage, onComplete]);


  if (showCharacter) {
    return <CharacterDialog onComplete={startTest} />;
  }

  const currentPair = wordPairs[currentQuestionIndex];

  return (
    <div
      className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4 md:p-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImageAsset})` }}
    >
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => router.push("/taketests")}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft className="text-blue-600" />
        {t("backToTests")}
      </motion.button>

      {testStarted && !testCompleted && currentPair && (
        <div className="w-full max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <ProgressBarLocalComponent
                current={currentQuestionIndex + 1}
                total={wordPairs.length}
                t={t}
              />
              <SoundQuestionDisplay
                pair={currentPair}
                index={currentQuestionIndex}
                totalQuestions={wordPairs.length}
                onAnswer={handleAnswer}
                onTimeout={handleTimeout}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {testCompleted && (
        <div className="w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 shadow-2xl text-center border-2 border-white/30"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <h2 className="text-3xl font-bold text-white mb-2">
                {t("testCompleted")}
              </h2>
              <p className="text-xl text-blue-300">
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl text-xl shadow-lg hover:bg-blue-700"
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
                      className="inline-block mr-2"
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
        </div>
      )}
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
};

export default SoundDiscriminationTestOrchestrator;