// components/symbol-sequence/WelcomeDialog.js

"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ShowingScreen from "./ShowingScreen.js";
import GuessingScreen from "./GuessingScreen.js";
import ResultsScreen from "./ResultsScreen.js";
import FinalResultsScreen from "./FinalResultsScreen.js";
import RewardsModal from "./RewardsModal.js";
import TopBar from "./TopBar.js";
import InstructionsScreen from "./InstructionsScreen.js";
import BackToMapButton from "../BackToMapButton.jsx";
import {
  symbols,
  difficultyLevels,
  practiceSequence,
} from "./symbolSequenceConstants.js";
import WelcomeScreen from "./WelcomeScreen.js";

import backgroundImage from "../../../public/symbol-sequence/Mystical-Runescape.png";
import characterImage from "../../../public/symbol-sequence/Rune.png";

const WelcomeDialog = ({
  t,
  onEntireTestComplete,
  initialChildId,
  dialogContent,
}) => {
  const router = useRouter();

  const [gameState, setGameState] = useState("welcome");
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const [level, setLevel] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [currentSequence, setCurrentSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [availableSymbols, setAvailableSymbols] = useState([]);
  const [showingIndex, setShowingIndex] = useState(-1);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(-1);
  const [feedback, setFeedback] = useState("");
  const [confetti, setConfetti] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  const totalRounds = 10;

  // Generate random sequence
  const generateSequence = useCallback((difficulty) => {
    const sequenceLength = difficultyLevels[difficulty].sequenceLength;
    const sequence = [];
    for (let i = 0; i < sequenceLength; i++) {
      sequence.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    return sequence;
  }, []);

  // Generate available symbols for guessing
  const generateAvailableSymbols = useCallback((sequence, difficulty) => {
    const availableCount = difficultyLevels[difficulty].availableSymbolsCount;
    const available = [...sequence];

    while (available.length < availableCount) {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      if (!available.includes(randomSymbol)) {
        available.push(randomSymbol);
      }
    }

    return available.sort(() => Math.random() - 0.5);
  }, []);

  const startGame = (selectedLevel) => {
    setLevel(selectedLevel);
    setGameState("initialInstructions");
  };

  const startPracticeRound = () => {
    setIsPracticeMode(true);
    setCurrentRound(1);
    setScore(0);
    setGameState("showing");

    // Use practice sequence
    setCurrentSequence(practiceSequence);
    setUserSequence([]);
    setAvailableSymbols(generateAvailableSymbols(practiceSequence, 0)); // Use easy difficulty for practice

    // Start showing sequence
    let index = 0;
    const showInterval = setInterval(() => {
      setShowingIndex(index);
      index++;
      if (index >= practiceSequence.length) {
        clearInterval(showInterval);
        setTimeout(() => {
          setShowingIndex(-1);
          setTimeout(() => {
            setGameState("guessing");
          }, 500);
        }, 1000);
      }
    }, 1000);

    // Auto-transition after viewing time
    setTimeout(() => {
      clearInterval(showInterval);
      setShowingIndex(-1);
      setTimeout(() => {
        setGameState("guessing");
      }, 500);
    }, 4000); // 4 seconds for practice
  };

  const startMainTest = () => {
    setIsPracticeMode(false);
    setCurrentRound(1);
    setScore(0);
    setGameState("showing");

    const sequence = generateSequence(level);
    setCurrentSequence(sequence);
    setUserSequence([]);
    setAvailableSymbols(generateAvailableSymbols(sequence, level));

    // Start showing sequence
    let index = 0;
    const showInterval = setInterval(() => {
      setShowingIndex(index);
      index++;
      if (index >= sequence.length) {
        clearInterval(showInterval);
        setTimeout(() => {
          setShowingIndex(-1);
          setTimeout(() => {
            setGameState("guessing");
          }, 500);
        }, 1000);
      }
    }, 1000);

    // Auto-transition after viewing time
    setTimeout(() => {
      clearInterval(showInterval);
      setShowingIndex(-1);
      setTimeout(() => {
        setGameState("guessing");
      }, 500);
    }, difficultyLevels[level].timeToView);
  };

  const selectSymbol = (symbol) => {
    if (userSequence.length < currentSequence.length) {
      setUserSequence([...userSequence, symbol]);
    }
  };

  const removeSymbol = (index) => {
    const newSequence = userSequence.filter((_, i) => i !== index);
    setUserSequence(newSequence);
  };

  const checkAnswer = useCallback(() => {
    const isCorrect =
      JSON.stringify(userSequence) === JSON.stringify(currentSequence);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setFeedback(t("correct"));
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    } else {
      setFeedback(t("incorrect"));
    }

    setGameState("results");
  }, [userSequence, currentSequence, t]);

  const continueGame = () => {
    if (isPracticeMode) {
      // Practice completed, show pre-test instructions
      setGameState("preTestInstructions");
      return;
    }

    if (currentRound >= totalRounds) {
      setGameState("finalResults");
    } else {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      setGameState("showing");

      const sequence = generateSequence(level);
      setCurrentSequence(sequence);
      setUserSequence([]);
      setAvailableSymbols(generateAvailableSymbols(sequence, level));

      // Start showing sequence
      let index = 0;
      const showInterval = setInterval(() => {
        setShowingIndex(index);
        index++;
        if (index >= sequence.length) {
          clearInterval(showInterval);
          setTimeout(() => {
            setShowingIndex(-1);
            setTimeout(() => {
              setGameState("guessing");
            }, 500);
          }, 1000);
        }
      }, 1000);

      // Auto-transition after viewing time
      setTimeout(() => {
        clearInterval(showInterval);
        setShowingIndex(-1);
        setTimeout(() => {
          setGameState("guessing");
        }, 500);
      }, difficultyLevels[level].timeToView);
    }
  };

  const handleFinishTest = () => {
    if (onEntireTestComplete) {
      onEntireTestComplete({ correct: score, total: totalRounds });
    }
  };

  const handleViewRewards = () => setShowRewards(true);
  const handleCloseRewards = () => setShowRewards(false);

  const handleSkipTest = () => {
    if (onEntireTestComplete) {
      onEntireTestComplete({ correct: 0, total: totalRounds });
    }
  };

  const handleShowInfo = () => {
    setShowInfoDialog(true);
  };

  const handleCloseInfo = () => {
    setShowInfoDialog(false);
  };

  // Auto-check answer when sequence is complete
  useEffect(() => {
    if (
      gameState === "guessing" &&
      userSequence.length === currentSequence.length
    ) {
      setTimeout(checkAnswer, 500);
    }
  }, [userSequence, gameState, currentSequence.length, checkAnswer]);

  useEffect(() => {
    if (gameState === "welcome" && dialogContent && dialogContent.length > 0) {
      dialogContent[0];
    }
  }, [gameState, , dialogContent]);

  const handleNextDialog = () => {
    if (currentDialogIndex < dialogContent.length - 1) {
      dialogContent[currentDialogIndex + 1];
      setCurrentDialogIndex(currentDialogIndex + 1);
    } else {
      setGameState("difficultySelection");
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case "welcome":
        return (
          <>
            <div className="fixed inset-0 z-40">
              <div
                className="absolute inset-0"
                style={{ filter: "blur(8px) brightness(0.7)" }}
              />
              <motion.div
                className="absolute inset-0 bg-black/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative max-w-7xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-12"
              >
                <motion.div
                  initial={{ y: -40, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: [1, 1.03, 1],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    y: { duration: 0.6, ease: "backOut" },
                    opacity: { duration: 0.8 },
                    scale: {
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    },
                    rotate: {
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                  }}
                  className="flex-shrink-0 order-2 lg:order-1"
                >
                  <Image
                    src={characterImage || "/placeholder.svg"}
                    alt="Mystara, Guardian of the Ancient Symbols"
                    width={384}
                    height={448}
                    className="h-64 sm:h-80 lg:h-96 xl:h-112 object-contain"
                  />
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-[#1a2a3a]/70 via-[#3b2f1d]/70 to-[#1a2a3a]/70 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border-2 border-[#d9a24b]/30 shadow-2xl flex-1 relative overflow-hidden w-full max-w-none lg:max-w-4xl order-1 lg:order-2"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#d9a24b] via-[#f3c969] to-[#d9a24b]"></div>

                  <motion.div
                    key={currentDialogIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white mb-8 lg:mb-12 min-h-48 sm:min-h-56 lg:min-h-64 xl:min-h-72 flex items-center justify-center font-serif font-medium leading-relaxed text-center px-4"
                  >
                    <span className="drop-shadow-lg">
                      {dialogContent[currentDialogIndex]}
                    </span>
                  </motion.div>

                  <div className="flex justify-center gap-3 mb-8 lg:mb-10">
                    {dialogContent.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                          index <= currentDialogIndex
                            ? "bg-gradient-to-r from-white to-[#f3c969] shadow-lg"
                            : "bg-white/30"
                        }`}
                        initial={{ scale: 0.8 }}
                        animate={{
                          scale: index === currentDialogIndex ? 1.3 : 1,
                          y: index === currentDialogIndex ? -4 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextDialog}
                      className={`flex items-center justify-center gap-3 py-4 px-8 lg:px-12 rounded-xl font-bold text-lg lg:text-xl shadow-2xl transition-all duration-300 ${
                        currentDialogIndex < dialogContent.length - 1
                          ? "bg-gradient-to-r from-white to-[#f3c969] text-[#3b2f1d] hover:from-[#f3c969] hover:to-white"
                          : "bg-gradient-to-r from-[#f3c969] to-[#d9a24b] text-white hover:from-[#d9a24b] hover:to-[#f3c969]"
                      }`}
                    >
                      {currentDialogIndex < dialogContent.length - 1 ? (
                        <>
                          <span className="drop-shadow-sm">
                            {t("continue")}
                          </span>
                          <span className="text-xl">⏳</span>
                        </>
                      ) : (
                        <>
                          <span className="drop-shadow-sm">
                            {t("letsBegin")}
                          </span>
                          <span className="text-xl">🔮</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </>
        );

      case "difficultySelection":
        return <WelcomeScreen onStartGame={startGame} t={t} />;

      case "showing":
        return (
          <ShowingScreen
            currentSequence={currentSequence}
            currentRound={currentRound}
            totalRounds={totalRounds}
            showingIndex={showingIndex}
            timeToView={difficultyLevels[level].timeToView}
            t={t}
          />
        );

      case "guessing":
        return (
          <GuessingScreen
            currentSequence={currentSequence}
            userSequence={userSequence}
            availableSymbols={availableSymbols}
            currentRound={currentRound}
            totalRounds={totalRounds}
            hoveredCardIndex={hoveredCardIndex}
            onSelectSymbol={selectSymbol}
            onRemoveSymbol={removeSymbol}
            onHoverStart={setHoveredCardIndex}
            onHoverEnd={() => setHoveredCardIndex(-1)}
            t={t}
          />
        );

      case "results":
        return (
          <ResultsScreen
            feedback={feedback}
            userSequence={userSequence}
            currentSequence={currentSequence}
            currentRound={currentRound}
            totalRounds={totalRounds}
            onContinue={continueGame}
            t={t}
          />
        );

      case "finalResults":
        return (
          <FinalResultsScreen
            score={{ correct: score, total: totalRounds }}
            onFinishTest={handleFinishTest}
            onViewRewards={handleViewRewards}
            t={t}
          />
        );

      case "initialInstructions":
        return (
          <InstructionsScreen
            stage="initialInstructions"
            onStartPractice={startPracticeRound}
            onStartTest={startMainTest}
            t={t}
          />
        );

      case "preTestInstructions":
        return (
          <InstructionsScreen
            stage="preTestInstructions"
            onStartPractice={startPracticeRound}
            onStartTest={startMainTest}
            t={t}
          />
        );

      default:
        return (
          <div className="text-white p-10">
            Error: Unknown game state: {gameState}
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-y-auto bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      {/* Back to Map Button */}
      <BackToMapButton 
        variant="glass" 
        position="top-left"
        className="z-[70]"
      />
      
      {/* Confetti Effect */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              initial={{
                top: "0%",
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#d9a24b", "#f3c969", "#1a2a3a", "#3b2f1d"][
                  Math.floor(Math.random() * 4)
                ],
              }}
              animate={{
                top: "100%",
                left: [
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`,
                ],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Top Bar - only show during gameplay */}
      {gameState !== "welcome" && gameState !== "finalResults" && (
        <TopBar
          currentRound={currentRound}
          totalRounds={totalRounds}
          score={score}
          onShowInfo={handleShowInfo}
          onSkipTest={handleSkipTest}
          t={t}
        />
      )}

      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>

      {/* Rewards Modal */}
      {showRewards && (
        <RewardsModal show={showRewards} onClose={handleCloseRewards} t={t} />
      )}

      {/* Info Dialog */}
      {showInfoDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <InstructionsScreen
            stage="infoOverlay"
            onClose={handleCloseInfo}
            t={t}
          />
        </div>
      )}
    </div>
  );
};

export default WelcomeDialog;
