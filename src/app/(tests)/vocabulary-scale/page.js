"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation"; // Changed from next/router
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS
import { useLanguage } from "../../../contexts/LanguageContext"; // Assuming path
import Image from "next/image"; // Import next/image
import dynamic from "next/dynamic";

import WordDisplay from "../../../components/vocab-scale/WordDisplay";
import RecordingButton from "../../../components/vocab-scale/RecordingButton";
import DefinitionInput from "../../../components/vocab-scale/DefinitionInput";
import NavigationButton from "../../../components/vocab-scale/NavigationButton";
import TestComplete from "../../../components/vocab-scale/TestComplete";
import LoadingState from "../../../components/vocab-scale/LoadingState";
import ErrorState from "../../../components/vocab-scale/ErrorState";
import DialogIntro from "../../../components/vocab-scale/DialogIntro";
import PracticeRound from "../../../components/vocab-scale/PracticeRound";
import PracticeInstructions from "../../../components/vocab-scale/PracticeInstructions";

// Image paths from public directory
const backgroundImage = "/vocab-scale/background-image.png";
const characterImage = "/vocab-scale/Cute-Dragon.png";
const microphone = "/vocab-scale/microphone.png";

const useAudioRecorder = (onAudioCaptured) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const isRecordingRef = useRef(isRecording);
  const { language, t } = useLanguage();

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const uploadAudio = useCallback(
    async (audioBlob) => {
      const formData = new FormData();
      const file = new File([audioBlob], "vocabulary_definition.wav", {
        type: "audio/wav",
      });
      formData.append("file", file);
      formData.append("language", language);
      setIsTranscribing(true);
      setError(null);
      try {
        const response = await fetch(`/api/speech-to-text`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok && result.transcription) {
          const transcription =
            result.transcription
              .toLowerCase()
              .trim()
              .replace(/[.,!?;:]*$/, "") || "";
          onAudioCaptured(transcription);
        } else {
          const errorMsg =
            result.error || t("transcriptionFailedPleaseTryAgain");
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (error) {
        setError(t("errorUploadingAudioPleaseCheckConnection"));
        toast.error(t("errorUploadingAudioPleaseCheckConnection"));
      } finally {
        setIsTranscribing(false);
      }
    },
    [onAudioCaptured, language, t]
  );

  const stopListening = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.error(t("errorStoppingMediaRecorder"), e);
      }
    }
    if (window.stream) {
      try {
        window.stream.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (e) {
        console.error(t("errorStoppingStreamTracks"), e);
      }
      window.stream = null;
    }
    mediaRecorderRef.current = null;
    if (isRecordingRef.current) {
      setIsRecording(false);
    }
  }, [isRecordingRef, t]);

  const startListening = useCallback(() => {
    if (isRecordingRef.current) return;

    setError(null);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        window.stream = stream;
        let localAudioChunks = [];

        if (stream.getAudioTracks().length > 0) {
          stream.getAudioTracks()[0].onended = () => {
            stopListening();
          };
        }

        const mimeType = MediaRecorder.isTypeSupported("audio/wav;codecs=pcm")
          ? "audio/wav;codecs=pcm"
          : "audio/webm";

        const newMediaRecorder = new MediaRecorder(stream, {
          mimeType,
        });
        mediaRecorderRef.current = newMediaRecorder;

        newMediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            localAudioChunks.push(event.data);
          }
        };

        newMediaRecorder.onstop = async () => {
          if (localAudioChunks.length > 0) {
            const audioBlob = new Blob(localAudioChunks, {
              type: mimeType,
            });
            localAudioChunks = [];
            await uploadAudio(audioBlob);
          }
        };

        newMediaRecorder.onerror = (event) => {
          toast.error(`${t("recordingError")}: ${event.error.name}`);
          stopListening();
        };

        try {
          newMediaRecorder.start();
          setIsRecording(true);
        } catch (e) {
          toast.error(t("failedToStartRecording"));
          stopListening();
        }
      })
      .catch((error) => {
        setError(t("couldNotAccessMicrophone"));
        toast.error(t("couldNotAccessMicrophone"));
      });
  }, [uploadAudio, stopListening, isRecordingRef, t]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isRecording,
    isTranscribing,
    error,
    startListening,
    stopListening,
  };
};

