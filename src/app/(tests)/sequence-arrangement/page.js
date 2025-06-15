<<<<<<< HEAD
export default function SequenceArrangementTest() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-center">Sequence Arrangement Test</h1>
    </div>
  );
}
=======
// app/(tests)/sequence-arrangement/page.js
"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import WelcomeDialog from "./sequence-arrangement/WelcomeDialog.js";

// --- Direct Implementation of t() and speak() ---
const translations = {
  continue: "Continue",
  letsBegin: "Let's Begin",
  aboutTheGame: "About The Game",
  howToPlay: "How to Play",
  memoryGameDescription:
    "This is a memory game. Watch the sequence of animals, remember their order, and then recreate it.",
  watchSequence: "Watch the sequence of animals.",
  rememberOrder: "Remember the order they appear in.",
  recreateSequence:
    "Recreate the sequence by selecting the animals in the correct order.",
  fiveSecondsToMemorize: "You'll have 5 seconds to memorize each sequence.",
  gameStructure: "Game Structure",
  practiceRound: "Practice Round",
  practiceRoundDescription: "Start with a practice round to get familiar.",
  mainTest: "Main Test",
  mainTestDescription: "The main test consists of 10 sequences.",
  tips: "Tips",
  focusOnOrder: "Focus on the order, not just the animals.",
  lookForPatterns: "Look for patterns in the sequence.",
  takeYourTime: "Take your time when recreating (no timer for selection).",
  removeRearrange: "You can remove and rearrange selected animals.",
  showAnimalsInOrder: "We'll show you some animals in a specific order.",
  readyForTest: "Ready for the Real Test?",
  testDescription:
    "Great job on the practice! Now, let's start the main test. There will be 10 rounds.",
  startTest: "Start Test",
  startPracticeRound: "Start Practice Round",
  backToTests: "Back to Tests",
  progress: "Progress",
  skipTest: "Skip Test",
  round: "Round",
  of: "of",
  memorizeAndRecreate: "Memorize & Recreate!",
  rememberSequence: "Remember this sequence!",
  remove: "Remove",
  availableChoices: "Available Choices",
  tryAgain: "Try Again",
  checkAnswer: "Check Answer",
  greatJob: "Great Job!",
  testResults: "Test Results",
  testCompletedMessage: "You've completed the test! Here's how you did.",
  yourScore: "Your Score:",
  viewRewards: "View Rewards",
  finishTest: "Finish Test",
  rewardsTitle:
    "Yay, you finished the challenge! Here's a little something for your effort!",
  returnToResults: "Return to Results",
  feedback: "Feedback",
  testCompleted: "Test Completed",
  thankYouForPlaying: "Thank you for playing!",
  close: "Close",
};

const t = (key) => translations[key] || key;

const speak = (text) => {
  console.log(`TTS (direct): ${text}`);
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
};

const Test7Page = () => {
  const router = useRouter();
  const [childId, setChildId] = useState(null);

  useEffect(() => {
    const storedChildId = localStorage.getItem("childId");
    if (storedChildId) {
      setChildId(storedChildId);
    }
  }, []);

  const handleEntireTestFlowComplete = async (finalScore) => {
    console.log("Entire test flow completed. Final Score:", finalScore);
    const token = localStorage.getItem("access_token");

    if (!childId) {
      console.warn("Child ID is missing. Cannot save results.");
      if (onTestComplete) onTestComplete(finalScore.correct);
      else router.push("/take-tests");
      return;
    }

    try {
      const response = await axios.post(
        "/api/sequence-test/submitResult",
        {
          childId: childId,
          score: finalScore.correct,
          total_questions: finalScore.total,
          test_name: "Sequence Test 7",
        },
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }), // Conditionally add token
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Test results saved by page.js:", response.data);
    } catch (error) {
      console.error(
        "Error saving test results in page.js:",
        error.response?.data || error.message
      );
    } finally {
      if (onTestComplete) {
        onTestComplete(finalScore.correct);
      } else {
        router.push("/take-tests");
      }
    }
  };

  return (
    <div className="w-screen h-screen">
      <WelcomeDialog
        t={t}
        speak={speak}
        onEntireTestComplete={handleEntireTestFlowComplete}
        initialChildId={childId}
      />
    </div>
  );
};

export default Test7Page;
>>>>>>> 1b60f3fb5aedf9df3eee46c00fcfd9a58105d2c0
