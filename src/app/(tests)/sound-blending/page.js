"use client"; // This component uses client-side hooks like useState, useEffect, and browser APIs.

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
// The backendURL import is now less critical for internal API Routes.
// If backendURL is ONLY for external services, you might keep it.
// For internal Next.js API routes, we will use direct relative paths.
// import { backendURL } from "../../../definedURL"; // This import might be removed if only using internal API routes
import { AnimatePresence } from "framer-motion";

// Import the new sub-components
import ProgressBar from "../../../components/sound-blending/ProgressBar";
import ResultCard from "../../../components/sound-blending/ResultCard";
import Button from "../../../components/sound-blending/Button";
import LoadingOverlay from "../../../components/sound-blending/LoadingOverlay";
import GameDisplay from "../../../components/sound-blending/GameDisplay";
import ResultsDisplay from "../../../components/sound-blending/ResultsDisplay";

// --- Game Data (WORDS array remains here as it's core game data) ---
const WORDS = [
  {
    id: 1,
    sounds: ["/sounds/c.mp3", "/sounds/a.mp3", "/sounds/t.mp3"],
    word: "cat",
  },
  {
    id: 2,
    sounds: ["/sounds/f.mp3", "/sounds/a.mp3", "/sounds/t.mp3"],
    word: "fat",
  },
  {
    id: 3,
    sounds: ["/sounds/l.mp3", "/sounds/e.mp3", "/sounds/t.mp3"],
    word: "let",
  },
  {
    id: 4,
    sounds: ["/sounds/l.mp3", "/sounds/i.mp3", "/sounds/p.mp3"],
    word: "lip",
  },
  {
    id: 5,
    sounds: ["/sounds/p.mp3", "/sounds/o.mp3", "/sounds/t.mp3"],
    word: "pot",
  },
  {
    id: 6,
    sounds: [
      "/sounds/b.mp3",
      "/sounds/o.mp3",
      "/sounds/a.mp3",
      "/sounds/t.mp3",
    ],
    word: "boat",
  },
  {
    id: 7,
    sounds: ["/sounds/p.mp3", "/sounds/e.mp3", "/sounds/g.mp3"],
    word: "peg",
  },
  {
    id: 8,
    sounds: ["/sounds/b.mp3", "/sounds/e.mp3", "/sounds/g.mp3"],
    word: "beg",
  },
  {
    id: 9,
    sounds: ["/sounds/sh.mp3", "/sounds/o.mp3", "/sounds/p.mp3"],
    word: "shop",
  },
  {
    id: 10,
    sounds: ["/sounds/f.mp3", "/sounds/ee.mp3", "/sounds/t.mp3"],
    word: "feet",
  },
  {
    id: 11,
    sounds: [
      "/sounds/d.mp3",
      "/sounds/i.mp3",
      "/sounds/n.mp3",
      "/sounds/er.mp3",
    ],
    word: "dinner",
  },
  {
    id: 12,
    sounds: [
      "/sounds/w.mp3",
      "/sounds/e.mp3",
      "/sounds/th.mp3",
      "/sounds/er.mp3",
    ],
    word: "weather",
  },
  {
    id: 13,
    sounds: [
      "/sounds/l.mp3",
      "/sounds/i.mp3",
      "/sounds/t.mp3",
      "/sounds/l.mp3",
    ],
    word: "little",
  },
  {
    id: 14,
    sounds: [
      "/sounds/d.mp3",
      "/sounds/e.mp3",
      "/sounds/l.mp3",
      "/sounds/i.mp3",
      "/sounds/k.mp3",
      "/sounds/t.mp3",
    ],
    word: "delicate",
  },
  {
    id: 15,
    sounds: ["/sounds/t.mp3", "/sounds/a.mp3", "/sounds/p.mp3"],
    word: "tap",
  },
  {
    id: 16,
    sounds: ["/sounds/d.mp3", "/sounds/u.mp3", "/sounds/p.mp3"],
    word: "dup",
  },
  {
    id: 17,
    sounds: ["/sounds/p.mp3", "/sounds/o.mp3", "/sounds/g.mp3"],
    word: "pog",
  },
  {
    id: 18,
    sounds: [
      "/sounds/g.mp3",
      "/sounds/l.mp3",
      "/sounds/e.mp3",
      "/sounds/b.mp3",
    ],
    word: "gleb",
  },
  {
    id: 19,
    sounds: [
      "/sounds/g.mp3",
      "/sounds/a.mp3",
      "/sounds/p.mp3",
      "/sounds/o.mp3",
    ],
    word: "gapo",
    alternatives: ["gapo", "gappo", "gahpo"],
  },
  {
    id: 20,
    sounds: [
      "/sounds/t.mp3",
      "/sounds/i.mp3",
      "/sounds/s.mp3",
      "/sounds/e.mp3",
      "/sounds/k.mp3",
    ],
    word: "tisek",
    alternatives: ["tisek", "teesek", "tissek", "teeseck"],
  },
];

