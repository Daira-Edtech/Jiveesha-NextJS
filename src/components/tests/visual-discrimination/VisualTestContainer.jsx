"use client";

import axios from "axios";
import React, { useState, useEffect, useMemo } from "react"; // Added useMemo
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import questionsData from "./questions.json"; 
import { FaArrowLeft, FaRocket, FaInfoCircle } from "react-icons/fa"; // Added FaInfoCircle

import CharacterDialog from "./CharacterDialog"; 
import QuestionRenderer from "./QuestionRenderer"; 
// Import VisualTestDemo and the EXPORTED InstructionsModal
import VisualTestDemo, { InstructionsModal } from "./VisualTestDemo"; 
import AnimatedScoreCircle from './AnimatedScoreCircle'; 
import FeedbackMessage from './FeedbackMessage'; 


const backgroundImage = "/visual-test/rockvision.png"; 

// ResultsProgressBar remains the same
const ResultsProgressBar = ({ current, total }) => {
  const { t } = useLanguage();
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="mb-8 px-2 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-3">
        <span className="text-lg font-semibold text-white/90">
          {t("labelProgress")}
        </span>
        <span className="text-lg font-bold text-amber-200">
          {current}/{total} <span className="text-sm text-white/80">({Math.round(progress)}%)</span>
        </span>
      </div>
      <div className="w-full h-5 bg-gray-300/30 rounded-full overflow-hidden shadow-inner border border-white/20 backdrop-blur-sm">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 relative"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.8 }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{ opacity: [0, 0.3, 0], x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
           <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md"></div>
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
  const [showDemo, setShowDemo] = useState(true);
  const [showGenericInstructionsModal, setShowGenericInstructionsModal] = useState(false); // New state

  // Define GENERIC instructions for the main test
  const genericTestInstructions = useMemo(() => [
    { text: t("GenericInstruction1")},
    { text: t("GenericInstruction2") },
    { text: t("GenericInstruction3") },
    { text: t("GenericInstruction4") },
    { text: t("GenericInstruction5") },
  ], [t]);


  useEffect(() => {
    const langKey =
      language === "ta" ? "tamil" :
      language === "hi" ? "hindi" :
      language === "kn" ? "kannada" : "english";
    const questionsForLang = Array.isArray(questionsData[langKey]) ? questionsData[langKey] : [];
    setQuizQuestions(questionsForLang);

    // Reset all states for a new test run or language change
    setSelectedOptions(Array(questionsForLang.length).fill(null));
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setQuizStarted(false);
    setShowCharacter(true);
    setShowDemo(true);
  }, [language]);

  const handleAnswer = (option) => {
    // This logic is for the main test
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = option;
    setSelectedOptions(newSelectedOptions);
    if (quizQuestions[currentQuestionIndex] && option === quizQuestions[currentQuestionIndex].correct) {
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
    setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizCompleted(true);
        }
    }, 300);
  };

  const handleCharacterDialogComplete = () => setShowCharacter(false);
  const handleDemoComplete = () => {
    setShowDemo(false);
    setQuizStarted(true); 
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOptions(Array(quizQuestions.length).fill(null));
    setScore(0);
    setSelectedOptions(Array(quizQuestions.length).fill(null));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem("access_token");
    const childId = localStorage.getItem("childId");

    if (!childId) {
      toast.error(t("visualTestSelectStudentError"), { theme: "dark" });
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await axios.post("/api/visual-test/submitResult", 
        { childId, options: selectedOptions, score },
        { headers: { ...(token && { Authorization: `Bearer ${token}` }), "Content-Type": "application/json" } }
      );
      if (response.status === 201) {
        if (suppressResultPage && typeof onComplete === "function") {
          onComplete(score);
        } else {
          toast.success(t("testSubmittedSuccessfully"), {
            position: "top-center", theme: "dark", onClose: () => router.push("/")
          });
        }
      } else {
        toast.error(t("failedToSubmitTestPleaseTryAgain"), { theme: "dark" });
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error(t("anErrorOccurredWhileSubmittingTheTestPleaseTryAgain"), { theme: "dark" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modified to include generic instructions button and modal
  const renderWithBackground = (content, showInstructionsButton = false) => (
    <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4 md:p-8 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
        onClick={() => router.push("/take-tests?skipStart=true")} 
        className="fixed top-4 left-4 z-[70] flex items-center gap-2.5 bg-gradient-to-r from-white/90 to-lime-100/90 hover:from-white hover:to-lime-50 text-green-900 font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all backdrop-blur-sm border border-white/50"
        whileHover={{ scale: 1.05, y: -1, shadow:"lg" }} whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft className="text-green-700" /> {t("backToMap")}
      </motion.button>

      {/* Generic Instructions Button (conditionally rendered) */}
      {showInstructionsButton && (
        <motion.button
          aria-label={t("showTestInstructions")}
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 120 }}
          onClick={() => setShowGenericInstructionsModal(true)}
          className="fixed top-4 right-4 z-[70] flex items-center gap-2 bg-white/10 backdrop-blur-md border-2 border-amber-400/50 text-amber-200 hover:bg-white/20 hover:text-amber-100 font-semibold py-2.5 px-4 sm:px-5 rounded-lg shadow-lg transition-all"
          whileHover={{ scale: 1.08, y: -2, x: -2, shadow: "0px 3px 15px rgba(251,191,36,0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          <FaInfoCircle size={20} /> <span className="hidden sm:inline">{t("testInstructionsButton")}</span>
        </motion.button>
      )}

      {content}

      {/* Generic Instructions Modal */}
      <AnimatePresence>
        {showGenericInstructionsModal && (
            <InstructionsModal
                isOpen={showGenericInstructionsModal}
                onClose={() => setShowGenericInstructionsModal(false)}
                title={t("mainTestInstructionsTitle")}
                instructions={genericTestInstructions}
                t={t} // Use 't' from VisualTestContainer for the modal
            />
        )}
      </AnimatePresence>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
    </div>
  );
  // --- End of renderWithBackground ---


  if (showCharacter) return <CharacterDialog onComplete={handleCharacterDialogComplete} />;
  
  // Pass generic instructions and 't' to VisualTestDemo if needed, though VisualTestDemo now has its own demo-specific text
  if (showDemo) return renderWithBackground(
    <VisualTestDemo 
        onDemoComplete={handleDemoComplete} 
        language={language} 
        questionsData={questionsData}
        // genericInstructions={genericTestInstructions} // No longer needed here as demo uses its own
        // tForInstructions={t} // No longer needed here
    />, 
    false // Don't show generic instructions button during demo intro/question
  ); 
  
  if (quizQuestions.length === 0 && !quizStarted && !quizCompleted) {
    return renderWithBackground(
      <div className="flex flex-col items-center justify-center h-full text-white p-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="text-4xl text-amber-300 mb-4">↻</motion.div>
        <p className="text-2xl bg-black/50 p-6 rounded-lg font-serif text-yellow-100">{t("loadingTest")}</p>
      </div>
    );
  }

  const currentQuestionData = quizQuestions[currentQuestionIndex];
  if (quizStarted && !quizCompleted && currentQuestionData) {
    return renderWithBackground( // Pass true to show instructions button during main test
      <div className="w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="w-full">
            <QuestionRenderer questionData={currentQuestionData} index={currentQuestionIndex} totalQuestions={quizQuestions.length} onAnswer={handleAnswer} onTimeout={handleTimeout}/>
          </motion.div>
        </AnimatePresence>
      </div>,
      true // Show generic instructions button during the main test
    );
  }

  // Quiz Completed Screen
  if (quizCompleted) {
    return renderWithBackground( // Don't show instructions button on completion screen
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 120, damping: 15 }}
          className="relative bg-gradient-to-br from-green-800/70 via-green-900/60 to-yellow-800/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl text-center border-2 border-white/20 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-lime-300 to-amber-300 opacity-80"></div>
          {[...Array(5)].map((_, i) => ( /* Particles */
            <motion.div key={i} className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-0" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`}}
              animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1.5, 0.5], y: [0, -Math.random() * 30 - 10, -Math.random() * 30 - 20]}}
              transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, delay: Math.random() * 1 + i * 0.2, ease: "easeInOut"}}/>
          ))}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }} className="mb-4 sm:mb-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-amber-200 mb-3 drop-shadow-md">{t("visualTestCompleted")}</h2>
          </motion.div>
          <div className="relative z-10 my-6 sm:my-8 flex justify-center"><AnimatedScoreCircle score={score} total={quizQuestions.length} /></div>
          <div className="relative z-10"><FeedbackMessage score={score} total={quizQuestions.length} /></div>
          <div className="relative z-10 my-6 sm:my-8"><ResultsProgressBar current={score} total={quizQuestions.length} /></div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, type: "spring" }} className="flex justify-center relative z-10 mt-2">
            <motion.button whileHover={{ scale: 1.05, y: -2, boxShadow: "0px 5px 20px rgba(251, 191, 36, 0.5)" }} whileTap={{ scale: 0.95 }} onClick={handleSubmit} disabled={isSubmitting}
              className="flex items-center justify-center gap-3 py-3.5 px-10 rounded-xl font-bold text-lg sm:text-xl shadow-xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 hover:shadow-amber-500/60 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none">
              {isSubmitting ? (<><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="inline-block mr-1 text-2xl">↻</motion.span>{t("submitting")}</>) : (<>{t("submitResults")} <FaRocket /></>)}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>,
      false // Do not show generic instructions button on completion screen
    );
  }

  return renderWithBackground(
    <div className="flex items-center justify-center h-full">
      <p className="text-white text-xl bg-black/50 p-4 rounded-lg font-serif ">{t("loading")}</p>
    </div>
  );
};

export default VisualTestContainer;