import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext"; 

const QuestionTimer = ({ duration, onComplete }) => {
  const { t } = useLanguage();
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
  }, [timeLeft, onComplete, duration]);

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 text-blue-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium text-white">
            {t("labelTimeRemaining")}
          </span>
        </div>
        <motion.span
          className="text-lg font-bold text-white bg-clip-text text-transparent" 
          key={timeLeft}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {timeLeft}
          {t(" seconds")}
        </motion.span>
      </div>
      <div className="relative h-3 w-full rounded-full bg-gray-200/80 overflow-hidden">
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
        ${isDisabled && !isSelected ? "opacity-70" : ""}`}
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
}) => {
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setSelectedOption(null); 
  }, [questionData]);

  const handleAnswer = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    setTimeout(() => {
      onAnswer(option);
    }, 500);
  };

  if (!questionData) { // Added a guard clause
    return null; 
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-br from-yellow-50/10 via-emerald-950/60 to-amber-800/30 backdrop-blur-xl rounded-3xl p-10 md:p-14 shadow-[0_10px_40px_rgba(0,0,0,0.4)] w-full max-w-4xl mx-auto border-4 border-amber-500/30 overflow-hidden font-sans text-lg md:text-xl leading-relaxed tracking-wide text-yellow-100"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60" />
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-amber-300/10 blur-2xl" />
      <div className="flex justify-between items-center mb-8">
        <div className="text-amber-300 font-bold text-xl md:text-2xl tracking-wide">
          {t("question")} <span className="text-emerald-200">{index + 1}</span>{" "}
          / {totalQuestions}
        </div>
        <div className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 text-emerald-100 text-sm md:text-base font-medium">
          {totalQuestions > 0 ? Math.round(((index + 1) / totalQuestions) * 100) : 0}% {t("complete")}
        </div>
      </div>
      <div className="mb-10 relative h-3 bg-gray-800/50 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-300 to-yellow-400"
          initial={{ width: "0%" }}
          animate={{ width: `${totalQuestions > 0 ? ((index + 1) / totalQuestions) * 100 : 0}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            className="absolute top-0 right-0 h-full w-1 bg-white"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>
      <QuestionTimer
        duration={8} 
        onComplete={onTimeout}
      />
      <div className="flex justify-center my-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-amber-200/10 blur-xl rounded-2xl" />
          <motion.div
            whileHover={{ scale: 1.04, rotate: 0.5 }}
            whileTap={{ scale: 0.98 }}
            className="relative py-10 px-20 rounded-2xl text-6xl md:text-7xl font-bold border-4 border-yellow-400/40 bg-[#1c1f1e]/90 text-amber-100 shadow-[0_10px_30px_rgba(255,191,0,0.1)] backdrop-blur-xl"
          >
            {questionData.word}
            <div className="absolute top-0 left-0 w-full h-full border border-white/10 rounded-xl pointer-events-none" />
          </motion.div>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {questionData.options.map((option, optionIndex) => (
          <OptionButton
            key={optionIndex}
            option={option}
            isSelected={selectedOption === option}
            isDisabled={selectedOption !== null}
            onClick={() => handleAnswer(option)}
          />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30" />
    </motion.div>
  );
};

export default QuestionRenderer;