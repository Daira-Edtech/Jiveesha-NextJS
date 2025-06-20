'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// PATH CHANGE: Adjust to your project structure, e.g., ../../contexts/LanguageContext
import { useLanguage } from "../../../contexts/LanguageContext";
// PATH CHANGE: Import local SoundPlayerComponent
import SoundPlayerComponent from "./SoundPlayerComponent";

const SoundQuestionDisplay = ({
  pair,
  index,
  totalQuestions,
  onAnswer,
  onTimeout,
}) => {
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [feedback, setFeedback] = useState({
    show: false,
    message: "",
    isCorrect: false,
  });

  const handleAnswer = (isSame) => {
    if (hasAnswered) return;

    const correctAnswer = pair[0] === pair[1];
    const isUserCorrect = isSame === correctAnswer;

    if (isUserCorrect) {
      const successMessages = [
        t("correctAnswerGreatJob"),
        t("youGotItRight"),
        t("perfectScore"),
        t("wellDone"),
        t("excellentWork"),
      ];
      setFeedback({
        show: true,
        message:
          successMessages[Math.floor(Math.random() * successMessages.length)],
        isCorrect: true,
      });
    } else {
      const tryAgainMessages = [
        t("almostThere"),
        t("goodTry"),
        t("keepPracticing"),
        t("nextTimeBetter"),
        t("dontGiveUp"),
      ];
      setFeedback({
        show: true,
        message:
          tryAgainMessages[Math.floor(Math.random() * tryAgainMessages.length)],
        isCorrect: false,
      });
    }

    setSelectedOption(isSame);
    setHasAnswered(true);
    setTimeout(() => {
      setFeedback({ ...feedback, show: false });
      onAnswer(isSame);
    }, 1500);
  };

  useEffect(() => {
    setSelectedOption(null);
    setHasAnswered(false);
    setFeedback({ show: false, message: "", isCorrect: false });
  }, [pair]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="bg-black/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl w-full max-w-3xl mx-auto border-2 border-white/40"
      >
        <div className="text-center mb-4 text-white font-semibold text-2xl">
          {t("question")} {index + 1} {t("of")} {totalQuestions}
        </div>

        {pair && <SoundPlayerComponent pair={pair} onTimeout={onTimeout} />}

        <div className="flex justify-center gap-6 mt-10">
          <motion.button
            whileHover={!hasAnswered && { scale: 1.05 }}
            whileTap={!hasAnswered && { scale: 0.95 }}
            onClick={() => handleAnswer(true)}
            disabled={hasAnswered}
            className={`py-4 px-6 rounded-xl text-xl font-bold transition-all ${
              hasAnswered
                ? selectedOption === true
                  ? "bg-gradient-to-r from-cyan-400 via-teal-500 to-emerald-500 text-white shadow-lg"
                  : "bg-gray-500 text-gray-300"
                : "bg-gradient-to-r from-green-700 via-lime-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg"
            }`}
          >
            {t("sameSounds")}
          </motion.button>

          <motion.button
            whileHover={!hasAnswered && { scale: 1.05 }}
            whileTap={!hasAnswered && { scale: 0.95 }}
            onClick={() => handleAnswer(false)}
            disabled={hasAnswered}
            className={`py-4 px-6 rounded-xl text-xl font-bold transition-all ${
              hasAnswered
                ? selectedOption === false
                  ? "bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white shadow-lg"
                  : "bg-gray-500 text-gray-300"
                : "bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 hover:from-red-600 hover:to-orange-500 text-white shadow-lg"
            }`}
          >
            {t("differentSounds")}
          </motion.button>
        </div>
      </motion.div>
      {feedback.show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 18 }}
          className="fixed inset-x-0 bottom-6 mx-auto z-50 flex justify-center"
        >
          <div
            className={`rounded-xl p-4 shadow-lg text-center max-w-md w-full mx-4 ${
              feedback.isCorrect
                ? "bg-gradient-to-r from-yellow-600 via-amber-500 to-orange-600 border border-yellow-100 text-white"
                : "bg-gradient-to-r from-red-700 via-rose-600 to-pink-600 border border-red-200 text-white"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {feedback.isCorrect ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <span className="text-lg font-bold">{feedback.message}</span>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default SoundQuestionDisplay;