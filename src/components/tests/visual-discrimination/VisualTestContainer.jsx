"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import questionsData from "./questions.json"; // Ensure this path is correct
import { FaArrowLeft } from "react-icons/fa";

import CharacterDialog from "./CharacterDialog"; // Ensure this path is correct
import QuestionRenderer from "./QuestionRenderer"; // Ensure this path is correct
import VisualTestDemo from "./VisualTestDemo"; // IMPORT THE DEMO COMPONENT

const backgroundImage = "/visual-test/rockvision.png"; // Ensure this path is correct

const ResultsProgressBar = ({ current, total }) => {
  const { t } = useLanguage();
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xl font-semibold text-white/90">
          {t("labelProgress", "Progress")}
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
  const [quizStarted, setQuizStarted] = useState(false); // For the main test
  const [quizCompleted, setQuizCompleted] = useState(false);
  const router = useRouter();

  const [showDemo, setShowDemo] = useState(true); // State to control demo visibility

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

    // Reset all states for a new test run or language change
    setSelectedOptions(Array(questionsForLang.length).fill(null));
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setQuizStarted(false);    // Main quiz not started yet
    setShowCharacter(true);   // Always show character intro first
    setShowDemo(true);        // Reset demo flag so it shows after character dialog
  }, [language]);

  const handleAnswer = (option) => {
    // This logic is for the main test
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
    // This logic is for the main test
    const newSelectedOptions = [...selectedOptions];
    if (currentQuestionIndex < newSelectedOptions.length) {
      newSelectedOptions[currentQuestionIndex] = null; // Mark as not answered or timed out
      setSelectedOptions(newSelectedOptions);
    }
    
    // No score for timeout
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // Called when CharacterDialog is completed
  const handleCharacterDialogComplete = () => {
    setShowCharacter(false);
    // Now the render logic will show the demo because showDemo is still true
  };

  // Called when VisualTestDemo is completed
  const handleDemoComplete = () => {
    setShowDemo(false);
    setQuizStarted(true); // Now start the main quiz
    // Reset states specifically for the main test
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOptions(Array(quizQuestions.length).fill(null));
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
      toast.error(t("visualTestSelectStudentError", "Please select a student first."));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "/api/visual-test/submitResult", // Replace with your actual API endpoint
        {
          childId: childId,
          options: selectedOptions, // These are from the main test
          score: score,             // This is from the main test
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
          toast.success(t("testSubmittedSuccessfully", "Test submitted successfully!"), {
            position: "top-center",
            onClose: () => router.push("/"), // Or your desired redirect path
          });
        }
      } else {
        toast.error(t("failedToSubmitTestPleaseTryAgain", "Failed to submit test. Please try again."));
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error(
        t("anErrorOccurredWhileSubmittingTheTestPleaseTryAgain", "An error occurred while submitting. Please try again.") ||
        t("errorOccurred", "An error occurred") // Fallback
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to wrap content with background and back button
  const renderWithBackground = (content) => (
    <div
      className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4 md:p-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => router.push("/taketests")} // Ensure '/taketests' is the correct route
        className="fixed top-4 left-4 z-[70] flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft className="text-blue-600" />
        {t("backToTests", "Back to Tests")}
      </motion.button>
      {content}
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

  // 1. Show Character Dialog
  if (showCharacter) {
    // CharacterDialog handles its own background, so not using renderWithBackground here
    return <CharacterDialog onComplete={handleCharacterDialogComplete} />;
  }

  // 2. Show Demo Round after Character Dialog
  if (showDemo) {
    return renderWithBackground(
        <VisualTestDemo
            onDemoComplete={handleDemoComplete}
            language={language}
            questionsData={questionsData} // Pass the full questions data for the demo to pick one
        />
    );
  }
  
  // 3. Loading state for the main test (after demo is complete)
  // Check if quizQuestions are loaded and main quiz hasn't started and isn't completed.
  if (quizQuestions.length === 0 && !quizStarted && !quizCompleted) {
    return renderWithBackground(
      <div className="flex items-center justify-center h-full">
        <p className="text-white text-2xl bg-black/50 p-6 rounded-lg">
          {t("loadingTest", "Loading test...")}
        </p>
      </div>
    );
  }

  const currentQuestionData = quizQuestions[currentQuestionIndex];

  // 4. Show Main Test Questions
  if (quizStarted && !quizCompleted && currentQuestionData) {
    return renderWithBackground(
      <div className="w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex} // Key for re-animation on question change
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
    );
  }

  // 5. Show Quiz Completion / Results Summary
  if (quizCompleted) {
    return renderWithBackground(
      <div className="w-full max-w-4xl mx-auto">
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
            <h2 className="text-3xl font-bold text-white mb-2">
              {t("visualTestCompleted", "Test Completed!")}
            </h2>
            <p className="text-xl text-blue-300">
              {t("visualTestScoreOutOfTotal", "Your score: {score} out of {total}")
                .replace("{score}", score.toString())
                .replace("{total}", quizQuestions.length.toString())}
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
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl text-xl shadow-lg hover:bg-blue-700 disabled:opacity-70"
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
                    className="inline-block mr-2 text-2xl" // Made spinner larger
                  >
                    ↻
                  </motion.span>
                  {t("submitting", "Submitting...")}
                </span>
              ) : (
                t("submitResults", "Submit Results")
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Fallback for any unhandled state (should ideally not be reached if logic is correct)
  return renderWithBackground(
    <div className="flex items-center justify-center h-full">
      <p className="text-white text-xl bg-black/50 p-4 rounded-lg">
        {t("loading", "Loading...")}
      </p>
    </div>
  );
};

export default VisualTestContainer;