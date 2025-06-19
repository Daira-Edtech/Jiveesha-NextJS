// app/(tests)/auditory-sequential/page.js

"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import WelcomeDialog from "../../../components/auditory-sequential-memory/WelcomeDialog"

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
  mode: "Mode",
  skipTest: "Skip Test",
  errorProcessingAudio: "Error processing audio",
  errorRecording: "Error recording",
  errorMicAccess: "Microphone access denied",
}

const t = (key) => translations[key] || key

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

const AuditorySequentialPage = () => {
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
      router.push("/take-tests")
      return
    }

    try {
      const response = await axios.post(
        "/api/auditory-sequential/submitResult",
        {
          childId: childId,
          score: finalScore.final,
          forwardCorrect: finalScore.forward,
          reverseCorrect: finalScore.reverse,
          test_name: "Auditory Sequential Memory Test",
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
    } finally {
      router.push("/take-tests")
    }
  }

  return (
    <div className="w-screen h-screen">
      <WelcomeDialog t={t} speak={speak} onEntireTestComplete={handleEntireTestFlowComplete} initialChildId={childId} />
    </div>
  )
}

export default AuditorySequentialPage
