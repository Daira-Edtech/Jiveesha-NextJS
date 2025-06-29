// QuestionRenderer.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext"; // Ensure path is correct

// ... (QuestionTimer component remains the same)
const QuestionTimer = ({ duration, onComplete, t }) => { // Added t prop
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onComplete, duration]); // Removed t from dependency array, not needed for timer logic

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <svg /* ... */ />
          <span className="text-sm font-medium text-white">
            {t("labelTimeRemaining", "Time Remaining")}
          </span>
        </div>
        <motion.span /* ... */ >
          {timeLeft}
          {t("seconds", " seconds")}
        </motion.span>
      </div>
      <div className="relative h-3 w-full rounded-full bg-gray-200/80 overflow-hidden">
        {/* ... progress bar divs ... */}
         <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-yellow-400/20"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`h-full rounded-full relative ${
            timeLeft < duration * 0.3
              ? "bg-gradient-to-r from-red-500 to-pink-500"
              : "bg-gradient-to-r from-emerald-500 to-yellow-500"
          }`}
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "linear" }}
        >
          {timeLeft < 3 && (
            <motion.div
              className="absolute inset-0 bg-white/30 rounded-full"
              animate={{ opacity: [0, 0.5, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.div>
        <div className="absolute inset-0 flex">
          {[...Array(Math.max(0, duration - 1))].map((_, i) => (
            <div
              key={i}
              className="h-full w-px bg-white/30"
              style={{ marginLeft: `${(100 / duration) * (i + 1)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


// ... (OptionButton component remains the same)
const OptionButton = ({ option, isSelected, isDisabled, onClick }) => {
  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.03 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={isDisabled}
      className={`p-5 rounded-xl text-xl font-semibold transition-all duration-200 relative overflow-hidden
        ${
          isSelected
            ? "bg-gradient-to-br from-emerald-300 to-amber-300 text-gray-900 shadow-lg ring-2 ring-amber-200 shadow-amber-300/30"
            : "bg-gray-800/80 backdrop-blur-sm border border-emerald-400/30 text-emerald-100 hover:bg-gray-800/60"
        }
        ${isDisabled && !isSelected ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`} // Added cursor-not-allowed
    >
      {option}
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        />
      )}
      {!isSelected && (
        <>
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-emerald-400/50" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-emerald-400/50" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-emerald-400/50" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-emerald-400/50" />
        </>
      )}
    </motion.button>
  );
};


const QuestionRenderer = ({
  questionData,
  index,
  totalQuestions,
  onAnswer,
  onTimeout,
  showTimer = true, // <--- ADD THIS PROP WITH A DEFAULT VALUE
  isAttemptBlocked = false, // New prop to block further attempts
}) => {
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false); // To disable options after one answer

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false); // Reset for new question
  }, [questionData]);

  const handleAnswer = (option) => {
    if (isAnswered || isAttemptBlocked) return; // Prevent multiple answers or if blocked
    setSelectedOption(option);
    setIsAnswered(true); // Mark as answered
    // Delay slightly to show selection before calling onAnswer,
    // onAnswer will typically move to next question or show feedback
    setTimeout(() => {
        onAnswer(option);
    }, 300); // Short delay for visual feedback of selection
  };

  if (!questionData) {
    return (
        <div className="text-white text-center p-10">
            {t('loadingQuestion', 'Loading question...')}
        </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-br from-yellow-50/10 via-emerald-950/60 to-amber-800/30 backdrop-blur-xl rounded-3xl p-10 md:p-14 shadow-[0_10px_40px_rgba(0,0,0,0.4)] w-full max-w-4xl mx-auto border-4 border-amber-500/30 overflow-hidden font-sans text-lg md:text-xl leading-relaxed tracking-wide text-yellow-100"
    >
      {/* ... (decorative elements) ... */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60" />
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-amber-300/10 blur-2xl" />
      
      <div className="flex justify-between items-center mb-8">
        <div className="text-amber-300 font-bold text-xl md:text-2xl tracking-wide">
          {showTimer ? ( // Only show question count if it's not a demo with 1 question
            <>
              {t("question", "Question")}{" "}
              <span className="text-emerald-200">{index + 1}</span> / {totalQuestions}
            </>
          ) : (
            t("practiceQuestionTitle", "Practice Question")
          )}
        </div>
        {showTimer && totalQuestions > 0 && ( // Only show progress if timer is shown
            <div className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 text-emerald-100 text-sm md:text-base font-medium">
            {Math.round(((index + 1) / totalQuestions) * 100)}% {t("complete", "Complete")}
            </div>
        )}
      </div>

      {showTimer && totalQuestions > 0 && ( // Only show progress bar if timer is shown
        <div className="mb-10 relative h-3 bg-gray-800/50 rounded-full overflow-hidden">
            <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-300 to-yellow-400"
            initial={{ width: "0%" }}
            animate={{ width: `${((index + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            >
            <motion.div
                className="absolute top-0 right-0 h-full w-1 bg-white"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
            </motion.div>
        </div>
      )}

      {/* Conditionally render QuestionTimer */}
      {showTimer && (
        <QuestionTimer
          duration={8} // Or pass duration as a prop if it varies
          onComplete={onTimeout}
          t={t} // Pass t to QuestionTimer
        />
      )}

      <div className="flex justify-center my-10 md:my-12"> {/* Adjusted margin */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-amber-200/10 blur-xl rounded-2xl" />
          <motion.div
            whileHover={!isAnswered && !isAttemptBlocked ? { scale: 1.04, rotate: 0.5 } : {}}
            className="relative py-8 px-16 md:py-10 md:px-20 rounded-2xl text-5xl md:text-7xl font-bold border-4 border-yellow-400/40 bg-[#1c1f1e]/90 text-amber-100 shadow-[0_10px_30px_rgba(255,191,0,0.1)] backdrop-blur-xl"
          >
            {questionData.word}
            <div className="absolute top-0 left-0 w-full h-full border border-white/10 rounded-xl pointer-events-none" />
          </motion.div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
        {questionData.options.map((option, optionIndex) => (
          <OptionButton
            key={optionIndex}
            option={option}
            isSelected={selectedOption === option}
            // Disable if already answered OR if attempt is blocked from parent
            isDisabled={isAnswered || isAttemptBlocked}
            onClick={() => handleAnswer(option)}
          />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30" />
    </motion.div>
  );
};

export default QuestionRenderer;