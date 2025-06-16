// app/(tests)/sequence-arrangement/GameplayArea.js
"use client";

import { motion } from "framer-motion"; // Removed AnimatePresence as it's not used directly here for this component's root
import Lottie from "lottie-react";
import { useCallback, useEffect, useState } from "react";

// Path to public assets: A leading '/' means from the 'public' directory.
// Ensure 'public/sequence-test/clockAnimation.json' exists.
import clockAnimationData from "../../../public/sequence-test/clockAnimation.json";

// Assuming Constants.js is in the same directory as GameplayArea.js
import { animals as animalEmojis } from "./Constants.js";

// Utility functions
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const initCards = (sequence, allAnimalEmojis) => {
  const sequenceCards = sequence.map(item => ({ ...item }));
  const availableChoices = [...sequenceCards];
  const animalTypes = Object.keys(allAnimalEmojis);
  for (let i = 0; i < 2; i++) {
    availableChoices.push({
      name: animalTypes[Math.floor(Math.random() * animalTypes.length)],
    });
  }
  return shuffleArray(availableChoices);
};

// Component definition with added props for round display
const GameplayArea = ({
  mode,
  currentSequence,
  onCompleteItem,
  onTryAgainRequest,
  t,
  currentTestItemNumber, // ADDED: Prop for current round number (1-based)
  totalTestItems         // ADDED: Prop for total number of test rounds
}) => {
  const [showExample, setShowExample] = useState(true);
  const [timer, setTimer] = useState(5);
  const [selectedCards, setSelectedCards] = useState([]);
  const [availableCards, setAvailableCards] = useState([]);
  const [feedback, setFeedback] = useState({ message: "", isCorrect: null, show: false });

  const resetForNewSequence = useCallback(() => {
    setShowExample(true);
    setTimer(5);
    setSelectedCards([]);
    if (currentSequence && currentSequence.length > 0) {
        setAvailableCards(initCards(currentSequence, animalEmojis));
    } else {
        setAvailableCards([]);
    }
    setFeedback({ message: "", isCorrect: null, show: false });
  }, [currentSequence]); // animalEmojis could be a dependency if it could change, but it's from a static import

  useEffect(() => {
    resetForNewSequence();
  }, [currentSequence, resetForNewSequence]);

  useEffect(() => {
    let countdown;
    if (showExample && timer > 0) {
      countdown = setTimeout(() => setTimer(t => t - 1), 1000);
    } else if (showExample && timer === 0) {
      setShowExample(false);
    }
    return () => clearTimeout(countdown);
  }, [showExample, timer]);

  const selectCard = (card, index) => {
    if (selectedCards.length < 4 && !feedback.show) {
      setSelectedCards(prev => [...prev, card]);
      const newAvailable = [...availableCards];
      newAvailable.splice(index, 1);
      setAvailableCards(newAvailable);
    }
  };

  const removeCard = (index) => {
    if (!feedback.show) {
      const removedCard = selectedCards[index];
      setSelectedCards(prev => prev.filter((_, i) => i !== index));
      setAvailableCards(prev => shuffleArray([...prev, removedCard])); // Re-shuffle or just add
    }
  };

  const handleCheckAnswer = () => {
    if (!currentSequence || selectedCards.length < currentSequence.length) return;

    let isCorrect = true;
    for (let i = 0; i < currentSequence.length; i++) {
      if (!selectedCards[i] || selectedCards[i].name !== currentSequence[i].name) {
        isCorrect = false;
        break;
      }
    }
    setFeedback({
      message: isCorrect ? t("greatJob") : t("tryAgain"),
      isCorrect: isCorrect,
      show: true
    });

    setTimeout(() => {
      setFeedback(fb => ({ ...fb, show: false }));
      onCompleteItem(isCorrect);
    }, 2000);
  };

  const handleInternalTryAgain = () => {
    resetForNewSequence();
    if (onTryAgainRequest) {
      onTryAgainRequest();
    }
  };

  const renderFeedbackMessage = () => {
    if (!feedback.show) return null;
    return (
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 p-3 px-6 rounded-lg shadow-xl text-white font-semibold text-md z-20 ${
          feedback.isCorrect ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {feedback.message}
        {feedback.isCorrect ? " 🎉" : " 😢"}
      </motion.div>
    );
  };

  if (!currentSequence || currentSequence.length === 0) {
    return <div className="text-white text-center p-10">Loading sequence...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-black/50 backdrop-blur-sm rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-amber-300/30 mt-24 relative">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-300">
          {/* --- MODIFIED TITLE LOGIC --- */}
          {mode === "practice"
            ? t("practiceRound")
            : (currentTestItemNumber && totalTestItems) // Check if BOTH are truthy
            ? `${t("round")} ${currentTestItemNumber} ${t("of")} ${totalTestItems}`
            : t("memorizeAndRecreate") /* Fallback if not practice and round info is missing */
          }
        </h2>
      </div>
      <div className="min-h-[450px] sm:min-h-[500px] w-full flex flex-col justify-center relative">
        {showExample ? (
          <div className="w-full">
            <div className="space-y-6 w-full">
              <div className="flex flex-col items-center w-full">
                <h3 className="text-2xl sm:text-3xl font-bold text-amber-300 mb-8 sm:mb-10">{t("rememberSequence")}</h3>
                <div className="flex justify-center gap-4 sm:gap-8 w-full">
                  {currentSequence.map((animal, index) => (
                    <motion.div
                      key={`example-${animal.name}-${index}`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.15, type: "spring", stiffness: 300, damping: 10 }}
                      className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl shadow-lg flex items-center justify-center text-5xl sm:text-6xl border-4 border-amber-300"
                    >
                      {animalEmojis[animal.name]}
                    </motion.div>
                  ))}
                </div>
                {timer > 0 && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }}
                    className="relative w-36 h-36 sm:w-48 sm:h-48 mt-8 mx-auto"
                  >
                    <div className="absolute inset-x-6 inset-y-6 sm:inset-x-8 sm:inset-y-8 rounded-full bg-amber-950/30 z-0"></div>
                    <Lottie animationData={clockAnimationData} loop={true} style={{ width: "100%", height: "100%" }} className="absolute inset-0 z-10" />
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center z-20"
                      animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}
                    >
                      <span className="text-4xl sm:text-5xl font-bold text-white drop-shadow-md">{timer}</span>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="space-y-6 sm:space-y-8 w-full">
              <div className="grid grid-cols-4 gap-3 sm:gap-6 w-full max-w-md sm:max-w-2xl mx-auto mb-10 sm:mb-12">
                {selectedCards.map((card, index) => (
                  <motion.div
                    key={`selected-${card.name}-${index}`}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1 }}
                    className="relative aspect-square bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl shadow-lg flex items-center justify-center text-4xl sm:text-6xl border-4 border-amber-300 group cursor-pointer"
                    onClick={() => removeCard(index)}
                  >
                    {animalEmojis[card.name]}
                    <motion.div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 rounded-xl flex items-center justify-center" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
                      <span className="text-white text-xs sm:text-lg font-semibold">{t("remove")}</span>
                    </motion.div>
                  </motion.div>
                ))}
                {Array(4 - selectedCards.length).fill(0).map((_, index) => (
                  <motion.div
                    key={`empty-${index}`}
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1, boxShadow: ["0 0 0px rgba(255, 215, 0, 0)", "0 0 8px rgba(255, 215, 0, 0.5)", "0 0 0px rgba(255, 215, 0, 0)"] }}
                    transition={{ delay: index * 0.1, duration: 1.5, repeat: Infinity }}
                    className="aspect-square bg-amber-900/20 rounded-xl shadow-inner flex items-center justify-center text-3xl sm:text-5xl text-amber-200 border-2 border-amber-700/30 border-dashed"
                  >
                    ?
                  </motion.div>
                ))}
              </div>
              <div className="relative">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                <div className="py-6 sm:py-8">
                  <h3 className="text-xl sm:text-2xl font-semibold text-amber-300 text-center mb-6 sm:mb-8">{t("availableChoices")}</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 sm:gap-6 w-full max-w-sm sm:max-w-3xl mx-auto">
                    {availableCards.map((card, index) => (
                      <motion.div
                        key={`available-${card.name}-${index}-${Math.random()}`}
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        className="aspect-square bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl shadow-lg flex items-center justify-center text-4xl sm:text-6xl border-4 border-amber-300 cursor-pointer"
                        onClick={() => selectCard(card, index)}
                      >
                        {animalEmojis[card.name]}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 sm:gap-6 w-full mt-8 sm:mt-10">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleInternalTryAgain}
                disabled={feedback.show}
                className="px-5 py-2.5 sm:px-8 sm:py-4 bg-gradient-to-r from-amber-700 to-amber-600 text-white rounded-full font-semibold text-md sm:text-xl shadow-md hover:shadow-lg disabled:opacity-60"
              >
                ↻ {t("tryAgain")}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleCheckAnswer}
                disabled={!currentSequence || selectedCards.length < currentSequence.length || feedback.show} // Added currentSequence null check
                className="px-5 py-2.5 sm:px-8 sm:py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full font-semibold text-md sm:text-xl shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                ✓ {t("checkAnswer")}
              </motion.button>
            </div>
          </div>
        )}
        {renderFeedbackMessage()}
      </div>
    </div>
  );
};

export default GameplayArea;