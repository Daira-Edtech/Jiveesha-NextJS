// app/(tests)/sound-blending/page.js

"use client";

import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import WelcomeDialog from "../../../components/sound-blending/WelcomeDialog.js";

// Direct Implementation of t() and speak()
const translations = {
  continue: "Continue",
  next: "Next",
  imReady: "I'm Ready!",
  letsBegin: "Let's Begin!",
  soundBlendingTitle: "Sound Blending Adventure",
  howToPlay: "How to Play",
  listenToSounds: "Listen to the individual sounds carefully",
  blendSoundsTogether: "Blend the sounds together in your mind",
  sayOrTypeWord: "Say or type the word you hear",
  practiceWithManyWords: "Practice with many different words",
  startPracticeRound: "Start Practice Round",
  readyForTest: "Ready for the Real Test?",
  testDescription:
    "Great job on the practice! Now let's test your sound blending skills with 20 words.",
  startTest: "Start Test",
  close: "Close",
  backToTests: "Back to Tests",
  progress: "Progress",
  skipTest: "Skip Test",
  practiceRound: "Practice Round",
  word: "Word",
  progressStart: "Start",
  progressFinish: "Finish",
  practice: "Practice",
  promptListen: "Listen to the sounds",
  promptEnterOrSay: "What word did you hear?",
  promptHeard: "What word did you hear?",
  playSounds: "Play Sounds",
  playingSounds: "Playing Sounds...",
  statusRecording: "Recording...",
  statusTranscribing: "Processing...",
  statusDone: "Done!",
  statusError: "Error",
  statusTyped: "Typed",
  statusIdle: "Ready to listen",
  inputPlaceholder: "Type the word you heard...",
  record: "Record",
  stopRecording: "Stop",
  submit: "Submit",
  skip: "Skip",
  errorPlayingSound: "Error playing sound",
  errorPlayingSounds: "Error playing sounds",
  errorProcessingAudio: "Error processing audio",
  errorRecording: "Error recording",
  errorStartRecording: "Error starting recording",
  errorMicAccess: "Microphone access denied",
  errorNoInputSubmit: "Please enter a word before submitting",
  // New translations for results screen
  testResults: "Test Results",
  soundBlendingCompleted:
    "You've completed the Sound Blending test! Here's how you did.",
  yourScore: "Your Score:",
  accuracy: "Accuracy",
  excellentSoundBlending: "Excellent Sound Blending!",
  veryGoodJob: "Very Good Job!",
  goodEffort: "Good Effort!",
  keepPracticing: "Keep Practicing!",
  finishTest: "Finish Test",
  viewRewards: "View Rewards",
  rewardsTitle: "Congratulations! You've mastered sound blending!",
  rewardEarned: "You've earned the",
  soundMasterShell: "Sound Master Shell",
  returnToResults: "Return to Results",
};

const t = (key) => translations[key] || key;

const SoundBlendingPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [childId, setChildId] = useState(null);

  useEffect(() => {
    const storedChildId = localStorage.getItem("childId");
    if (storedChildId) {
      setChildId(storedChildId);
    }
  }, []);
  //vimalchangesdonehere

  const handleEntireTestFlowComplete = async (finalScore) => {
    const token = localStorage.getItem("access_token");

    if (!childId) {
      console.warn("Child ID is missing. Cannot save results.");
      if (pathname !== "/dummy") {
        router.push("/take-tests?skipStart=true");
      }
      return;
    }

    const isDummyRoute = pathname === "/dummy";
    const apiUrl = isDummyRoute
      ? "/api/continuous-test"
      : "/api/soundBlending-test/submitResult";

    const payload = isDummyRoute
      ? {
          childId,
          totalScore: parseFloat(finalScore?.correct || 0),
          testResults: JSON.stringify(finalScore),
          analysis: "Sound Blending Test",
        }
      : {
          childId: childId,
          score: finalScore.correct,
          total_questions: finalScore.total,
          test_name: "Sound Blending Test",
          responses: finalScore.responses || {},
        };

    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      });

      console.log("Test results saved by page.js:", response.data);
    } catch (error) {
      console.error(
        "Error saving test results in page.js:",
        error.response?.data || error.message
      );
    } finally {
      if (!isDummyRoute) {
        router.push("/take-tests?skipStart=true");
      }
    }
  };

  return (
    <div className="w-screen h-screen">
      <WelcomeDialog
        t={t}
        onEntireTestComplete={handleEntireTestFlowComplete}
        initialChildId={childId}
      />
    </div>
  );
};

export default SoundBlendingPage;
