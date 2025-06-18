import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionRenderer from './QuestionRenderer'; // Ensure this path is correct
import { useLanguage } from '../../../contexts/LanguageContext'; // Ensure this path is correct
import { FaInfoCircle, FaPlay, FaCheckCircle, FaTimesCircle, FaUndo, FaLightbulb } from 'react-icons/fa';


// --- Instructions Modal Component ---
const InstructionsModal = ({ isOpen, onClose, title, instructions, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 transition-opacity duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-gradient-to-br from-slate-800 via-gray-900 to-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl max-w-xl w-full text-white border-2 border-slate-700"
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl sm:text-3xl font-bold text-amber-400 flex items-center">
            <FaLightbulb className="mr-3 text-amber-400" /> {title}
          </h3>
          <motion.button whileHover={{scale: 1.1}} whileTap={{scale:0.9}} onClick={onClose} className="text-slate-400 hover:text-white">
            <FaTimesCircle size={28}/>
          </motion.button>
        </div>
        <div className="mb-6 space-y-3 text-gray-200 text-base sm:text-lg leading-relaxed">
          {instructions.map((item, index) => (
            <div key={index} className="flex items-start">
              <FaCheckCircle className="text-green-400 mr-3 mt-1 flex-shrink-0" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(251, 191, 36, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-7 rounded-lg transition-all duration-200 text-lg shadow-md"
          >
            {t("gotIt")}
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
  const [attemptStatus, setAttemptStatus] = useState(null); // null, 'correct', 'incorrect'
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showInitialMessage, setShowInitialMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Define test-specific instructions
  const visualTestInstructions = useMemo(() => [
    { text: t("VisualDemoInstruction1") },
    { text: t("VisualDemoInstruction2") },
    { text: t("VisualDemoInstruction3") },
    { text: t("VisualDemoInstruction4") },
    { text: t("VisualDemoInstruction5") },
    { text: t("VisualDemoPracticeNote") },
  ], [t]);

  useEffect(() => {
    setIsLoading(true);
    setAttemptStatus(null);
    setUserSelection(null);
    const langKey = language === 'ta' ? 'tamil' : language === 'hi' ? 'hindi' : language === 'kn' ? 'kannada' : 'english';
    const questionsForLang = Array.isArray(questionsData?.[langKey]) ? questionsData[langKey] : [];
    
    if (questionsForLang.length > 0) {
      setDemoQuestion({ ...questionsForLang[0] }); // Use a copy
    } else {
      console.error(`VisualTestDemo: No questions found for language: ${langKey}`);
      setDemoQuestion(null); // Explicitly set to null if no questions
    }
    setIsLoading(false);
  }, [language, questionsData]);

  const handleDemoAnswer = (option) => {
    if (attemptStatus === 'correct') return; // Already answered correctly

    setUserSelection(option);
    if (demoQuestion && option === demoQuestion.correct) {
      setAttemptStatus('correct');
    } else {
      setAttemptStatus('incorrect');
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
        <p className="text-xl">{t("loadingPractice")}</p>
      </div>
    );
  }

  if (showInitialMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="bg-gradient-to-br from-gray-800 via-gray-900 to-black/80 backdrop-blur-lg p-6 sm:p-10 rounded-xl shadow-2xl text-center max-w-lg w-full border-2 border-slate-700"
        >
          <FaLightbulb className="text-yellow-400 text-5xl mx-auto mb-5"/>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-amber-400">{t("practiceRoundTitle")}</h2>
          <p className="text-md sm:text-lg mb-6 text-gray-200 leading-relaxed">
            {t("practiceRoundIntroVisual")}
          </p>
          <p className="text-sm sm:text-md mb-8 text-gray-300">
            {t("practiceRoundTip")}
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2, boxShadow: "0px 5px 15px rgba(52, 211, 153, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartDemoQuestion}
            disabled={!demoQuestion}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-10 rounded-lg text-lg sm:text-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FaPlay /> {demoQuestion ? t("startPracticeQuestion") : t("loadingPractice")}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!demoQuestion) {
    return (
      <div className="flex items-center justify-center h-full text-white text-xl p-6 bg-red-500/20 rounded-md">
         <FaTimesCircle className="mr-3 text-red-400 text-2xl" /> {t("errorNoPracticeQuestion")}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4">
      <motion.button
        aria-label={t("showInstructions")}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness:120 }}
        onClick={() => setShowInstructionsModal(true)}
        className="fixed top-3 right-3 sm:top-4 sm:right-4 z-[60] flex items-center gap-2 bg-sky-600/90 hover:bg-sky-500/95 text-white font-semibold py-2.5 px-4 sm:px-5 rounded-lg shadow-lg backdrop-blur-sm transition-colors"
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaInfoCircle /> <span className="hidden sm:inline">{t("testInstructions")}</span>
      </motion.button>

      <AnimatePresence>
        {showInstructionsModal && (
            <InstructionsModal
                isOpen={showInstructionsModal}
                onClose={() => setShowInstructionsModal(false)}
                title={t("visualTestInstructionsTitle")}
                instructions={visualTestInstructions}
                t={t}
            />
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl mb-4 sm:mb-6">
        <QuestionRenderer
          key={attemptStatus === null ? 'attempting' : (userSelection || 'initial')} 
          questionData={demoQuestion}
          index={0} 
          totalQuestions={1} 
          onAnswer={handleDemoAnswer}
          onTimeout={() => {}} 
          showTimer={false} 
          isAttemptBlocked={attemptStatus === 'correct'} 
        />
      </div>

      <AnimatePresence>
        {attemptStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="mt-1 sm:mt-2 text-center bg-gradient-to-br from-slate-700/80 via-gray-800/90 to-slate-700/80 backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-xl max-w-md w-full border border-slate-600"
          >
            {attemptStatus === 'correct' && (
              <>
                <div className="flex items-center justify-center text-green-400 text-lg sm:text-xl font-semibold mb-5">
                  <FaCheckCircle className="mr-2.5 text-2xl" /> 
                  {t("practiceCorrect")}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2, boxShadow: "0px 5px 15px rgba(251, 191, 36, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartMainTest}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-10 rounded-lg text-lg sm:text-xl shadow-lg flex items-center justify-center gap-2"
                >
                  {t("startMainTest")} <FaPlay className="ml-1"/>
                </motion.button>
              </>
            )}
            {attemptStatus === 'incorrect' && (
              <>
                <div className="flex flex-col items-center text-red-400 text-lg sm:text-xl font-semibold mb-3">
                    <div className="flex items-center">
                        <FaTimesCircle className="mr-2.5 text-2xl" />
                        {t("practiceIncorrect")}
                    </div>
                     <p className="text-sm text-gray-300 mt-1.5">
                        {t("practiceSelected", { selection: userSelection || 'nothing' })}
                    </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y:-1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTryAgain}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg text-md sm:text-lg shadow-md flex items-center justify-center gap-2"
                >
                  <FaUndo /> {t("tryAgain")}
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisualTestDemo;