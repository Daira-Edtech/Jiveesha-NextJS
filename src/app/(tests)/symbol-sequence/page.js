// app/(tests)/symbol-sequence/page.js

"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import WelcomeDialog from "../../../components/symbol-sequence/WelcomeDialog.js"

// Direct Implementation of t() and speak()
const translations = {
  continue: "Continue",
  letsBegin: "Let's Begin",
  symbolSequenceAssessment: "Symbol Sequence Assessment",
  symbolSequenceDescription: "Test your memory by observing and recreating mystical symbol sequences.",
  chooseDifficulty: "Choose Difficulty",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  lookCarefully: "Look Carefully",
  round: "Round",
  of: "of",
  complete: "Complete",
  waitUntilDisappear: "Memorize the sequence before it disappears!",
  recreateSequence: "Recreate the Sequence",
  yourSequence: "Your Sequence",
  availableSymbols: "Available Symbols",
  remove: "Remove",
  correct: "Correct!",
  incorrect: "Try Again!",
  correctSequence: "Correct Sequence",
  viewResults: "View Results",
  testResults: "Test Results",
  testCompletedMessage: "You've completed the Symbol Sequence test! Here's how you did.",
  yourScore: "Your Score:",
  viewRewards: "View Rewards",
  finishTest: "Finish Test",
  rewardsTitle: "Congratulations! You've mastered the mystical symbols!",
  returnToResults: "Return to Results",
  backToTests: "Back to Tests",
  progress: "Progress",
  skipTest: "Skip Test",
  gameComplete: "Game Complete",
  finalScore: "Final Score",
  excellentMemory: "Excellent Memory!",
  veryGoodJob: "Very Good Job!",
  goodEffort: "Good Effort!",
  keepPracticing: "Keep Practicing!",
  playAgain: "Play Again",
  savingResults: "Saving Results...",
  howToPlay: "How to Play",
  aboutTheGame: "About The Game",
  symbolGameDescription:
    "This is a mystical memory game. Watch the sequence of symbols, remember their order, and then recreate it perfectly.",
  watchSymbolSequence: "Watch the sequence of mystical symbols.",
  memorizeOrder: "Memorize the order they appear in.",
  recreateFromMemory: "Recreate the sequence by selecting symbols in the correct order.",
  limitedViewingTime: "You'll have limited time to memorize each sequence.",
  gameStructure: "Game Structure",
  practiceRound: "Practice Round",
  practiceRoundDescription: "Start with a practice round to get familiar with the mystical symbols.",
  mainTest: "Main Test",
  mainTestDescription: "The main test consists of 10 rounds with increasing difficulty.",
  tips: "Tips",
  focusOnSymbolOrder: "Focus on the order, not just the symbols themselves.",
  lookForPatterns: "Look for patterns or create mental stories.",
  useMemoryTechniques: "Use memory techniques like visualization.",
  stayCalm: "Stay calm and take your time during selection.",
  startPracticeRound: "Start Practice Round",
  readyForTest: "Ready for the Real Test?",
  testDescription: "Great job on the practice! Now, let's start the main test with 10 challenging rounds.",
  startTest: "Start Test",
  close: "Close",
}

const t = (key) => translations[key] || key

const speak = (text) => {
  console.log(`TTS (direct): ${text}`)
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }
}

const SymbolSequencePage = () => {
  const router = useRouter()
  const [childId, setChildId] = useState(null)

  useEffect(() => {
    const storedChildId = localStorage.getItem("childId")
    if (storedChildId) {
      setChildId(storedChildId)
    }
  }, [])

  const handleEntireTestFlowComplete = async (finalScore) => {
    console.log("Entire test flow completed. Final Score:", finalScore)
    const token = localStorage.getItem("access_token")

    if (!childId) {
      console.warn("Child ID is missing. Cannot save results.")
      router.push("/take-tests?skipStart=true")
      return
    }

    try {
      const response = await axios.post(
        "/api/symbolsequence-test/submitResult",
        {
          childId: childId,
          difficulty: "medium", // You can determine this based on the selected difficulty
          level: 1, // You can track this if needed
          score: finalScore.correct,
          totalRounds: finalScore.total,
        },
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "application/json",
          },
        },
      )

      console.log("Test results saved by page.js:", response.data)
    } catch (error) {
      console.error("Error saving test results in page.js:", error.response?.data || error.message)
      // Continue to results page even if save fails
    } finally {
      router.push("/take-tests?skipStart=true")
    }
  }

  return (
    <div className="w-screen h-screen">
      <WelcomeDialog
        t={t}
        speak={speak}
        onEntireTestComplete={handleEntireTestFlowComplete}
        initialChildId={childId}
        dialogContent={[
          "🔮 Greetings, young seeker! I am Mystara, guardian of the Ancient Symbols.",
          "✨ These mystical runes hold the power of memory and concentration.",
          "🌟 Your quest is to observe the sacred sequences and recreate them perfectly.",
          "🎭 Are you ready to unlock the secrets of the Symbol Realm?",
        ]}
      />
    </div>
  )
}

export default SymbolSequencePage
