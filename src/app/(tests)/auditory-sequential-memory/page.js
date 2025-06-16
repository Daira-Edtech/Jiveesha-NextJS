"use client"; // This component uses client-side hooks like useState, useEffect, and browser APIs.

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"; // Next.js's useRouter for navigation
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import translation data directly from the same directory
import test13Translations from "./test13Translations.json";

// Import the new sub-components
// Assuming these paths are correct relative to the component itself,
// based on the previous folder structure provided by the user:
// src/app/(tests)/auditory-sequential-memory/page.js
// src/components/auditory-sequential-memory/...
import InstructionsScreen from "../../../components/auditory-sequential-memory/InstructionsScreen";
import PresentingScreen from "../../../components/auditory-sequential-memory/PresentingScreen";
import ListeningEvaluatingScreen from "../../../components/auditory-sequential-memory/ListeningEvaluatingScreen";
import ResultsScreen from "../../../components/auditory-sequential-memory/ResultsScreen";

// Define backend URL for external transcription service (if separate from Next.js API Routes)
// If your transcription also uses Next.js API Routes, you might change this or use relative paths.
const externalTranscriptionBackendURL = "http://localhost:8000"; // Placeholder URL for external transcription service

// Game constants
const DIGIT_DISPLAY_TIME = 1000;
const PAUSE_BETWEEN_DIGITS = 200;
const MAX_ERRORS = 2;

