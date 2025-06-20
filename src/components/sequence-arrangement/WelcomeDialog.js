// app/(tests)/sequence-arrangement/WelcomeDialog.js
"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import GameplayArea from "./GameplayArea";
import InfoDialog from "./InfoDialog.js"; // <<<<<< IMPORT InfoDialog
import InstructionsScreen from "./InstructionsScreen.js";
import ResultsScreen from "./ResultsScreen.js";
import RewardsModal from "./RewardsModal.js";
import TopBar from "./TopBar.js";

import {
  dialogContent,
  practiceSequence as practiceSequenceData,
  sequences as testItemsData,
} from "./Constants.js";

import islandBackgroundImage from "../../../public/sequence-test/Mystical-TimeIsland.png";
import captainCharacter from "../../../public/sequence-test/Pirate-Crab.png";

const WelcomeDialog = ({ t, onEntireTestComplete, initialChildId }) => {
  const router = useRouter(); // <<<<<< INITIALIZE router
  const [internalGameState, setInternalGameState] = useState("welcome");
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [currentSequence, setCurrentSequence] = useState(() => [
    ...practiceSequenceData,
  ]);

  const [showInfoDialogOverlay, setShowInfoDialogOverlay] = useState(false);

  const handleNextInitialDialog = () => {
    if (currentDialogIndex < dialogContent.length - 1) {
      dialogContent[currentDialogIndex + 1];
      setCurrentDialogIndex(currentDialogIndex + 1);
    } else {
      setInternalGameState("initialInstructions");
    }
  };

  const handleStartPractice = () => {
    setInternalGameState("practice");
    setCurrentSequence([...practiceSequenceData]);
    setScore({ correct: 0, total: 0 });
  };

  const handlePracticeItemComplete = (isCorrect) => {
    if (isCorrect) {
      setTimeout(() => setInternalGameState("preTestInstructions"), 300);
    }
  };

  const handleStartTest = () => {
    setInternalGameState("test");
    setCurrentItemIndex(0);
    setScore({ correct: 0, total: 0 });
    setCurrentSequence([...testItemsData[0]]);
  };

  const handleTestItemComplete = (isCorrect) => {
    let newScore = { ...score };
    if (isCorrect) newScore.correct += 1;
    newScore.total += 1;
    setScore(newScore);
    setTimeout(() => {
      if (currentItemIndex < testItemsData.length - 1) {
        const nextItemIndex = currentItemIndex + 1;
        setCurrentItemIndex(nextItemIndex);
        setCurrentSequence([...testItemsData[nextItemIndex]]);
      } else {
        setInternalGameState("results");
      }
    }, 300);
  };

  const handleTryAgainRequest = useCallback(() => {
    if (internalGameState === "practice") {
      setCurrentSequence([...practiceSequenceData]);
    } else if (
      internalGameState === "test" &&
      currentItemIndex < testItemsData.length
    ) {
      setCurrentSequence([...testItemsData[currentItemIndex]]);
    }
  }, [internalGameState, currentItemIndex]);

  const handleFinishTestAndSave = () => {
    if (onEntireTestComplete) {
      onEntireTestComplete(score);
    }
    router.push("/take-tests"); // <<<<<< CORRECTED (router defined, semicolon added)
  }; // <<<<<< CORRECTED (removed extra '};')

  const handleViewRewards = () => setInternalGameState("rewards");
  const handleCloseRewards = () => setInternalGameState("results");

  const handleSkipTestEntirely = () => {
    if (onEntireTestComplete) {
      onEntireTestComplete({ correct: 0, total: testItemsData.length });
    }
    // Consider adding navigation after skipping, e.g., router.push("/take-tests");
  };

  const handleShowInfoDialogOverlay = () => {
    setShowInfoDialogOverlay(true);
  };

  const handleCloseInfoDialogOverlay = () => {
    setShowInfoDialogOverlay(false);
  };

  const renderContent = () => {
    switch (internalGameState) {
      case "welcome":
        return (
          <>
            <div className="fixed inset-0 z-40">
              {" "}
              {/* Overlay for welcome dialog focus */}
              <div
                className="absolute inset-0"
                style={{ filter: "blur(8px) brightness(0.7)" }} // Example: Dim and blur main background
              />
              <motion.div
                className="absolute inset-0 bg-black/20" // Further dimming
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {/* Actual Welcome Dialog Box, Character, Text */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative max-w-7xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-12"
              >
                <motion.div /* Character */
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
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    },
                    rotate: {
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  className="flex-shrink-0 order-2 lg:order-1"
                >
                  <Image
                    src={captainCharacter}
                    alt="Captain"
                    width={384}
                    height={448}
                    className="h-64 sm:h-80 lg:h-96 xl:h-112 object-contain"
                  />
                </motion.div>
                <motion.div /* Dialog text box */
                  className="bg-gradient-to-br from-amber-900/70 to-yellow-900/70 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border-2 border-white/20 shadow-2xl flex-1 relative overflow-hidden w-full max-w-none lg:max-w-4xl order-1 lg:order-2"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500"></div>
                  <motion.div /* Dialog text */
                    key={`dialog-${currentDialogIndex}`}
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
                    {dialogContent.map((_, index /* Progress dots */) => (
                      <motion.div
                        key={`dot-${index}`}
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
                    <motion.button /* Next button */
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextInitialDialog}
                      className={`flex items-center justify-center gap-3 py-4 px-8 lg:px-12 rounded-xl font-bold text-lg lg:text-xl shadow-2xl transition-all duration-300 ${
                        currentDialogIndex < dialogContent.length - 1
                          ? "bg-gradient-to-r from-white to-amber-100 text-amber-900 hover:from-amber-50 hover:to-amber-200"
                          : "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600"
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
                          <span className="text-xl">🦀</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </>
        );
      case "initialInstructions":
      case "preTestInstructions":
        return (
          <motion.div
            key={internalGameState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <InstructionsScreen
              stage={internalGameState}
              onStartPractice={handleStartPractice}
              onStartTest={handleStartTest}
              t={t}
            />
          </motion.div>
        );
      case "practice":
      case "test":
        return (
          <motion.div
            key={`${internalGameState}-gameplay`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <TopBar
              mode={internalGameState}
              currentItem={internalGameState === "test" ? currentItemIndex : 0}
              score={score}
              onShowInfo={handleShowInfoDialogOverlay}
              onSkipTest={handleSkipTestEntirely}
              t={t}
              totalTestItems={testItemsData.length}
            />
            <div className="flex flex-col items-center justify-center min-h-screen relative px-2 sm:px-4 py-10 pt-20">
              {" "}
              {/* pt-20 for TopBar */}
              <GameplayArea
                key={`${internalGameState}-${currentItemIndex}`}
                mode={internalGameState}
                currentSequence={currentSequence}
                onCompleteItem={
                  internalGameState === "practice"
                    ? handlePracticeItemComplete
                    : handleTestItemComplete
                }
                onTryAgainRequest={handleTryAgainRequest}
                t={t}
                currentTestItemNumber={
                  internalGameState === "test"
                    ? currentItemIndex + 1
                    : undefined
                }
                totalTestItems={
                  internalGameState === "test"
                    ? testItemsData.length
                    : undefined
                }
              />
            </div>
          </motion.div>
        );
      case "results":
        return (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultsScreen
              score={score}
              onFinishTest={handleFinishTestAndSave}
              onViewRewards={handleViewRewards}
              t={t}
            />
          </motion.div>
        );
      case "rewards":
        return (
          <motion.div
            key="rewards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RewardsModal show={true} onClose={handleCloseRewards} t={t} />
          </motion.div>
        );
      default:
        return (
          <div className="text-white p-10">
            Error: Unknown game state: {internalGameState}
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-y-auto bg-cover bg-center"
      style={{ backgroundImage: `url(${islandBackgroundImage.src})` }}
    >
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>

      {showInfoDialogOverlay && (
        <InfoDialog
          key="infoDialogOverlay"
          show={showInfoDialogOverlay}
          onClose={handleCloseInfoDialogOverlay}
          t={t}
        />
      )}
    </div>
  );
};

export default WelcomeDialog;
