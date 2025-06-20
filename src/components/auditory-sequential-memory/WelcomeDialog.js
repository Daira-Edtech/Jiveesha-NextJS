// components/auditory-sequential/WelcomeDialog.js

"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import InstructionsScreen from "./InstructionsScreen.js";
import PresentingScreen from "./PresentingScreen.js";
import ListeningScreen from "./ListeningScreen.js";
import TopBar from "./TopBar.js";
import FinalResultsScreen from "./FinalResultsScreen.js";
import RewardsModal from "./RewardsModal.js";

import {
  forwardSequences,
  reverseSequences,
  dialogContent,
  digitMap,
  practiceForwardSequence,
  practiceReverseSequence,
  DIGIT_DISPLAY_TIME,
  PAUSE_BETWEEN_DIGITS,
} from "./auditorySequentialConstants.js";

import backgroundImage from "../../../public/auditory-test/backgroundImage.png";
import characterImage from "../../../public/auditory-test/characterImage.png";

const WelcomeDialog = ({ t, speak, onEntireTestComplete, initialChildId }) => {
  const router = useRouter();

  const [gameState, setGameState] = useState("welcome");
  const [mode, setMode] = useState("forward");
  const [sequences, setSequences] = useState(forwardSequences);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [currentSequence, setCurrentSequence] = useState([]);
  const [displayedDigit, setDisplayedDigit] = useState(null);
  const [digitIndex, setDigitIndex] = useState(0);

  const [forwardScore, setForwardScore] = useState(0);
  const [reverseScore, setReverseScore] = useState(0);
  const [forwardErrors, setForwardErrors] = useState(0);
  const [reverseErrors, setReverseErrors] = useState(0);

  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);

  const [isPracticeMode, setIsPracticeMode] = useState(false);

  const timeoutRef = useRef(null);
  const presentNextDigitLogicRef = useRef();

  const [showRewards, setShowRewards] = useState(false);
  const [consecutiveForwardErrors, setConsecutiveForwardErrors] = useState(0);
  const [consecutiveReverseErrors, setConsecutiveReverseErrors] = useState(0);
  const [forwardSequencesAttempted, setForwardSequencesAttempted] = useState(0);
  const [reverseSequencesAttempted, setReverseSequencesAttempted] = useState(0);

  useEffect(() => {
    if (gameState === "welcome" && dialogContent && dialogContent.length > 0) {
      speak(dialogContent[0]);
    }
  }, [gameState, speak]);

  const handleNextDialog = () => {
    if (currentDialogIndex < dialogContent.length - 1) {
      speak(dialogContent[currentDialogIndex + 1]);
      setCurrentDialogIndex(currentDialogIndex + 1);
    } else {
      setGameState("forwardInstructions");
    }
  };

  const parseTranscript = useCallback((transcriptInput) => {
    if (!transcriptInput || transcriptInput.trim() === "") {
      return [];
    }

    let processedTranscript = transcriptInput
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .trim();

    // Replace word numbers with digits
    const sortedWords = Object.keys(digitMap).sort(
      (a, b) => b.length - a.length
    );

    for (const word of sortedWords) {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escapedWord}\\b`, "gi");
      processedTranscript = processedTranscript.replace(
        regex,
        String(digitMap[word])
      );
    }

    // Extract digits
    const numbersAndSpaces = processedTranscript.replace(/[^\d\s]/g, "");
    const cleaned = numbersAndSpaces.trim().replace(/\s+/g, " ");

    if (cleaned === "") {
      return [];
    }

    // Try space-separated first
    const spaceSplit = cleaned.split(" ").filter((s) => s !== "");
    if (
      spaceSplit.length > 0 &&
      spaceSplit.every((item) => /^\d$/.test(item))
    ) {
      return spaceSplit.map(Number);
    }

    // Try concatenated digits
    const concatenated = cleaned.replace(/\s+/g, "");
    if (concatenated.length > 0 && /^\d+$/.test(concatenated)) {
      return concatenated.split("").map(Number);
    }

    return [];
  }, []);

  const stablePresentNextDigit = useCallback((sequence, index) => {
    if (presentNextDigitLogicRef.current) {
      presentNextDigitLogicRef.current(sequence, index);
    }
  }, []);

  // Present next digit logic
  useEffect(() => {
    presentNextDigitLogicRef.current = (sequence, index) => {
      if (index >= sequence.length) {
        setDisplayedDigit(null);
        timeoutRef.current = setTimeout(() => {
          setGameState("listening");
        }, 500);
        return;
      }

      const digit = sequence[index];
      setDisplayedDigit(digit);
      setDigitIndex(index);
      speak(String(digit), 1, 1.2);

      timeoutRef.current = setTimeout(() => {
        setDisplayedDigit(null);
        timeoutRef.current = setTimeout(() => {
          if (presentNextDigitLogicRef.current) {
            presentNextDigitLogicRef.current(sequence, index + 1);
          }
        }, PAUSE_BETWEEN_DIGITS);
      }, DIGIT_DISPLAY_TIME);
    };
  }, [speak]);

  const startForward = () => {
    setMode("forward");
    setIsPracticeMode(true);
    setSequences([practiceForwardSequence]); // Start with practice
    setSequenceIndex(0);
    setGameState("presenting");
  };

  const startReverse = () => {
    setMode("reverse");
    setIsPracticeMode(true);
    setSequences([practiceReverseSequence]); // Start with practice
    setSequenceIndex(0);
    setGameState("presenting");
  };

  const moveToNextSequence = useCallback(() => {
    if (sequenceIndex + 1 < sequences.length) {
      setSequenceIndex((prev) => prev + 1);
      setGameState("presenting");
    } else {
      // Check if we just completed practice
      if (isPracticeMode) {
        setIsPracticeMode(false);
        if (mode === "forward") {
          // Move to real forward test
          setSequences(forwardSequences);
          setSequenceIndex(0);
          setGameState("presenting");
        } else {
          // Move to real reverse test
          setSequences(reverseSequences);
          setSequenceIndex(0);
          setGameState("presenting");
        }
      } else {
        // Real test completed
        if (mode === "forward") {
          setGameState("reverseInstructions");
        } else {
          // Test completed
          const finalScore = Math.round((forwardScore + reverseScore) / 2);
          if (onEntireTestComplete) {
            onEntireTestComplete({
              final: finalScore,
              forward: forwardScore,
              reverse: reverseScore,
              forwardTotal: forwardSequencesAttempted,
              reverseTotal: reverseSequencesAttempted,
            });
          }
        }
      }
    }
  }, [
    sequenceIndex,
    sequences.length,
    mode,
    isPracticeMode,
    forwardScore,
    reverseScore,
    onEntireTestComplete,
    forwardSequencesAttempted,
    reverseSequencesAttempted,
  ]);

  const handleResponseComplete = useCallback(
    (transcript) => {
      const userAnswer = parseTranscript(transcript);
      const correctAnswer =
        mode === "forward" ? currentSequence : [...currentSequence].reverse();

      const isCorrect =
        userAnswer.length === correctAnswer.length &&
        userAnswer.every((digit, i) => digit === correctAnswer[i]);

      if (isCorrect) {
        if (isPracticeMode) {
          speak("Great job! Now let's start the real test.", 0.9, 1.3);
        } else {
          speak(t("correct"), 0.9, 1.3);
        }

        if (mode === "forward") {
          setForwardScore((prev) => prev + 1);
          setConsecutiveForwardErrors(0); // Reset consecutive errors on correct answer
        } else {
          setReverseScore((prev) => prev + 1);
          setConsecutiveReverseErrors(0); // Reset consecutive errors on correct answer
        }
      } else {
        if (isPracticeMode) {
          speak(
            "Let's try that again. Listen carefully and repeat the numbers.",
            0.9,
            1.0
          );
        } else {
          speak(t("letsTryNextOne"), 0.9, 1.0);

          if (mode === "forward") {
            setForwardErrors((prev) => prev + 1);
            setConsecutiveForwardErrors((prev) => prev + 1);
          } else {
            setReverseErrors((prev) => prev + 1);
            setConsecutiveReverseErrors((prev) => prev + 1);
          }
        }
      }

      // Update attempted counts
      if (!isPracticeMode) {
        if (mode === "forward") {
          setForwardSequencesAttempted((prev) => prev + 1);
        } else {
          setReverseSequencesAttempted((prev) => prev + 1);
        }
      }

      setTimeout(() => {
        if (isPracticeMode) {
          moveToNextSequence();
          return;
        }

        // Check for 2 consecutive errors in forward mode
        if (mode === "forward" && consecutiveForwardErrors >= 1 && !isCorrect) {
          // Will be 2 after increment
          console.log("2 consecutive forward errors, moving to reverse");
          setGameState("reverseInstructions");
          return;
        }

        // Check for 2 consecutive errors in reverse mode
        if (mode === "reverse" && consecutiveReverseErrors >= 1 && !isCorrect) {
          // Will be 2 after increment
          console.log("2 consecutive reverse errors, showing final results");
          setGameState("finalResults");
          return;
        }

        moveToNextSequence();
      }, 2000);
    },
    [
      parseTranscript,
      mode,
      currentSequence,
      isPracticeMode,
      consecutiveForwardErrors,
      consecutiveReverseErrors,
      forwardScore,
      reverseScore,
      moveToNextSequence,
      speak,
      t,
    ]
  );

  const handleSkipTest = () => {
    if (onEntireTestComplete) {
      onEntireTestComplete({
        final: 0,
        forward: 0,
        reverse: 0,
        forwardTotal: 0,
        reverseTotal: 0,
      });
    }
  };

  const handleShowInfo = () => {
    console.log("Show info dialog");
  };

  const handleViewRewards = () => setShowRewards(true);
  const handleCloseRewards = () => setShowRewards(false);

  const handleFinishTest = () => {
    if (onEntireTestComplete) {
      onEntireTestComplete({
        final: Math.round((forwardScore + reverseScore) / 2),
        forward: forwardScore,
        reverse: reverseScore,
        forwardTotal: forwardSequencesAttempted,
        reverseTotal: reverseSequencesAttempted,
      });
    }
  };

  // Start presenting when gameState changes to presenting
  useEffect(() => {
    if (gameState === "presenting" && sequenceIndex < sequences.length) {
      setCurrentSequence(sequences[sequenceIndex]);
      setDigitIndex(0);
      timeoutRef.current = setTimeout(
        () => stablePresentNextDigit(sequences[sequenceIndex], 0),
        500
      );
    }
    return () => clearTimeout(timeoutRef.current);
  }, [gameState, sequenceIndex, sequences, stablePresentNextDigit]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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
                    alt="Svarini, Guardian of Svara Gufa"
                    width={384}
                    height={448}
                    className="h-64 sm:h-80 lg:h-96 xl:h-112 object-contain"
                  />
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-black/20 via-black/40 to-black/60 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border-2 border-amber-400/20 shadow-2xl flex-1 relative overflow-hidden w-full max-w-none lg:max-w-4xl order-1 lg:order-2"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600"></div>

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
                            ? "bg-gradient-to-r from-white to-amber-200 shadow-lg"
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
                          ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 hover:from-amber-300 hover:to-yellow-400"
                          : "bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-700"
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
                          <span className="drop-shadow-sm">{t("imReady")}</span>
                          <span className="text-xl">🎶</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </>
        );

      case "forwardInstructions":
        return (
          <motion.div
            key="forwardInstructions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <InstructionsScreen
              stage="forward"
              onStartForward={startForward}
              t={t}
            />
          </motion.div>
        );

      case "reverseInstructions":
        return (
          <motion.div
            key="reverseInstructions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <InstructionsScreen
              stage="reverse"
              onStartReverse={startReverse}
              t={t}
            />
          </motion.div>
        );

      case "presenting":
        return (
          <motion.div
            key={`presenting-${sequenceIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <TopBar
              currentSequence={sequenceIndex + 1}
              totalSequences={sequences.length}
              score={mode === "forward" ? forwardScore : reverseScore}
              mode={mode}
              onShowInfo={handleShowInfo}
              onSkipTest={handleSkipTest}
              t={t}
            />
            <div className="flex flex-col items-center justify-center min-h-screen relative px-2 sm:px-4 py-10 pt-20">
              <PresentingScreen
                displayedDigit={displayedDigit}
                digitIndex={digitIndex}
                t={t}
              />
            </div>
          </motion.div>
        );

      case "listening":
        return (
          <motion.div
            key={`listening-${sequenceIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <TopBar
              currentSequence={sequenceIndex + 1}
              totalSequences={sequences.length}
              score={mode === "forward" ? forwardScore : reverseScore}
              mode={mode}
              onShowInfo={handleShowInfo}
              onSkipTest={handleSkipTest}
              t={t}
            />
            <div className="flex flex-col items-center justify-center min-h-screen relative px-2 sm:px-4 py-10 pt-20">
              <ListeningScreen
                mode={mode}
                onResponseComplete={handleResponseComplete}
                t={t}
              />
            </div>
          </motion.div>
        );

      case "finalResults":
        return (
          <FinalResultsScreen
            score={{
              forward: forwardScore,
              reverse: reverseScore,
              forwardTotal: forwardSequencesAttempted,
              reverseTotal: reverseSequencesAttempted,
            }}
            onFinishTest={handleFinishTest}
            onViewRewards={handleViewRewards}
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
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      {/* Rewards Modal */}
      {showRewards && (
        <RewardsModal show={showRewards} onClose={handleCloseRewards} t={t} />
      )}
    </div>
  );
};

export default WelcomeDialog;