// Enhanced Word Display Component

// Enhanced Navigation Button Component

// Test Complete Component

// Loading Component

// Error Component
// Main Test Client Component
const VocabularyScaleTestClient = () => {
  const [childId, setChildId] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter(); // No change needed here
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentDefinition, setCurrentDefinition] = useState("");
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [incorrectStreak, setIncorrectStreak] = useState(0);
  const { language, t } = useLanguage();
  const [currentDialog, setCurrentDialog] = useState(0);
  const [showTest, setShowTest] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [showPracticeInstructions, setShowPracticeInstructions] =
    useState(false);
  const [practiceComplete, setPracticeComplete] = useState(false);

  // Dialog content - kept here as it's specific to this test's narrative
  const dialog = [
    "🙏 Namaste, young wordsmith!",
    "🏛️ Welcome to Shabd Mandir — a sacred place where every new word you grasp 📚 raises the temple closer to the stars ✨.",
    "🐍 I am Vani Naga, serpent of knowledge and guardian of the final Codex fragment 📖.",
    "🗝️ Are you ready to awaken the power of words and complete your journey? Let's begin! 🚀",
  ];

  useEffect(() => {
    setMounted(true);
    setChildId(localStorage.getItem("childId"));
  }, []);

  const handleNextDialog = () => {
    if (currentDialog < dialog.length - 1) {
      setCurrentDialog((prev) => prev + 1);
    } else {
      setShowPracticeInstructions(true);
    }
  };

  const handleStartPractice = () => {
    setShowPracticeInstructions(false);
    setShowPractice(true);
  };

  const handlePracticeComplete = () => {
    setPracticeComplete(true);
    setShowPractice(false);
    setShowTest(true);
  };

  // Handle transcribed audio for main test
  const handleTranscriptionComplete = useCallback((transcription) => {
    setCurrentDefinition(transcription);
  }, []);

  const {
    isRecording,
    isTranscribing,
    error: recorderError,
    startListening,
    stopListening,
  } = useAudioRecorder(handleTranscriptionComplete);

  // Combine component error with recorder error
  useEffect(() => {
    if (recorderError) {
      setError(recorderError);
    }
  }, [recorderError]);

  // Fetch words on component mount
  useEffect(() => {
    const fetchWords = async () => {
      if (!childId) {
        setIsLoading(false);
        setError(t("childIdNotAvailable"));
        setWords([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "/api/vocabscale-test/getVocabularyWords",
          {
            params: { language: language }, // Pass language as a query parameter
          }
        );
        console.log("API Response:", response.data);
        if (response.data && Array.isArray(response.data.words)) {
          console.log("Fetched words:", response.data.words);
          console.log("Number of words:", response.data.words.length);
          setWords(response.data.words);
        } else {
          console.error(
            t("invalidDataFormatForVocabularyWords"),
            response.data
          );
          setError(t("failedToLoadVocabularyWordsInvalidFormat"));
          toast.error(t("failedToLoadVocabularyWordsInvalidFormat"));
        }
      } catch (err) {
        console.error(t("errorFetchingVocabularyWords"), err);
        setError(t("failedToLoadVocabularyWords"));
        toast.error(t("failedToLoadVocabularyWords"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchWords();
  }, [childId, language, t]); // Added childId and language to dependencies

  const handleSubmit = useCallback(async () => {
    stopListening();
    if (isSubmitting || testComplete) return;

    setSubmitting(true);
    setError(null);

    // Capture the last response if not already saved
    const finalResponses = [...responses];
    const currentWord = words[currentWordIndex];
    if (currentWord && !responses.find((r) => r.word === currentWord.word)) {
      finalResponses.push({
        word: currentWord.word,
        definition: currentDefinition,
      });
      setResponses(finalResponses); // Update state if last definition was added
    }

    try {
      const response = await axios.post(
        "/api/vocabscale-test/submitResult", // Updated to Next.js API route
        {
          childId: childId,
          responses: finalResponses,
          language: language,
        }
      );

      if (response.data && typeof response.data.score !== "undefined") {
        setFinalScore(response.data.score);
        setTestComplete(true);
        toast.success(t("testSubmittedSuccessfully"));
      } else {
        setError(t("failedToSubmitTestUnknownError"));
        toast.error(t("failedToSubmitTestUnknownError"));
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        t("failedToSubmitTestPleaseCheckConnection");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  }, [
    stopListening,
    isSubmitting,
    testComplete,
    responses,
    words,
    currentWordIndex,
    currentDefinition,
    childId,
    language,
    t,
  ]);

  const handleNextWord = useCallback(() => {
    stopListening();
    const currentWord = words[currentWordIndex];
    const newResponse = {
      word: currentWord.word,
      definition: currentDefinition,
    };
    const updatedResponses = [
      ...responses.slice(0, currentWordIndex),
      newResponse,
      ...responses.slice(currentWordIndex + 1),
    ];
    setResponses(updatedResponses);

    // Basic check if definition is empty - consider this "incorrect" for stopping rule
    if (!currentDefinition.trim()) {
      setIncorrectStreak((prev) => prev + 1);
    } else {
      setIncorrectStreak(0); // Reset streak if there's an answer
    }

    // Move to the next word or finish
    if (currentWordIndex < words.length - 1 && incorrectStreak < 4) {
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      // Load existing definition if user is revisiting a word
      const nextWordResponse = updatedResponses[currentWordIndex + 1];
      setCurrentDefinition(nextWordResponse ? nextWordResponse.definition : "");
    } else {
      // End of test or 5 incorrect rule triggered
      handleSubmit();
    }
  }, [
    currentWordIndex,
    words,
    currentDefinition,
    responses,
    incorrectStreak,
    stopListening,
    handleSubmit, // Removed t from dependency array as it's not used
  ]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <LoadingState t={t} />;
  }

  // Render states
  if (isLoading) {
    return <LoadingState t={t} />;
  }

  if (testComplete) {
    return (
      <TestComplete
        finalScore={finalScore}
        totalWords={words.length}
        error={error}
        childId={childId}
      />
    );
  }

  if (words.length === 0 && !isLoading) {
    console.log("No words found, error:", error);
    return <ErrorState message={error || t("noVocabularyWordsFound")} />;
  }

  const currentWord = words[currentWordIndex];
  console.log("Current word:", currentWord);
  console.log("Words array:", words);
  console.log("Show test:", showTest);

  return (
    <>
      {/* Background elements - no changes needed here unless image paths are wrong */}
      <div className="fixed inset-0 z-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter:
              showTest || showPractice || showPracticeInstructions
                ? "none"
                : "blur(8px)",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-yellow-950/30"
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              showTest || showPractice || showPracticeInstructions ? 0.2 : 0.45,
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main content container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
        <button
          onClick={() => router.push("/take-tests?skipStart=true")} // Updated path
          className="text-white hover:text-amber-100 text-lg flex items-center gap-1 border border-amber-800/20 rounded-full px-4 py-2 transition-colors duration-300 shadow-lg absolute top-4 left-4 z-50 backdrop-blur-md hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToMap")}
        </button>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative max-w-7xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-12"
        >
          {/* Floating character - only show during intro */}
          {!showTest && !showPractice && !showPracticeInstructions && (
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
              className="flex-shrink-0"
            >
              <Image
                src={characterImage}
                alt="Vani Naga"
                width={448} // Added width
                height={448} // Added height
                className="h-64 sm:h-80 lg:h-96 xl:h-112 object-contain"
              />
            </motion.div>
          )}

          {/* Main content area */}
          <motion.div
            className={`bg-gradient-to-br from-amber-800/60 to-yellow-900/30 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-yellow-400/30 shadow-[0_8px_30px_rgba(252,211,77,0.25)] flex-1 relative overflow-hidden w-full ${
              showTest || showPractice || showPracticeInstructions
                ? "lg:max-w-3xl mx-auto"
                : "lg:max-w-4xl"
            }`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {/* 🪔 Temple Glow Line */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-200/60 via-amber-100/30 to-orange-100/40" />

            {/* ✨ Magical Orbs */}
            <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-yellow-300/20 rounded-full blur-3xl" />
            <div className="absolute -top-20 -left-20 w-44 h-44 bg-orange-200/20 rounded-full blur-3xl" />

            {/* 🔆 Aura Glows */}
            <div className="absolute top-1/2 right-8 w-24 h-24 bg-yellow-100/30 rounded-full blur-2xl" />
            <div className="absolute bottom-8 left-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />

            {/* 🌤️ Ambient shimmer */}
            <div className="absolute -top-12 right-1/3 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" />

            <ToastContainer position="top-center" autoClose={3000} />

            {!showPracticeInstructions && !showPractice && !showTest ? (
              <DialogIntro
                currentDialog={currentDialog}
                dialog={dialog}
                handleNext={handleNextDialog}
                t={t}
              />
            ) : showPracticeInstructions ? (
              <PracticeInstructions
                onStartPractice={handleStartPractice}
                t={t}
                language={language}
              />
            ) : showPractice && !practiceComplete ? (
              <PracticeRound
                language={language}
                t={t}
                onPracticeComplete={handlePracticeComplete}
              />
            ) : isLoading ? (
              <LoadingState t={t} />
            ) : error && !isLoading && !isSubmitting && !isTranscribing ? (
              <ErrorState message={error} />
            ) : testComplete ? (
              <TestComplete
                finalScore={finalScore}
                totalWords={words.length}
                error={error}
                childId={childId}
              />
            ) : words.length === 0 && !isLoading ? (
              <ErrorState message={t("noVocabularyWordsFound")} />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`test-content-${currentWordIndex}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  {/* Progress bar and back button */}
                  <div className="w-full mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80 text-md">
                        {t("progress")}: {currentWordIndex + 1}/{words.length}
                      </span>
                    </div>
                    <div className="w-full bg-yellow-200/20 rounded-full h-3">
                      <motion.div
                        className="bg-gradient-to-r from-yellow-400 to-amber-600 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            ((currentWordIndex + 1) / words.length) * 100
                          }%`,
                        }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>

                  {currentWord && (
                    <>
                      <WordDisplay
                        currentWord={currentWord}
                        currentIndex={currentWordIndex}
                        totalWords={words.length}
                        language={language}
                        t={t}
                      />

                      <DefinitionInput
                        currentDefinition={currentDefinition}
                        setCurrentDefinition={setCurrentDefinition}
                        isRecording={isRecording}
                        t={t}
                        isTranscribing={isTranscribing}
                        isSubmitting={isSubmitting}
                        startListening={startListening}
                        stopListening={stopListening}
                        incorrectStreak={incorrectStreak}
                        error={error}
                        wordText={
                          language === "ta" && currentWord.ta
                            ? currentWord.ta
                            : language === "hi" && currentWord.hi
                            ? currentWord.hi
                            : currentWord.word
                        }
                        language={language}
                      />

                      <div className="mt-auto pt-4 flex justify-end items-center">
                        <NavigationButton
                          onClick={handleNextWord}
                          isLast={currentWordIndex === words.length - 1}
                          isDisabled={isSubmitting}
                          isSubmitting={isSubmitting}
                          isRecording={isRecording}
                          isTranscribing={isTranscribing}
                          incorrectStreak={incorrectStreak}
                          t={t}
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};
// Create dynamic import to avoid SSR issues
const VocabularyScaleTest = dynamic(
  () => Promise.resolve(VocabularyScaleTestClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center p-8 h-64">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="mt-4 text-blue-700 font-medium">Loading Test...</p>
      </div>
    ),
  }
);

export default VocabularyScaleTest;
