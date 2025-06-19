// components/sound-blending/WelcomeDialog.js

"use client"

import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import GameplayArea from "./GameplayArea.js"
import InstructionsScreen from "./InstructionsScreen.js"
import FinalResultsScreen from "./FinalResultsScreen.js"
import RewardsModal from "./RewardsModal.js"
import TopBar from "./TopBar.js"

import { words, practiceWord, dialogContent } from "./soundBlendingConstants.js"

import backgroundImage from "../../../public/sound-blending/background.png"
import characterImage from "../../../public/sound-blending/dolphin.png"

const WelcomeDialog = ({ t, speak, onEntireTestComplete, initialChildId }) => {
  const router = useRouter()

  const [gameState, setGameState] = useState("welcome")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [responses, setResponses] = useState([])
  const [isPracticeMode, setIsPracticeMode] = useState(false)
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0)
  const [showInfoDialog, setShowInfoDialog] = useState(false)
  const [showRewards, setShowRewards] = useState(false)

  const totalWords = words.length

  useEffect(() => {
    if (gameState === "welcome" && dialogContent && dialogContent.length > 0) {
      speak(dialogContent[0])
    }
  }, [gameState, speak])

  const handleNextDialog = () => {
    if (currentDialogIndex < dialogContent.length - 1) {
      speak(dialogContent[currentDialogIndex + 1])
      setCurrentDialogIndex(currentDialogIndex + 1)
    } else {
      setGameState("initialInstructions")
    }
  }

  const handleStartPractice = () => {
    setIsPracticeMode(true)
    setCurrentWordIndex(0)
    setScore(0)
    setResponses([])
    setGameState("practice")
  }

  const handleStartTest = () => {
    setIsPracticeMode(false)
    setCurrentWordIndex(0)
    setScore(0)
    setResponses([])
    setGameState("test")
  }

  const handleWordComplete = (userResponse) => {
    const currentWord = isPracticeMode ? practiceWord : words[currentWordIndex]
    const isCorrect = currentWord.alternatives
      ? [...currentWord.alternatives, currentWord.word.toLowerCase()].includes(userResponse)
      : userResponse === currentWord.word.toLowerCase()

    const newResponse = {
      wordId: currentWord.id,
      word: currentWord.word,
      response: userResponse,
      isCorrect,
    }

    const updatedResponses = [...responses, newResponse]
    setResponses(updatedResponses)

    if (isCorrect) {
      setScore(score + 1)
    }

    if (isPracticeMode) {
      setGameState("preTestInstructions")
    } else if (currentWordIndex === words.length - 1) {
      // Test completed - show results
      setGameState("finalResults")
    } else {
      setCurrentWordIndex(currentWordIndex + 1)
    }
  }

  const handleSkipWord = () => {
    const currentWord = isPracticeMode ? practiceWord : words[currentWordIndex]
    const newResponse = {
      wordId: currentWord.id,
      word: currentWord.word,
      response: "[skipped]",
      isCorrect: false,
    }

    const updatedResponses = [...responses, newResponse]
    setResponses(updatedResponses)

    if (isPracticeMode) {
      setGameState("preTestInstructions")
    } else if (currentWordIndex === words.length - 1) {
      setGameState("finalResults")
    } else {
      setCurrentWordIndex(currentWordIndex + 1)
    }
  }

  const handleFinishTest = () => {
    if (onEntireTestComplete) {
      onEntireTestComplete({ correct: score, total: totalWords })
    }
  }

  const handleSkipTest = () => {
    if (onEntireTestComplete) {
      onEntireTestComplete({ correct: 0, total: totalWords })
    }
  }

  const handleShowInfo = () => {
    setShowInfoDialog(true)
  }

  const handleCloseInfo = () => {
    setShowInfoDialog(false)
  }

  const handleViewRewards = () => setShowRewards(true)
  const handleCloseRewards = () => setShowRewards(false)

  const renderContent = () => {
    switch (gameState) {
      case "welcome":
        return (
          <>
            <div className="fixed inset-0 z-40">
              <div className="absolute inset-0" style={{ filter: "blur(8px) brightness(0.7)" }} />
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
                    alt="Blenda the Dolphin"
                    width={384}
                    height={448}
                    className="h-64 sm:h-80 lg:h-96 xl:h-112 object-contain"
                  />
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-cyan-800/70 via-blue-900/70 to-indigo-900/70 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border-2 border-white/20 shadow-2xl flex-1 relative overflow-hidden w-full max-w-none lg:max-w-4xl order-1 lg:order-2"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500"></div>

                  <motion.div
                    key={currentDialogIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white mb-8 lg:mb-12 min-h-48 sm:min-h-56 lg:min-h-64 xl:min-h-72 flex items-center justify-center font-serif font-medium leading-relaxed text-center px-4"
                  >
                    <span className="drop-shadow-lg">{dialogContent[currentDialogIndex]}</span>
                  </motion.div>

                  <div className="flex justify-center gap-3 mb-8 lg:mb-10">
                    {dialogContent.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                          index <= currentDialogIndex
                            ? "bg-gradient-to-r from-white to-blue-200 shadow-lg"
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
                          ? "bg-gradient-to-r from-white to-blue-100 text-blue-900 hover:from-blue-50 hover:to-blue-200"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                      }`}
                    >
                      {currentDialogIndex < dialogContent.length - 1 ? (
                        <>
                          <span className="drop-shadow-sm">{t("continue")}</span>
                          <span className="text-xl">⏳</span>
                        </>
                      ) : (
                        <>
                          <span className="drop-shadow-sm">{t("letsBegin")}</span>
                          <span className="text-xl">🐬</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </>
        )

      case "initialInstructions":
      case "preTestInstructions":
        return (
          <motion.div key={gameState} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InstructionsScreen
              stage={gameState}
              onStartPractice={handleStartPractice}
              onStartTest={handleStartTest}
              t={t}
            />
          </motion.div>
        )

      case "practice":
      case "test":
        return (
          <motion.div
            key={`${gameState}-gameplay`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <TopBar
              currentWord={currentWordIndex + 1}
              totalWords={totalWords}
              score={score}
              onShowInfo={handleShowInfo}
              onSkipTest={handleSkipTest}
              t={t}
            />
            <div className="flex flex-col items-center justify-center min-h-screen relative px-2 sm:px-4 py-10 pt-20">
              <GameplayArea
                key={`${gameState}-${currentWordIndex}`}
                currentWord={isPracticeMode ? practiceWord : words[currentWordIndex]}
                wordIndex={currentWordIndex}
                totalWords={totalWords}
                onWordComplete={handleWordComplete}
                onSkipWord={handleSkipWord}
                t={t}
                isPracticeMode={isPracticeMode}
              />
            </div>
          </motion.div>
        )

      case "finalResults":
        return (
          <FinalResultsScreen
            score={{ correct: score, total: totalWords }}
            onFinishTest={handleFinishTest}
            onViewRewards={handleViewRewards}
            t={t}
          />
        )

      default:
        return <div className="text-white p-10">Error: Unknown game state: {gameState}</div>
    }
  }

  return (
    <div
      className="fixed inset-0 overflow-y-auto bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>

      {/* Info Dialog */}
      {showInfoDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <InstructionsScreen stage="infoOverlay" onClose={handleCloseInfo} t={t} />
        </div>
      )}

      {/* Rewards Modal */}
      {showRewards && <RewardsModal show={showRewards} onClose={handleCloseRewards} t={t} />}
    </div>
  )
}

export default WelcomeDialog
