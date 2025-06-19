// components/symbol-sequence/WelcomeDialog.js

"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import WelcomeScreen from "./WelcomeScreen.js"
import ShowingScreen from "./ShowingScreen.js"
import GuessingScreen from "./GuessingScreen.js"
import ResultsScreen from "./ResultsScreen.js"
import FinalResultsScreen from "./FinalResultsScreen.js"
import RewardsModal from "./RewardsModal.js"
import TopBar from "./TopBar.js"
import InstructionsScreen from "./InstructionsScreen.js"
import InfoDialog from "./InfoDialog.js"
import { symbols, difficultyLevels, practiceSequence } from "./symbolSequenceConstants.js"

import backgroundImage from "../../../public/symbol-sequence/Mystical-Runescape.png"

const WelcomeDialog = ({ t, speak, onEntireTestComplete, initialChildId }) => {
  const router = useRouter()

  const [gameState, setGameState] = useState("welcome")
  const [level, setLevel] = useState(0)
  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [currentSequence, setCurrentSequence] = useState([])
  const [userSequence, setUserSequence] = useState([])
  const [availableSymbols, setAvailableSymbols] = useState([])
  const [showingIndex, setShowingIndex] = useState(-1)
  const [hoveredCardIndex, setHoveredCardIndex] = useState(-1)
  const [feedback, setFeedback] = useState("")
  const [confetti, setConfetti] = useState(false)
  const [showRewards, setShowRewards] = useState(false)
  const [showInfoDialog, setShowInfoDialog] = useState(false)
  const [isPracticeMode, setIsPracticeMode] = useState(false)

  const totalRounds = 10

  // Generate random sequence
  const generateSequence = useCallback((difficulty) => {
    const sequenceLength = difficultyLevels[difficulty].sequenceLength
    const sequence = []
    for (let i = 0; i < sequenceLength; i++) {
      sequence.push(symbols[Math.floor(Math.random() * symbols.length)])
    }
    return sequence
  }, [])

  // Generate available symbols for guessing
  const generateAvailableSymbols = useCallback((sequence, difficulty) => {
    const availableCount = difficultyLevels[difficulty].availableSymbolsCount
    const available = [...sequence]

    while (available.length < availableCount) {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]
      if (!available.includes(randomSymbol)) {
        available.push(randomSymbol)
      }
    }

    return available.sort(() => Math.random() - 0.5)
  }, [])

  const startGame = (selectedLevel) => {
    setLevel(selectedLevel)
    setGameState("initialInstructions")
  }

  const startPracticeRound = () => {
    setIsPracticeMode(true)
    setCurrentRound(1)
    setScore(0)
    setGameState("showing")

    // Use practice sequence
    setCurrentSequence(practiceSequence)
    setUserSequence([])
    setAvailableSymbols(generateAvailableSymbols(practiceSequence, 0)) // Use easy difficulty for practice

    // Start showing sequence
    let index = 0
    const showInterval = setInterval(() => {
      setShowingIndex(index)
      index++
      if (index >= practiceSequence.length) {
        clearInterval(showInterval)
        setTimeout(() => {
          setShowingIndex(-1)
          setTimeout(() => {
            setGameState("guessing")
          }, 500)
        }, 1000)
      }
    }, 1000)

    // Auto-transition after viewing time
    setTimeout(() => {
      clearInterval(showInterval)
      setShowingIndex(-1)
      setTimeout(() => {
        setGameState("guessing")
      }, 500)
    }, 4000) // 4 seconds for practice
  }

  const startMainTest = () => {
    setIsPracticeMode(false)
    setCurrentRound(1)
    setScore(0)
    setGameState("showing")

    const sequence = generateSequence(level)
    setCurrentSequence(sequence)
    setUserSequence([])
    setAvailableSymbols(generateAvailableSymbols(sequence, level))

    // Start showing sequence
    let index = 0
    const showInterval = setInterval(() => {
      setShowingIndex(index)
      index++
      if (index >= sequence.length) {
        clearInterval(showInterval)
        setTimeout(() => {
          setShowingIndex(-1)
          setTimeout(() => {
            setGameState("guessing")
          }, 500)
        }, 1000)
      }
    }, 1000)

    // Auto-transition after viewing time
    setTimeout(() => {
      clearInterval(showInterval)
      setShowingIndex(-1)
      setTimeout(() => {
        setGameState("guessing")
      }, 500)
    }, difficultyLevels[level].timeToView)
  }

  const selectSymbol = (symbol) => {
    if (userSequence.length < currentSequence.length) {
      setUserSequence([...userSequence, symbol])
    }
  }

  const removeSymbol = (index) => {
    const newSequence = userSequence.filter((_, i) => i !== index)
    setUserSequence(newSequence)
  }

  const checkAnswer = () => {
    const isCorrect = JSON.stringify(userSequence) === JSON.stringify(currentSequence)

    if (isCorrect) {
      setScore(score + 1)
      setFeedback(t("correct"))
      setConfetti(true)
      setTimeout(() => setConfetti(false), 3000)
    } else {
      setFeedback(t("incorrect"))
    }

    setGameState("results")
  }

  const continueGame = () => {
    if (isPracticeMode) {
      // Practice completed, show pre-test instructions
      setGameState("preTestInstructions")
      return
    }

    if (currentRound >= totalRounds) {
      setGameState("finalResults")
    } else {
      const nextRound = currentRound + 1
      setCurrentRound(nextRound)
      setGameState("showing")

      const sequence = generateSequence(level)
      setCurrentSequence(sequence)
      setUserSequence([])
      setAvailableSymbols(generateAvailableSymbols(sequence, level))

      // Start showing sequence
      let index = 0
      const showInterval = setInterval(() => {
        setShowingIndex(index)
        index++
        if (index >= sequence.length) {
          clearInterval(showInterval)
          setTimeout(() => {
            setShowingIndex(-1)
            setTimeout(() => {
              setGameState("guessing")
            }, 500)
          }, 1000)
        }
      }, 1000)

      // Auto-transition after viewing time
      setTimeout(() => {
        clearInterval(showInterval)
        setShowingIndex(-1)
        setTimeout(() => {
          setGameState("guessing")
        }, 500)
      }, difficultyLevels[level].timeToView)
    }
  }

  const handleFinishTest = () => {
    if (onEntireTestComplete) {
      onEntireTestComplete({ correct: score, total: totalRounds })
    }
  }

  const handleViewRewards = () => setShowRewards(true)
  const handleCloseRewards = () => setShowRewards(false)

  const handleSkipTest = () => {
    if (onEntireTestComplete) {
      onEntireTestComplete({ correct: 0, total: totalRounds })
    }
  }

  const handleShowInfo = () => {
    setShowInfoDialog(true)
  }

  const handleCloseInfo = () => {
    setShowInfoDialog(false)
  }

  // Auto-check answer when sequence is complete
  useEffect(() => {
    if (gameState === "guessing" && userSequence.length === currentSequence.length) {
      setTimeout(checkAnswer, 500)
    }
  }, [userSequence, gameState, currentSequence.length])

  const renderContent = () => {
    switch (gameState) {
      case "welcome":
        return <WelcomeScreen onStartGame={startGame} t={t} />

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
        )

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
        )

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
        )

      case "finalResults":
        return (
          <FinalResultsScreen
            score={{ correct: score, total: totalRounds }}
            onFinishTest={handleFinishTest}
            onViewRewards={handleViewRewards}
            t={t}
          />
        )

      case "initialInstructions":
        return (
          <InstructionsScreen
            stage="initialInstructions"
            onStartPractice={startPracticeRound}
            onStartTest={startMainTest}
            t={t}
          />
        )

      case "preTestInstructions":
        return (
          <InstructionsScreen
            stage="preTestInstructions"
            onStartPractice={startPracticeRound}
            onStartTest={startMainTest}
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
                backgroundColor: ["#d9a24b", "#f3c969", "#1a2a3a", "#3b2f1d"][Math.floor(Math.random() * 4)],
              }}
              animate={{
                top: "100%",
                left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
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
      {showRewards && <RewardsModal show={showRewards} onClose={handleCloseRewards} t={t} />}

      {/* Info Dialog */}
      {showInfoDialog && <InfoDialog show={showInfoDialog} onClose={handleCloseInfo} t={t} />}
    </div>
  )
}

export default WelcomeDialog