// --- Main Page Component ---
// Removed suppressResultPage and onComplete from props for top-level page component
export default function AuditorySequentialMemoryTest() {
  const router = useRouter(); // Initialize useRouter for navigation

  // Mock `useLanguage` and `t` function for this example.
  // In a real application, you would integrate your actual LanguageContext or i18n solution.
  const [language, setLanguage] = useState("en"); // Default language for demonstration
  const t = useCallback((key) => {
    const langData = test13Translations[language] || test13Translations.en;
    return langData.translations[key] || key;
  }, [language]);

  // Load sequences based on selected language
  const STARTING_FORWARD_SEQUENCES = (test13Translations[language] || test13Translations.en).questions.forward;
  const STARTING_REVERSE_SEQUENCES = (test13Translations[language] || test13Translations.en).questions.reverse;

  // --- State Management ---
  const [gameState, setGameState] = useState("instructions"); // instructions, presenting, listening, evaluating, finished
  const [mode, setMode] = useState("forward"); // forward, reverse
  const [sequences, setSequences] = useState(STARTING_FORWARD_SEQUENCES);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [currentSequence, setCurrentSequence] = useState([]);
  const [displayedDigit, setDisplayedDigit] = useState(null); // The digit currently shown
  const [digitIndex, setDigitIndex] = useState(0); // Added: Index for presenting digits, used as a key for re-animation

  const [forwardScore, setForwardScore] = useState(0);
  const [reverseScore, setReverseScore] = useState(0);
  const [forwardErrors, setForwardErrors] = useState(0);
  const [reverseErrors, setReverseErrors] = useState(0);

  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null); // 'correct', 'incorrect', null

  // State for localStorage items, initialized to null
  const [childId, setChildId] = useState(null);
  const [token, setToken] = useState(null);


  // --- Refs for managing side effects and mutable values ---
  const mediaRecorderRef = useRef(null);
  const timeoutRef = useRef(null);
  // presentNextDigitLogicRef is no longer needed with the refined stablePresentNextDigit
  const isRecordingRef = useRef(isRecording); // Ref to hold the current value of isRecording for use in callbacks

  // --- Effects for Lifecycle and State Synchronization ---

  // Sync isRecording state with its ref for use in callbacks
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Load childId and token from localStorage ONLY on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure localStorage is available
      setChildId(localStorage.getItem("childId"));
      setToken(localStorage.getItem("access_token"));
    }
  }, []); // Empty dependency array means this runs once on client mount

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      stopListening(); // Calling stopListening on cleanup
    };
  }, []); // Removed stopListening from dependency array for stability, its identity is stable via useCallback

  // --- Helper Functions ---

  /**
   * Converts numbers and number words in a transcript to an array of digits.
   * @param {string} transcript - The raw text transcript from speech-to-text.
   * @returns {number[]} An array of numbers parsed from the transcript.
   */
  const parseTranscript = useCallback((transcript) => {
    if (!transcript) return [];

    const digitMap = (test13Translations[language] || test13Translations.en).digitMap;

    // Normalize: lowercase, remove punctuation, replace number words with digits
    let cleaned = transcript.toLowerCase().replace(/[.,!?]/g, "");
    Object.entries(digitMap).forEach(([word, digit]) => {
      cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, "g"), digit);
    });

    // Attempt to split by space and validate if all are single digits
    const spaceSplit = cleaned.trim().split(/\s+/);
    if (spaceSplit.every((item) => /^\d$/.test(item))) {
      return spaceSplit.map(Number);
    }

    // Attempt to treat as concatenated digits if space split fails or contains non-digits
    const concatenated = cleaned.replace(/\s+/g, "");
    if (/^\d+$/.test(concatenated)) {
      return concatenated.split("").map(Number);
    }

    console.warn("Could not reliably parse transcript:", transcript);
    toast.warn(t("could_not_understand_numbers"));
    return []; // Return empty if parsing fails
  }, [language, t]);

  /**
   * Speaks a given text using the Web Speech API.
   * @param {string} text - The text to speak.
   * @param {number} [rate=0.9] - Speech rate.
   * @param {number} [pitch=1.1] - Speech pitch.
   */
  const speakText = useCallback((text, rate = 0.9, pitch = 1.1) => {
    if (typeof window !== 'undefined' && "speechSynthesis" in window) { // Ensure window and speechSynthesis exist
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = rate;
      speech.pitch = pitch;

      // Set language for speech synthesis
      if (language === "ta") {
        speech.lang = "ta-IN"; // Tamil
      } else if (language === "hi") {
        speech.lang = "hi-IN"; // Hindi
      } else {
        speech.lang = "en-US"; // Default to English
      }

      speech.onend = () => {
        // console.log("Speech finished");
      };

      window.speechSynthesis.speak(speech);
    } else {
      console.warn("Speech synthesis not supported or window is undefined.");
    }
  }, [language]);

  /**
   * Uploads the recorded audio blob to the backend for transcription.
   * @param {Blob} audioBlob - The audio data to upload.
   */
  const uploadAudio = useCallback(async (audioBlob) => {
    if (!childId) { // Check if childId is loaded
      console.error("childId is not available for transcription upload.");
      toast.error("Student ID not loaded. Cannot upload audio.");
      setIsTranscribing(false);
      return;
    }

    const formData = new FormData();
    const file = new File([audioBlob], "user_digit_span.wav", { type: "audio/wav" });
    formData.append("file", file);
    formData.append("language", language); // Pass the current language to the backend

    setIsTranscribing(true);
    setEvaluationResult(null); // Clear previous evaluation result

    try {
      // Use the externalTranscriptionBackendURL for transcription, if applicable
      const response = await fetch(`${externalTranscriptionBackendURL}/transcribe`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Transcription API Response:", result);

      if (response.ok) {
        setTranscript(result.transcription || ""); // Set transcribed text
        setGameState("evaluating"); // Move to evaluation state
      } else {
        console.error("Transcription error response:", result);
        toast.error(t("transcription_failed"));
        setGameState("listening"); // Stay in listening if transcription fails
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      toast.error(t("audio_upload_error"));
      setGameState("listening"); // Stay in listening if upload fails
    } finally {
      setIsTranscribing(false); // Stop transcribing indicator
    }
  }, [language, t, childId]); // Add childId to dependencies

  /**
   * Stops audio recording and cleans up the MediaRecorder and stream.
   */
  const stopListening = useCallback(() => {
    // console.log("Attempting to stop listening...");

    // Stop the media recorder if it's active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      try {
        mediaRecorderRef.current.stop();
        // console.log("MediaRecorder.stop() called.");
      } catch (e) {
        console.error("Error stopping MediaRecorder:", e);
      }
    }

    // Stop all tracks on the stream
    // Ensure window.stream is accessed safely.
    if (typeof window !== 'undefined' && window.stream) {
      try {
        window.stream.getTracks().forEach((track) => track.stop());
        // console.log("Audio tracks stopped.");
      } catch (e) {
        console.error("Error stopping stream tracks:", e);
      }
      window.stream = null; // Clear global stream reference
    }

    mediaRecorderRef.current = null; // Clear recorder reference
    if (isRecordingRef.current) {
      setIsRecording(false); // Update recording state
    }
  }, [isRecordingRef]); // isRecordingRef is a stable ref, so its identity doesn't change

  /**
   * Starts audio recording from the user's microphone.
   */
  const startListening = useCallback(() => {
    // Prevent multiple recordings
    if (isRecordingRef.current) {
      // console.log("Already recording (ref check), returning.");
      return;
    }

    setTranscript(""); // Clear previous transcript
    setEvaluationResult(null); // Clear previous evaluation result

    // Ensure navigator.mediaDevices is available (client-side)
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
        console.error("getUserMedia not supported in this browser or environment.");
        toast.error(t("microphone_access_error"));
        return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        window.stream = stream; // Store stream globally for easier access/cleanup
        let localAudioChunks = [];

        // Add listener for stream track ending unexpectedly (e.g., user revokes mic permission)
        if (stream.getAudioTracks().length > 0) {
          stream.getAudioTracks()[0].onended = () => {
            console.warn("Audio track ended unexpectedly!");
            stopListening(); // Clean up if track ends
          };
        }

        const newMediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = newMediaRecorder;

        newMediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            localAudioChunks.push(event.data);
          }
        };

        newMediaRecorder.onstop = async () => {
          if (localAudioChunks.length > 0) {
            const audioBlob = new Blob(localAudioChunks, { type: "audio/wav" });
            localAudioChunks = []; // Clear chunks after creating blob
            await uploadAudio(audioBlob); // Upload recorded audio
          } else {
            console.log("No audio chunks recorded in onstop.");
          }
        };

        newMediaRecorder.onerror = (event) => {
          console.error("MediaRecorder error event:", event.error, "State:", newMediaRecorder.state);
          toast.error(t("recording_error"));
          stopListening(); // Clean up on error
        };

        try {
          newMediaRecorder.start(); // Start recording
          setIsRecording(true); // Update recording state
        } catch (e) {
          console.error("Error calling MediaRecorder.start():", e);
          toast.error(t("microphone_start_error"));
          stopListening(); // Clean up if start fails
        }
      })
      .catch((error) => {
        console.error("Error accessing microphone (getUserMedia):", error);
        toast.error(t("microphone_access_error"));
        stopListening(); // Clean up if mic access fails
      });
  }, [uploadAudio, stopListening, isRecordingRef, t]);

  /**
   * Memoized callback to present the next digit in the sequence recursively.
   * This function is now self-referential via its own useCallback closure.
   */
  const stablePresentNextDigit = useCallback((sequence, index) => {
    // If all digits have been presented, transition to listening state
    if (index >= sequence.length) {
      setDisplayedDigit(null);
      timeoutRef.current = setTimeout(() => {
        setGameState("listening");
      }, 500); // Short pause before enabling microphone
      return;
    }

    const digit = sequence[index];
    setDisplayedDigit(digit); // Display the current digit
    setDigitIndex(index); // Update digitIndex to force re-animation even if the same digit value appears
    speakText(String(digit), 1, 1.2); // Speak the digit

    // Schedule clearing the digit after DIGIT_DISPLAY_TIME
    timeoutRef.current = setTimeout(() => {
      setDisplayedDigit(null); // Hide the digit
      // Schedule presenting the next digit after PAUSE_BETWEEN_DIGITS
      timeoutRef.current = setTimeout(() => {
        // Crucial: Recursively call stablePresentNextDigit itself for the next digit.
        // React's useCallback ensures the latest memoized version is used.
        stablePresentNextDigit(sequence, index + 1);
      }, PAUSE_BETWEEN_DIGITS);
    }, DIGIT_DISPLAY_TIME);
  }, [setDisplayedDigit, setDigitIndex, setGameState, speakText]); // All dependencies must be listed here.

  // --- Game Logic Transitions ---

  /**
   * Transitions the game to the next mode (Forward -> Reverse, or Reverse -> Finished).
   */
  const moveToNextMode = useCallback(() => {
    stopListening();
    setEvaluationResult(null);
    setTranscript("");

    if (mode === "forward") {
      // Transition to reverse mode if not too many reverse errors yet
      if (reverseErrors >= MAX_ERRORS) {
        setGameState("finished"); // If user already failed reverse, finish
      } else {
        setMode("reverse");
        setSequences(STARTING_REVERSE_SEQUENCES);
        setSequenceIndex(0); // Reset sequence index for the new mode
        setGameState("instructions_reverse"); // Show reverse instructions first
      }
    } else {
      setGameState("finished"); // All modes complete
    }
  }, [mode, reverseErrors, stopListening, STARTING_REVERSE_SEQUENCES]);

  /**
   * Transitions the game to the next sequence within the current mode.
   */
  const moveToNextSequence = useCallback(() => {
    stopListening();
    setEvaluationResult(null);
    setTranscript("");

    if (sequenceIndex + 1 < sequences.length) {
      setSequenceIndex((prev) => prev + 1);
      setGameState("presenting"); // Go to presenting the next sequence
    } else {
      moveToNextMode(); // No more sequences in this mode, move to next mode
    }
  }, [sequenceIndex, sequences.length, moveToNextMode, stopListening]);

  /**
   * Evaluates the user's transcribed answer against the correct sequence.
   */
  const evaluateAnswer = useCallback(() => {
    const userAnswer = parseTranscript(transcript);
    // Determine the correct answer based on the current mode
    const correctAnswer =
      mode === "forward" ? currentSequence : [...currentSequence].reverse();

    // If parsing failed or no numbers were found
    if (userAnswer.length === 0) {
      toast.warning(t("could_not_understand_numbers_clearly"));
      setTranscript(""); // Clear transcript for next attempt
      setGameState("listening"); // Stay in listening or re-present? Decided to re-listen for new input
      return;
    }

    // Check if the user's answer matches the correct answer
    const isCorrect =
      userAnswer.length === correctAnswer.length &&
      userAnswer.every((digit, i) => digit === correctAnswer[i]);

    setEvaluationResult(isCorrect ? "correct" : "incorrect");
    speakText(isCorrect ? t("correct") : t("not_quite_try_next"));

    if (isCorrect) {
      // Increment score for the current mode
      if (mode === "forward") setForwardScore((prev) => prev + 1);
      else setReverseScore((prev) => prev + 1);
      moveToNextSequence(); // Move to the next sequence
    } else {
      // Increment errors for the current mode
      if (mode === "forward") setForwardErrors((prev) => prev + 1);
      else setReverseErrors((prev) => prev + 1);

      // Check if max errors reached for the current mode
      if (
        (mode === "forward" && forwardErrors + 1 >= MAX_ERRORS) ||
        (mode === "reverse" && reverseErrors + 1 >= MAX_ERRORS)
      ) {
        moveToNextMode(); // If max errors, move to next mode or finish
      } else {
        moveToNextSequence(); // Else, try the next sequence in the current mode
      }
    }
  }, [
    transcript,
    mode,
    currentSequence,
    forwardErrors,
    reverseErrors,
    moveToNextSequence,
    moveToNextMode,
    parseTranscript,
    speakText,
    t,
  ]);

  // --- Effects for Game Flow Control ---

  // Effect to trigger sequence presentation when gameState is "presenting"
  useEffect(() => {
    if (gameState === "presenting" && sequenceIndex < sequences.length) {
      setCurrentSequence(sequences[sequenceIndex]); // Set the current sequence to be presented
      // Reset for new presentation
      setDisplayedDigit(null);
      setDigitIndex(0); // Reset digitIndex for a new sequence
      setTranscript("");
      setEvaluationResult(null);

      // Start presentation after a short delay
      timeoutRef.current = setTimeout(
        () => stablePresentNextDigit(sequences[sequenceIndex], 0),
        500
      );
    }
    // Cleanup timeout on component unmount or if gameState changes
    return () => clearTimeout(timeoutRef.current);
  }, [gameState, sequenceIndex, sequences, stablePresentNextDigit]); // stablePresentNextDigit is now correctly a dependency

  // Effect to auto-start recording when moving to "listening" state
  useEffect(() => {
    if (gameState === "listening") {
      // Announce "Your turn" or "Say numbers backwards"
      speakText(
        mode === "forward"
          ? t("your_turn_say_numbers")
          : t("your_turn_say_numbers_backwards")
      );

      // Schedule microphone activation after a short delay
      const startTimeout = setTimeout(() => {
        if (!isRecordingRef.current) { // Only start if not already recording
          startListening();
        }
      }, 1500); // Delay to allow speech to finish

      // Cleanup timeout on component unmount or if gameState changes
      return () => clearTimeout(startTimeout);
    }
  }, [gameState, startListening, mode, speakText, t]);

  // Effect to trigger evaluation when gameState is "evaluating" and transcript is available
  useEffect(() => {
    if (gameState === "evaluating" && transcript) {
      evaluateAnswer();
    }
  }, [evaluateAnswer, gameState, transcript]);


  // --- Event Handlers for UI actions ---

  /**
   * Initializes the test for a specific mode (forward or reverse).
   * @param {'forward' | 'reverse'} selectedMode - The mode to start.
   */
  const startTest = useCallback(
    (selectedMode) => {
      setMode(selectedMode);
      setSequences(
        selectedMode === "forward"
          ? STARTING_FORWARD_SEQUENCES
          : STARTING_REVERSE_SEQUENCES
      );
      setSequenceIndex(0);
      setTranscript("");
      setEvaluationResult(null);
      setGameState("presenting"); // Start presenting the first sequence
    },
    [STARTING_FORWARD_SEQUENCES, STARTING_REVERSE_SEQUENCES]
  );

  const handleStartForward = useCallback(() => {
    speakText(t("start_forward_instructions"));
    setForwardScore(0); // Reset scores for a new full test
    setForwardErrors(0);
    setReverseScore(0);
    setReverseErrors(0);
    startTest("forward");
  }, [startTest, speakText, t]);

  const handleStartReverse = useCallback(() => {
    speakText(t("start_reverse_instructions"));
    startTest("reverse");
  }, [startTest, speakText, t]);

  /**
   * Submits the test results to the backend API.
   */
  const submitResults = useCallback(async () => {
    if (!childId) { // Use the state variable
      toast.error(t("no_student_selected"));
      return;
    }
    if (!token) { // Use the state variable
        toast.error(t("authentication_error"));
        return;
    }

    const finalScore = Math.round((forwardScore + reverseScore) / 2);

    try {
      // Updated URL to target the Next.js API route as per your structure
      const apiRouteUrl = "/api/auditory-sequential-memory-test/submitResult"; // Corrected API route path based on your structure
      const response = await axios.post(
        apiRouteUrl,
        {
          childId: childId,
          score: finalScore,
          forwardCorrect: forwardScore,
          reverseCorrect: reverseScore,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success(t("test_submitted_success", { score: finalScore }), {
          position: "top-center",
          autoClose: 5000,
          onClose: () => router.push("/"), // Use Next.js router for navigation
        });
      } else {
        toast.error(t("submit_results_failed"));
      }
    } catch (error) {
      console.error("Error submitting test results:", error);
      toast.error(t("submit_error_check_connection"));
    }
  }, [forwardScore, reverseScore, router, t, childId, token]); // Added childId and token to dependencies

  // --- UI Rendering based on gameState ---
  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-6 md:p-10 font-inter"> {/* Added font-inter */}
      <div className="max-w-6xl mx-auto w-full">
        {/* ToastContainer for notifications */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        {/* Display game progress (mode, sequence, errors) for relevant states */}
        {(gameState === "presenting" ||
          gameState === "listening" ||
          gameState === "evaluating") && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-3xl mx-auto"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <span className="text-lg font-medium text-gray-600">
                    {t("mode")}:{" "}
                    <span className="font-bold capitalize text-blue-600">
                      {mode}
                    </span>
                  </span>
                  <span className="text-lg font-medium text-gray-600">
                    {t("sequence")}:{" "}
                    <span className="font-bold text-blue-600">
                      {sequenceIndex + 1}
                    </span>{" "}
                    / <span className="text-gray-600">{sequences.length}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium text-gray-600">
                    {t("errors")}:
                  </span>
                  <div className="flex gap-2">
                    {[...Array(MAX_ERRORS)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-4 w-4 rounded-full transition-colors duration-300 ${
                          i < (mode === "forward" ? forwardErrors : reverseErrors)
                            ? "bg-red-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        {/* Conditional rendering of game screens based on gameState */}
        <AnimatePresence mode="wait">
          {gameState === "instructions" && (
            <motion.div key="instructions" exit={{ opacity: 0 }}>
              <InstructionsScreen
                mode="forward"
                onStartForward={handleStartForward}
                t={t}
              />
            </motion.div>
          )}
          {gameState === "instructions_reverse" && (
            <motion.div key="instructions_reverse" exit={{ opacity: 0 }}>
              <InstructionsScreen
                mode="reverse"
                onStartReverse={handleStartReverse}
                t={t}
              />
            </motion.div>
          )}
          {gameState === "presenting" && (
            <motion.div
              key="presenting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-10"
            >
              <PresentingScreen displayedDigit={displayedDigit} digitIndex={digitIndex} t={t} />
            </motion.div>
          )}
          {(gameState === "listening" || gameState === "evaluating") && (
            <motion.div
              key="listening-evaluating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ListeningEvaluatingScreen
                mode={mode}
                isRecording={isRecording}
                isTranscribing={isTranscribing}
                transcript={transcript}
                evaluationResult={evaluationResult}
                stopListening={stopListening}
                t={t}
                MAX_ERRORS={MAX_ERRORS}
                forwardErrors={forwardErrors}
                reverseErrors={reverseErrors}
              />
            </motion.div>
          )}
          {gameState === "finished" && (
            <motion.div
              key="finished"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ResultsScreen
                forwardScore={forwardScore}
                reverseScore={reverseScore}
                STARTING_FORWARD_SEQUENCES={STARTING_FORWARD_SEQUENCES}
                STARTING_REVERSE_SEQUENCES={STARTING_REVERSE_SEQUENCES}
                onSubmitResults={submitResults}
                t={t}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