// Removed onComplete, suppressResultPage, and student from props for top-level page component
export default function PhonemeBlendingPage() {
  // --- State Management ---
  const [gameState, setGameState] = useState("playing"); // 'playing' or 'results'
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [showResponseArea, setShowResponseArea] = useState(false);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [showFinalSubmitButton, setShowFinalSubmitButton] = useState(false);
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentTranscriptionStatus, setCurrentTranscriptionStatus] =
    useState("idle"); // 'idle', 'recording', 'pending', 'done', 'error', 'typed'

  // State for localStorage items, initialized to null
  const [childId, setChildId] = useState(null);
  const [token, setToken] = useState(null);

  // --- Refs for managing mutable values across renders and DOM elements ---
  const audioRef = useRef(null);
  const inputRef = useRef(null); // Ref for the text input field
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const isRecordingRef = useRef(isRecording); // To get the latest isRecording state inside callbacks

  // Define backendURL locally or remove if transcription is also handled by Next.js API routes.
  // For now, keeping it here for transcription example, but using relative path for submitResults.
  const backendURL = "http://localhost:8000"; // Assuming this is where your transcription backend runs, if separate.


  // --- Effects for Lifecycle and State Synchronization ---

  // Sync isRecording state with its ref for use in callbacks
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Load childId and token from localStorage ONLY on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure localStorage is available
      // student prop is no longer available here, rely only on localStorage
      setChildId(localStorage.getItem("childId"));
      setToken(localStorage.getItem("access_token"));
    }
  }, []); // Empty dependency array means this runs once on client mount

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause(); // Pause any playing audio
      stopListening(); // Stop any active recording
    };
  }, []);

  // Focus on input field when response area is shown and not recording/transcribing
  useEffect(() => {
    if (
      showResponseArea &&
      !isRecording &&
      !isTranscribing &&
      inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [showResponseArea, isRecording, isTranscribing]);

  // Reset state when moving to a new word
  useEffect(() => {
    console.log(`Word changed to index: ${currentWordIndex}. Resetting state.`);
    setUserInput("");
    setCurrentTranscriptionStatus("idle");
    setError(null);
    setIsRecording(false); // Ensure recording is off
    setIsTranscribing(false); // Ensure transcribing is off
    stopListening(); // Explicitly stop any lingering recording for the previous word
  }, [currentWordIndex]);


  // --- Helper Functions and Callbacks ---

  /**
   * Plays a single audio sound.
   * @param {string} src - The URL of the audio file.
   * @returns {Promise<void>} A promise that resolves when the audio finishes playing.
   */
  const playSound = (src) => {
    return new Promise((resolve) => {
      if (!src) {
        console.warn("Empty sound source provided, skipping.");
        resolve();
        return;
      }
      if (audioRef.current) {
        audioRef.current.pause(); // Stop any previously playing sound
      }
      const audio = new Audio(src);
      audioRef.current = audio; // Keep reference to the current audio object
      audio
        .play()
        .then(() => {
          audio.onended = resolve; // Resolve promise when audio ends
        })
        .catch((e) => {
          console.error("Audio playback failed:", src, e);
          setError(
            `Failed to play sound. Please try again or check permissions.`
          );
          resolve(); // Resolve even on error to allow game to continue
        });
    });
  };

  /**
   * Plays all sounds for the current word in sequence.
   */
  const playCurrentWordSounds = async () => {
    if (isPlayingSound) return; // Prevent multiple plays
    try {
      setIsPlayingSound(true);
      setError(null);
      setShowResponseArea(false); // Hide response area while playing
      const currentWord = WORDS[currentWordIndex];
      console.log(`Playing sounds for word: ${currentWord.word}`);

      for (const sound of currentWord.sounds) {
        await playSound(sound);
        // Add a small pause between phonemes for better auditory distinction
        if (sound) { // Only pause if a valid sound was actually played
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      console.log("Finished playing sounds.");
      setIsPlayingSound(false);
      setShowResponseArea(true); // Show response area after sounds finish
    } catch (err) {
      console.error("Error in playCurrentWordSounds:", err);
      setError("An error occurred while playing sounds.");
      setIsPlayingSound(false);
      setShowResponseArea(true);
    }
  };

  /**
   * Uploads the recorded audio blob to the backend for transcription.
   * Memoized using useCallback.
   * @param {Blob} audioBlob - The audio data to upload.
   */
  const uploadAudio = useCallback(
    async (audioBlob) => {
      // Ensure childId is available before proceeding
      if (!childId) {
        console.error("childId is not available for transcription upload.");
        setError("Student ID not loaded. Cannot upload audio.");
        setCurrentTranscriptionStatus("error");
        setIsTranscribing(false);
        return;
      }

      if (!audioBlob || audioBlob.size === 0) {
        console.log("No audio data to upload.");
        setCurrentTranscriptionStatus("error");
        setIsTranscribing(false);
        return;
      }

      const formData = new FormData();
      const filename = `phoneme_game_child_${childId}_word_${currentWordIndex}_${Date.now()}.wav`;
      const file = new File([audioBlob], filename, { type: "audio/wav" });
      formData.append("file", file);

      console.log(`Uploading audio for word index: ${currentWordIndex}`);
      setCurrentTranscriptionStatus("pending"); // Indicate transcription is in progress
      setIsTranscribing(true); // Set transcribing flag

      try {
        const response = await fetch(`${backendURL}/transcribe`, { // Using backendURL for transcription
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        console.log(
          `Transcription API Response for index ${currentWordIndex}:`,
          result
        );

        if (response.ok && result.transcription != null) {
          const transcribedText = result.transcription.trim().toLowerCase();

          // Only update userInput if it's currently empty (i.e., user hasn't typed yet)
          setUserInput((prevInput) => {
            if (prevInput.trim() === "") {
              console.log(
                `Transcription received: "${transcribedText}", updating input.`
              );
              return transcribedText;
            } else {
              console.log(
                `Transcription received: "${transcribedText}", but input already has value: "${prevInput}". Keeping typed value.`
              );
              return prevInput; // Keep existing typed value if present
            }
          });
          setCurrentTranscriptionStatus(transcribedText ? "done" : "error");
          if (!transcribedText) {
            setError("Transcription returned empty. Please type or try again.");
          }
        } else {
          console.error(
            `Transcription failed for index ${currentWordIndex}:`,
            result
          );
          setError(
            `Transcription failed. Please type your answer or try recording again.`
          );
          setCurrentTranscriptionStatus("error");
        }
      } catch (fetchError) {
        console.error(
          `Error uploading/transcribing audio for index ${currentWordIndex}:`,
          fetchError
        );
        setError("Error processing audio. Please type your answer.");
        setCurrentTranscriptionStatus("error");
      } finally {
        setIsTranscribing(false); // Reset transcribing flag
      }
    },
    [childId, currentWordIndex, backendURL]
  );

  /**
   * Stops audio recording and cleans up the MediaRecorder and associated streams.
   * Memoized using useCallback.
   */
  const stopListening = useCallback(() => {
    const wasRecording = isRecordingRef.current; // Use ref to get latest state

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop(); // Stop the recorder
    } else {
      audioChunksRef.current = []; // Clear chunks if recorder wasn't active
    }

    // Stop all tracks on the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null; // Clear stream reference
    }

    mediaRecorderRef.current = null; // Clear recorder reference

    if (wasRecording) {
      setIsRecording(false); // Update recording state only if it was recording

      // Set status based on previous state, but not if already pending transcription
      setCurrentTranscriptionStatus((prev) => {
        if (prev === "pending") return "pending"; // Keep pending if transcription started
        return "idle"; // Otherwise, go back to idle
      });
    }
  }, [isRecordingRef]);

  /**
   * Starts audio recording from the user's microphone.
   * Memoized using useCallback.
   */
  const startListening = useCallback(() => {
    if (isRecordingRef.current) {
      console.log("Start listening called, but already recording.");
      return;
    }
    setError(null); // Clear previous errors
    setUserInput(""); // Clear any typed input when starting to record
    setCurrentTranscriptionStatus("recording"); // Set status to recording
    setIsRecording(true); // Update recording state

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream; // Store stream reference
        audioChunksRef.current = []; // Reset audio chunks

        // Add an onended listener to the audio track to handle unexpected stops
        if (stream.getAudioTracks().length > 0) {
          stream.getAudioTracks()[0].onended = () => {
            console.warn("Audio track ended unexpectedly!");
            stopListening(); // Clean up if track stops
          };
        }

        try {
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder; // Store recorder reference

          recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };
          recorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/wav",
            });
            uploadAudio(audioBlob); // Upload the recorded audio
            audioChunksRef.current = []; // Clear chunks after processing
          };
          recorder.onerror = (event) => {
            console.error("MediaRecorder error:", event.error);
            setError("Recording error. Please type or try again.");
            setCurrentTranscriptionStatus("error");
            stopListening(); // Clean up on error
          };

          recorder.start(); // Start the media recorder
        } catch (recorderError) {
          console.error("Error creating/starting MediaRecorder:", recorderError);
          setError("Could not start recording. Check permissions/refresh.");
          setCurrentTranscriptionStatus("error");
          stopListening(); // Ensure cleanup
          setIsRecording(false); // Reset recording state
        }
      })
      .catch((getUserMediaError) => {
        console.error("getUserMedia error:", getUserMediaError);
        setError("Could not access microphone. Check permissions.");
        setCurrentTranscriptionStatus("error");
        setIsRecording(false); // Reset recording state
      });
  }, [stopListening, uploadAudio]);

  /**
   * Handles changes in the text input field.
   * If the user types while recording, it stops the recording.
   * @param {Event} e - The change event from the input field.
   */
  const handleInputChange = (e) => {
    const typedValue = e.target.value;
    setUserInput(typedValue);

    // If user starts typing while recording, stop the recording
    if (isRecordingRef.current) {
      console.log("User typed while recording, stopping recording.");
      stopListening();
    }

    // Update transcription status based on input.
    // Don't override 'recording' or 'pending' if they're active.
    setCurrentTranscriptionStatus((prev) => {
      if (prev !== "recording" && prev !== "pending") {
        return typedValue ? "typed" : "idle";
      }
      return prev;
    });
  };

  /**
   * Processes the user's response for the current word and moves to the next word or end screen.
   * @param {string} responseValue - The user's input (typed or transcribed).
   * @param {boolean} isSkipped - True if the word was skipped, false otherwise.
   */
  const processAndMoveNext = (responseValue, isSkipped = false) => {
    stopListening(); // Ensure recording is stopped

    const currentWordData = WORDS[currentWordIndex];
    const finalResponse = isSkipped
      ? "[skipped]"
      : responseValue.toLowerCase().trim();

    // Determine if the response is correct, considering alternatives
    const isCorrect = isSkipped
      ? false
      : currentWordData.alternatives
      ? [
          ...currentWordData.alternatives.map(alt => alt.toLowerCase()), // Convert alternatives to lowercase
          currentWordData.word.toLowerCase(),
        ].includes(finalResponse)
      : finalResponse === currentWordData.word.toLowerCase();

    const newResponse = {
      wordId: currentWordData.id,
      word: currentWordData.word,
      response: finalResponse,
      isCorrect,
    };

    console.log(`Processed Word ${currentWordIndex}:`, newResponse);
    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);

    // Check if it's the last word
    if (currentWordIndex === WORDS.length - 1) {
      console.log("Last word processed, showing final submit.");
      setShowFinalSubmitButton(true);
      setShowResponseArea(false); // Hide response area
    } else {
      console.log("Moving to next word.");
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setShowResponseArea(false); // Hide response area for next word's initial state
    }
  };

  /**
   * Handles submission of the user's response.
   */
  const handleSubmitResponse = () => {
    if (!userInput.trim()) {
      setError("Please enter or record a word before submitting.");
      return;
    }
    console.log(`Submitting user input: "${userInput}"`);
    processAndMoveNext(userInput, false);
  };

  /**
   * Handles skipping the current word.
   */
  const skipWord = () => {
    console.log(`Skipping word ${currentWordIndex}`);
    processAndMoveNext("", true); // Pass empty string and true for skipped
  };

  /**
   * Handles the final submission of all test results.
   */
  const handleFinalSubmit = async () => {
    console.log("Handling final submission.");
    setIsSubmittingAll(true);
    setLoadingMessage("Submitting your results...");
    await finishGame(responses); // Call the function to send data
    setIsSubmittingAll(false);
  };

  /**
   * Submits the complete game results to the backend.
   * @param {Array} responsesToSubmit - The array of all recorded responses.
   */
  const finishGame = async (responsesToSubmit) => {
    // Ensure childId and token are available from client-side state
    if (!childId) {
      console.error("Cannot submit results: childId is missing or not loaded.");
      setError("Cannot submit results: Student ID not found. Please log in again.");
      setIsSubmittingAll(false);
      return;
    }
    if (!token) {
      console.error("Cannot submit results: token is missing or not loaded.");
      setError("Cannot submit results: Authentication token missing. Please log in again.");
      setIsSubmittingAll(false);
      return;
    }

    const incorrectCount = responsesToSubmit.filter((r) => !r.isCorrect).length;
    // Calculate raw score (20 total points, -1 for each incorrect)
    const rawScore = Math.max(0, WORDS.length - incorrectCount); // Total words is WORDS.length
    // Normalize to 0-10 scale (if needed, adjust calculation)
    // Assuming 20 words, each correct gets 1 point, then divide by 2 for a score out of 10.
    const finalScore = Math.min(10, Math.max(0, Math.round(rawScore / 2)));


    console.log("Final submission data:", {
      responsesToSubmit,
      finalScore,
      rawScore,
      childId, // Use state variable
      token, // Use state variable
      totalWords: WORDS.length,
    });

    try {
      // Changed the URL to directly call the Next.js API Route
      const apiRouteUrl = "/api/soundBlending-test/submitResult";
      await axios.post(
        apiRouteUrl, // Use the direct API route URL
        {
          responses: responsesToSubmit.map((r) => ({
            wordId: r.wordId,
            isCorrect: r.isCorrect,
            response: r.response,
          })),
          normalized_score: finalScore, // Score out of 10
          totalScore: rawScore, // Changed from total_score to totalScore to match backend payload
          studentId: childId, // Use childId here as student prop is removed
          childId: childId, // Use state variable
          testType: "PhonemeBlending", // Type of test
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass authorization token
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Results submitted successfully.");

      // onComplete and suppressResultPage are no longer props for this top-level page component.
      // The page will always navigate to the results state.
      console.log("Showing results page.");
      setGameState("results");

    } catch (err) {
      console.error(
        "Error submitting results:",
        err.response?.data || err.message
      );
      setError(
        "Failed to save results. Please try again later or contact support."
      );

      // Even if submission fails, transition to results to avoid a stuck state.
      console.log("Error submitting, showing results page.");
      setGameState("results");
    }
  };

  // --- Conditional Rendering based on gameState ---

  // Render ResultsDisplay component when game is finished
  if (gameState === "results") {
    // Calculate final scores for display in ResultsDisplay
    const incorrectCount = responses.filter((r) => !r.isCorrect).length;
    const rawScore = Math.max(0, WORDS.length - incorrectCount);
    const finalScore = Math.min(10, Math.max(0, Math.round(rawScore / 2)));
    const percentage = Math.max(
      0,
      Math.min(100, Math.round((finalScore / 10) * 100))
    );

    return (
      <ResultsDisplay
        finalScore={finalScore}
        percentage={percentage}
        responses={responses}
        totalWords={WORDS.length}
        error={error}
        // onComplete and suppressResultPage are not passed to ResultsDisplay anymore
        // as they are no longer page props. If ResultsDisplay needs to handle
        // navigation differently, it should use Next.js's useRouter.
      />
    );
  }

  // Calculate current progress for ProgressBar
  const progress = Math.min(100, (currentWordIndex / WORDS.length) * 100);
  const currentWord = WORDS[currentWordIndex]; // Ensure currentWord is always defined for rendering

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-50 p-6 font-inter">
      {/* Loading overlay for final submission */}
      <AnimatePresence>
        {isSubmittingAll && <LoadingOverlay message={loadingMessage} />}
      </AnimatePresence>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6">
        {/* Progress Bar and Word Count */}
        <div className="space-y-1">
          <ProgressBar progress={progress} />
          <div className="flex justify-between text-xs text-blue-500">
            <span>Start</span>
            <span>
              Word {currentWordIndex + 1} of {WORDS.length}
            </span>
            <span>Finish</span>
          </div>
        </div>

        {/* Game Display Area (combines header, icon, input, buttons) */}
        <GameDisplay
          isPlayingSound={isPlayingSound}
          showResponseArea={showResponseArea}
          isRecording={isRecording}
          isTranscribing={isTranscribing}
          currentTranscriptionStatus={currentTranscriptionStatus}
          error={error}
          userInput={userInput}
          playCurrentWordSounds={playCurrentWordSounds}
          handleInputChange={handleInputChange}
          startListening={startListening}
          stopListening={stopListening}
          handleSubmitResponse={handleSubmitResponse}
          skipWord={skipWord}
          showFinalSubmitButton={showFinalSubmitButton}
          handleFinalSubmit={handleFinalSubmit}
          isSubmittingAll={isSubmittingAll}
          inputRef={inputRef} // Pass input ref down
        />
      </div>
    </div>
  );
}
