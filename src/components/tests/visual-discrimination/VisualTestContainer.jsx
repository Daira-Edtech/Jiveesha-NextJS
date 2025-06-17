"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import questionsData from "./questions.json";
import { FaArrowLeft } from "react-icons/fa";

import CharacterDialog from "./CharacterDialog";
import QuestionRenderer from "./QuestionRenderer";

const backgroundImage = "/visual-test/rockvision.png";

const ResultsProgressBar = ({ current, total }) => {
  const { t } = useLanguage();
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xl font-semibold text-white/90">
          {t("labelProgress")}
        </span>
        <span className="text-xl font-bold text-white">
          {current}/{total} ({Math.round(progress)}%)
        </span>
      </div>
      <div className="w-full h-8 bg-gray-300/50 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 relative"
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

const VisualTestContainer = ({ suppressResultPage = false, onComplete }) => {
  const { language, t } = useLanguage();
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCharacter, setShowCharacter] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const langKey =
      language === "ta"
        ? "tamil"
        : language === "hi"
        ? "hindi"
        : language === "kn"
        ? "kannada"
        : "english";

    const questionsForLang = Array.isArray(questionsData[langKey])
      ? questionsData[langKey]
      : [];
    setQuizQuestions(questionsForLang);
    setSelectedOptions(Array(questionsForLang.length).fill(null));
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setQuizStarted(false);
    setShowCharacter(true);
  }, [language]);

  const handleAnswer = (option) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = option;
    setSelectedOptions(newSelectedOptions);

    if (
      quizQuestions[currentQuestionIndex] &&
      option === quizQuestions[currentQuestionIndex].correct
    ) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setQuizCompleted(true);
      }
    }, 500);
  };

  const handleTimeout = () => {
    const newSelectedOptions = [...selectedOptions];
    if (currentQuestionIndex < newSelectedOptions.length) {
      newSelectedOptions[currentQuestionIndex] = null;
      setSelectedOptions(newSelectedOptions);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const startTest = () => {
    setShowCharacter(false);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    const childId =
      typeof window !== "undefined" ? localStorage.getItem("childId") : null;

    if (!childId) {
      toast.error(t("visualTestSelectStudentError"));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "/api/visual-test/submitResult",
        {
          childId: childId,
          options: selectedOptions,
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
      toast.error(
        t("anErrorOccurredWhileSubmittingTheTestPleaseTryAgain") ||
          t("errorOccurred")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (
    quizQuestions.length === 0 &&
    !quizStarted &&
    !showCharacter &&
    !quizCompleted
  ) {
    return (
      <div
        className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4 md:p-8 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <p className="text-white text-2xl">
          {t("loadingTest") || "Loading test..."}
        </p>
      </div>
    );
  }

  if (showCharacter) {
    return <CharacterDialog onComplete={startTest} />;
  }

  const currentQuestionData = quizQuestions[currentQuestionIndex];

  return (
    <div
      className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4 md:p-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
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

      {quizStarted && !quizCompleted && currentQuestionData && (
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
              <QuestionRenderer
                questionData={currentQuestionData}
                index={currentQuestionIndex}
                totalQuestions={quizQuestions.length}
                onAnswer={handleAnswer}
                onTimeout={handleTimeout}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {quizCompleted && (
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
                {t("visualTestCompleted")}
              </h2>
              <p className="text-xl text-blue-300">
                {t("visualTestScoreOutOfTotal")
                  .replace("{score}", score)
                  .replace("{total}", quizQuestions.length)}
              </p>
            </motion.div>

            <ResultsProgressBar current={score} total={quizQuestions.length} />

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

export default VisualTestContainer;
