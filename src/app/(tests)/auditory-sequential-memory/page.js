// app/(tests)/auditory-sequential/page.js

"use client"

import axios from "axios"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import WelcomeDialog from "@/components/auditory-sequential-memory/WelcomeDialog.js"
import { useLanguage } from "@/contexts/LanguageContext.jsx"

// Direct Implementation of t() and speak()
const translations = {
  continue: "Continue",
  next: "Next",
  imReady: "I'm Ready!",
  memoryTest: "Memory Test",
  welcomeMemoryGame: "Welcome to the Memory Game! We'll test how well you can remember sequences of numbers.",
  listenCarefullyNumbers: "Listen carefully as numbers are spoken and displayed one by one.",
  repeatBackExactly:
    "When prompted, repeat the numbers back in the exact order you heard them (or reverse order later!).",
  startEasyGetHarder: "The sequences will start easy and get progressively harder. Do your best!",
  startTest: "Start Test",
  levelUpReverseChallenge: "Level Up: The Reverse Challenge!",
  nowExcitingTwist: "Great job on the forward numbers! Now, for an exciting twist...",
  ifISay: "If I say:",
  youSay: "You say:",
  startReverseChallenge: "Start Reverse Challenge",
  listenCarefully: "Listen Carefully...",
  repeatNumbersOrder: "Your turn! Repeat the numbers in the order you heard them.",
  sayNumbersReverse: "Your turn! Say the numbers in REVERSE order.",
  recording: "Recording",
  processingYourAnswer: "Processing your answer...",
  youSaid: "You said",
  correct: "Correct!",
  letsTryNextOne: "Let's try the next one!",
  backToTests: "Back to Tests",
  progress: "Progress",
  practice: "Practice", // Add this line
  mode: "Mode",
  skipTest: "Skip Test",
  errorProcessingAudio: "Error processing audio",
  errorRecording: "Error recording",
  errorMicAccess: "Microphone access denied",
  testResults: "Test Results",
  memoryTestCompleted: "You've completed the Memory Test! Here's how you did.",
  yourScore: "Your Score:",
  accuracy: "Accuracy",
  excellentMemory: "Excellent Memory!",
  veryGoodJob: "Very Good Job!",
  goodEffort: "Good Effort!",
  keepPracticing: "Keep Practicing!",
  finishTest: "Finish Test",
  viewRewards: "View Rewards",
  forwardSequences: "Forward",
  reverseSequences: "Reverse",
  rewardsTitle: "Congratulations! You've mastered memory sequences!",
  rewardEarned: "You've earned the",
  memoryMasterTrophy: "Memory Master Trophy",
  returnToResults: "Return to Results",
}



const speak = (text, rate = 0.9, pitch = 1.1) => {
  console.log(`TTS (direct): ${text}`)
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.lang = "en-US"
    window.speechSynthesis.speak(utterance)
  }
}
//vimalchangesdonehere
const AuditorySequentialPage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { language, t } = useLanguage()
  const speak = useCallback(
    (text, rate = 0.9, pitch = 1.1) => {
      if (typeof window !== "undefined" && "speechSynthesis" in window && text) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = rate
        utterance.pitch = pitch
        utterance.lang = language
        window.speechSynthesis.speak(utterance)
      }
    },
    [language]
)
  const [childId, setChildId] = useState(null)

  useEffect(() => {
    const storedChildId = localStorage.getItem("childId")
    if (storedChildId) {
      setChildId(storedChildId)
    }
  }, [])

  const handleEntireTestFlowComplete = async (finalScore) => {
    const token = localStorage.getItem("access_token")

    if (!childId) {
      console.warn("Child ID is missing. Cannot save results.")
      if (pathname !== "/dummy") {
        router.push("/take-tests?skipStart=true")
      }
      return
    }

    const isDummyRoute = pathname === "/dummy";
    const apiUrl = isDummyRoute
      ? "/api/continuous-test"
      : "/api/auditory-test/submitResult";

    const payload = isDummyRoute
      ? {
          childId,
          totalScore: parseFloat(finalScore?.final || 0),
          testResults: JSON.stringify(finalScore),
          analysis: "Auditory Sequential Memory Test",
        }
      : {
          childId: childId,
          score: finalScore.final,
          forwardCorrect: finalScore.forward,
          reverseCorrect: finalScore.reverse,
          test_name: "Auditory Sequential Memory Test",
        };

    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      })

      console.log("Test results saved by page.js:", response.data)
    } catch (error) {
      console.error("Error saving test results in page.js:", error.response?.data || error.message)
    } finally {
      if (!isDummyRoute) {
        router.push("/take-tests?skipStart=true")
      }
    }
  }

  return (
    <div className="w-screen h-screen">
      <WelcomeDialog t={t} speak={speak} onEntireTestComplete={handleEntireTestFlowComplete} initialChildId={childId} />
    </div>
  )
}

export default AuditorySequentialPage
