"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useLanguage } from "../../../contexts/LanguageContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import wordLists from "./wordLists.json";
import { improveTranscriptionAccuracy } from "./accuracyImprover";
import ancientPaper from "../../../../public/reading-test/ancientPaper.png";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowRightCircle,
  Mic,
  MicOff,
  UploadCloud,
  Award,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import coralBackground from "../../../../public/reading-test/coralBackground.png";
import coralineImage from "../../../../public/reading-test/coralineImage.png";
import shellImage from "../../../../public/reading-test/shellImage.png";

import TutorialView from "./TutorialView";
import TestSessionView from "./TestSessionView";
import RewardView from "./RewardView";

const useAudioRecorder = (onAudioRecorded) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        window.stream = stream;
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });

    return () => {
      if (window.stream) {
        window.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        window.stream = stream;
        let localAudioChunks = [];
        const newMediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = newMediaRecorder;

        newMediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            localAudioChunks.push(event.data);
          }
        };

        newMediaRecorder.onstop = async () => {
          setIsRecording(false);
          if (localAudioChunks.length > 0) {
            const audioBlob = new Blob(localAudioChunks, { type: "audio/wav" });
            onAudioRecorded(audioBlob);
          }
        };

        newMediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
        setIsRecording(false);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (window.stream) {
      window.stream.getTracks().forEach((track) => track.stop());
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
};

const useTranscriptionService = (t, language) => {
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionReady, setTranscriptionReady] = useState(false);

  const transcribeAudio = async (audioBlob) => {
    const formData = new FormData();

    if (audioBlob instanceof File) {
      formData.append("file", audioBlob);
    } else {
      const file = new File([audioBlob], "user_audio.wav", {
        type: "audio/wav",
      });
      formData.append("file", file);
    }

    formData.append("language", language);

    try {
      setIsTranscribing(true);
      // PATH CHANGE: Ensure backendURL is correctly defined
      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const rawTranscript = result.transcription;
        // PATH CHANGE: wordLists is imported directly, ensure path is correct
        const targetWordsForLanguage = wordLists[language] || wordLists.en;
        const safeTargetWords = Array.isArray(targetWordsForLanguage)
          ? targetWordsForLanguage
          : [];
        if (typeof rawTranscript !== "string") {
          console.error("Raw transcript is not a string:", rawTranscript);
          setTranscript("");
          setTranscriptionReady(true);
          return "";
        }
        if (!Array.isArray(safeTargetWords) || safeTargetWords.length === 0) {
          console.warn(
            "safeTargetWords is not a valid array or is empty. Using raw transcript for language:",
            language,
            "Content:",
            safeTargetWords
          );
          const cleanedRawTranscript = String(rawTranscript)
            .toLowerCase()
            .replace(/[.,!?;:"']/g, "")
            .split(/\s+/)
            .filter((word) => word.length > 0)
            .join(" ");
          setTranscript(cleanedRawTranscript);
          setTranscriptionReady(true);
          return cleanedRawTranscript;
        }
        // PATH CHANGE: improveTranscriptionAccuracy is imported directly, ensure path is correct
        const correctedTranscript = improveTranscriptionAccuracy(
          rawTranscript,
          safeTargetWords
        );

        setTranscript(correctedTranscript);
        setTranscriptionReady(true);
        return correctedTranscript;
      } else {
        console.error("Error during transcription:", response.statusText);
        toast.error(t("transcriptionFailedTryAgain"));
        setTranscript("");
        return null;
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      toast.error(t("errorUploadingAudioTryAgain"));
      return null;
    } finally {
      setIsTranscribing(false);
    }
  };

  return {
    transcript,
    isTranscribing,
    transcriptionReady,
    transcribeAudio,
    setTranscriptionReady,
    setTranscript, // Added to allow clearing transcript on page change
  };
};

const useTestSubmission = (onTestComplete, router, t) => {
  const [testResults, setTestResults] = useState([]);

  const submitTest = async (
    transcript,
    suppressResultPage,
    language = "en"
  ) => {
    const spokenWords = transcript.trim().toLowerCase();
    const childId = localStorage.getItem("childId") || null;
    const token = localStorage.getItem("access_token");

    try {
      const responseFromApi = await axios.post(
        "/api/reading-test/submitResult",
        { childId, spokenWords, language },
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "application/json",
          },
        }
      );

      if (responseFromApi.status === 201) {
        const { score, correctGroups, errorWords } = responseFromApi.data;
        const validCorrectGroups = Array.isArray(correctGroups)
          ? correctGroups.map((group) =>
              Array.isArray(group) ? group : [group]
            )
          : [];
        const validErrorWords = Array.isArray(errorWords)
          ? errorWords.map((word) => (Array.isArray(word) ? word : [word]))
          : [];

        const tableData = validCorrectGroups.map((group, index) => ({
          continuousCorrectWords: group.join(" "),
          errorWords: validErrorWords[index]?.join(" ") || "-",
        }));

        setTestResults(tableData);

        if (suppressResultPage && typeof onTestComplete === "function") {
          onTestComplete(score);
        } else {
          toast.success(t("testSubmittedWithScore").replace("{score}", score), {
            position: "top-center",
            onClose: () => {
              router.push({
                pathname: "/results", 
                query: { score: score, tableData: JSON.stringify(tableData) },
              });
            },
          });
        }
        return { success: true, score };
      } else {
        toast.error(t("failedToSubmitTestPleaseTryAgain"));
        return { success: false };
      }
    } catch (error) {
      console.error("Full error details:", {
        config: error.config,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(
        t("anErrorOccurredWhileSubmittingTheTestPleaseTryAgain") ||
          t("errorOccurred")
      );
      return { success: false };
    }
  };

  return {
    testResults,
    submitTest,
  };
};

export default function Test6Controller({
  suppressResultPage = false,
  onComplete,
}) {
  const { language, t } = useLanguage();
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState(null);
  const [showEels, setShowEels] = useState(false);
  const [showReward, setShowReward] = useState(false);
  // const [showSpyglass, setShowSpyglass] = useState(false); // Not used in provided logic, kept for completeness
  const [coralineVisible, setCoralineVisible] = useState(false);
  const [coralineAnimationState, setCoralineAnimationState] = useState("idle");
  // const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // Not used in provided logic, kept for completeness
  const [showTutorial, setShowTutorial] = useState(true);

  const [introMessage, setIntroMessage] = useState("");
  const [gameProgress, setGameProgress] = useState(0);
  const [gameState, setGameState] = useState("intro");
  // const [collectedTreasures, setCollectedTreasures] = useState([]); // Not used in provided logic, kept for completeness
  const [tutorialPhase, setTutorialPhase] = useState(0);
  const [isTutorialComplete, setIsTutorialComplete] = useState(false);

  const [currentWords, setCurrentWords] = useState([]);
  const [wordShells, setWordShells] = useState([]);
  // const [currentWordIndex, setCurrentWordIndex] = useState(0); // Replaced by currentPage logic
  const [wordsPerBatch] = useState(12);
  const [allTranscriptions, setAllTranscriptions] = useState([]);
  // const [completedPages, setCompletedPages] = useState([]); // Not directly used in provided submit logic, transcriptions are combined
  const [currentPage, setCurrentPage] = useState(0);

  // const wordIntervalRef = useRef(null); // Not used in provided logic, kept for completeness

  const tutorialMessages = useMemo(
    () => [
      t("tutorialHelloExplorer"),
      t("tutorialCoralineIntro"),
      t("tutorialGlyphReefDescription"),
      t("tutorialReadingTask"),
      t("tutorialDifficulty"),
      t("tutorialShellOfFluency"),
      t("tutorialCoralSpyglass"),
      t("tutorialLetsGetReading"),
      t("tutorialReadyForMission"),
    ],
    [t]
  );

  const {
    transcript,
    isTranscribing,
    transcriptionReady,
    transcribeAudio,
    setTranscriptionReady,
    setTranscript,
  } = useTranscriptionService(t, language);

  const { submitTest } = useTestSubmission(onComplete, router, t);
  const { isRecording, startRecording, stopRecording } =
    useAudioRecorder(transcribeAudio);

  useEffect(() => {
    if (!showTutorial && gameState === "active") {
      const words = wordLists[language] || wordLists.en;
      setCurrentWords(words);
      setWordShells(
        words.map((word, index) => ({
          id: index,
          word,
          collected: false,
          glowing: false,
        }))
      );
      if (words.length > 0) {
        setGameProgress(
          (wordsPerBatch / words.length) *
            100 *
            (1 / Math.ceil(words.length / wordsPerBatch)) *
            0.85
        );
      } else {
        setGameProgress(0);
      }
    }
  }, [language, showTutorial, gameState, wordsPerBatch, wordLists]);

  useEffect(() => {
    const handleResize = () => {
      // if (window.innerWidth < 768) {
      //   setIsSidebarExpanded(false);
      // } else {
      //   setIsSidebarExpanded(true);
      // }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const introSequence = async () => {
      if (!showTutorial) return;

      setGameState("intro");
      setCoralineVisible(true);
      setCoralineAnimationState("entering");
      setTutorialPhase(0);
      if (tutorialMessages.length > 0) {
        setIntroMessage(tutorialMessages[0]);
      }
    };
    if (t && tutorialMessages.length > 0 && tutorialMessages[0]) {
      // Ensure t and messages are loaded
      introSequence();
    }
  }, [showTutorial, tutorialMessages, t]);

  const handleNextTutorialStep = () => {
    if (tutorialPhase < tutorialMessages.length - 1) {
      setTutorialPhase((prev) => prev + 1);
      setIntroMessage(tutorialMessages[tutorialPhase + 1]);
      if (tutorialPhase === tutorialMessages.length - 2) {
        setCoralineAnimationState("happy");
      }
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setIsTutorialComplete(true);
    setGameState("active");
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setCoralineAnimationState("excited");
      setIntroMessage(t("coralineExcellentRecording"));
      const currentTranscript = await transcribeAudio(file);

      if (currentTranscript) {
        setAllTranscriptions((prev) => {
          const newTranscriptions = [...prev];
          newTranscriptions[currentPage] = currentTranscript;
          return newTranscriptions;
        });

        setCoralineAnimationState("happy");
        setIntroMessage(t("coralineHeardClearly"));
        const progress = Math.min(
          ((currentPage + 1) / Math.ceil(currentWords.length / wordsPerBatch)) *
            85,
          85
        );
        setGameProgress(progress);
        glowCorrectWords(currentTranscript);
      } else {
        setCoralineAnimationState("confused");
        setIntroMessage(t("coralineCouldntMakeOut"));
      }

      setTimeout(() => {
        setCoralineAnimationState("idle");
        setIntroMessage("");
      }, 4000);
    }
  };

  const glowCorrectWords = (text) => {
    if (!text) return;
    const spokenWords = text.toLowerCase().split(" ");
    setWordShells((prev) =>
      prev.map((shell) => ({
        ...shell,
        glowing: spokenWords.includes(shell.word.toLowerCase()),
      }))
    );

    setTimeout(() => {
      setWordShells((prev) =>
        prev.map((shell) => ({
          ...shell,
          glowing: false,
        }))
      );
    }, 3000);
  };

  const handleSubmitPageOrTest = async () => {
    if (
      !transcriptionReady &&
      !selectedFile &&
      allTranscriptions[currentPage] === undefined
    ) {
      toast.info(t("transcriptionNotReady"));
      setShowEels(true);
      setCoralineAnimationState("warning");
      setIntroMessage(t("coralineNeedYourVoice"));
      setTimeout(() => {
        setShowEels(false);
        setCoralineAnimationState("idle");
        setIntroMessage("");
      }, 3000);
      return;
    }

    let currentTranscriptForPage = transcript;
    if (allTranscriptions[currentPage]) {
      // If already transcribed (e.g. via file upload)
      currentTranscriptForPage = allTranscriptions[currentPage];
    }

    setAllTranscriptions((prev) => {
      const newTranscriptions = [...prev];
      newTranscriptions[currentPage] = currentTranscriptForPage;
      return newTranscriptions;
    });

    const isLastPage = (currentPage + 1) * wordsPerBatch >= currentWords.length;

    if (isLastPage) {
      setCoralineAnimationState("focused");
      setIntroMessage(t("coralineCheckingPronunciation"));
      setGameProgress(85);

      const finalTranscriptions = [...allTranscriptions];
      if (!finalTranscriptions[currentPage] && transcript) {
        finalTranscriptions[currentPage] = transcript;
      }
      const combinedTranscript = finalTranscriptions.filter(Boolean).join(" ");

      const { success, score } = await submitTest(
        combinedTranscript.trim(),
        suppressResultPage,
        language
      );

      if (success) {
        setGameProgress(100);
        if (onComplete && typeof onComplete === "function") {
          onComplete(combinedTranscript, score);
        }
        if (score >= 70) {
          setGameState("success");
          setCoralineAnimationState("celebrating");
          setShowReward(true);
          setIntroMessage(t("coralineExcellentJob"));
          setTimeout(() => {
            setCoralineAnimationState("happy");
            setIntroMessage(t("coralineRewardUnlocked"));
          }, 3000);
        } else {
          setCoralineAnimationState("encouraging");
          setIntroMessage(t("coralineGoodEffort"));
        }
      } else {
        setCoralineAnimationState("confused");
        setIntroMessage(t("coralineReefMagicError"));
      }
    } else {
      setCurrentPage((prev) => prev + 1);
      setTranscript("");
      setTranscriptionReady(false);
      setSelectedFile(null);

      const newProgress = Math.min(
        (((currentPage + 2) * wordsPerBatch) / currentWords.length) * 85,
        85
      );
      setGameProgress(newProgress);

      setCoralineAnimationState("happy");
      setIntroMessage(t("coralineNextPage"));

      setTimeout(() => {
        setCoralineAnimationState("idle");
        setIntroMessage("");
      }, 2000);
    }
  };

  const visibleWords = useMemo(() => {
    const start = currentPage * wordsPerBatch;
    const end = start + wordsPerBatch;
    return wordShells.slice(start, end).map((shell, idx) => ({
      ...shell,
      word: shell.word || shell,
      index: start + idx,
    }));
  }, [currentPage, wordShells, wordsPerBatch]);

  const backgroundStyle = coralBackground
    ? { backgroundImage: `url(${coralBackground.src || coralBackground})` }
    : {};

  if (!t) {
    return <div>Loading translations...</div>;
  }

  return (
    <div
      className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4 md:p-8 bg-cover bg-center"
      style={backgroundStyle}
    >
      {showTutorial && tutorialMessages.length > 0 && tutorialMessages[0] && (
        <TutorialView
          tutorialMessages={tutorialMessages}
          tutorialPhase={tutorialPhase}
          handleNextTutorialStep={handleNextTutorialStep}
          onTutorialComplete={handleTutorialComplete}
          introMessage={introMessage}
          // PATH CHANGE: Ensure coralineImage path is correct
          coralineImage={coralineImage.src || coralineImage}
          coralineAnimationState={coralineAnimationState}
          t={t}
        />
      )}
      <Link
        href="/taketests" // PATH CHANGE: Ensure this route exists in your Next.js app
        className="absolute top-4 left-0 z-50 flex items-center gap-2 bg-white/80 hover:bg-white text-teal-800 font-medium py-2 px-4 rounded-full shadow-md transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
        {t("backToTests")}
      </Link>

      {!showTutorial && isTutorialComplete && (
        <TestSessionView
          gameProgress={gameProgress}
          currentPage={currentPage}
          currentWordsLength={currentWords.length}
          wordsPerBatch={wordsPerBatch}
          // PATH CHANGE: Ensure ancientPaper path is correct
          ancientPaperImage={ancientPaper.src || ancientPaper}
          visibleWords={visibleWords}
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          showEels={showEels}
          handleFileUpload={handleFileUpload}
          handleSubmitPageOrTest={handleSubmitPageOrTest}
          isTranscribing={isTranscribing}
          transcriptionReady={
            transcriptionReady ||
            (selectedFile && allTranscriptions[currentPage])
          }
          t={t}
          // PATH CHANGE: Ensure coralineImage path is correct for eels
          coralineImageForEels={coralineImage.src || coralineImage}
        />
      )}
      <AnimatePresence>
        {showReward && (
          <RewardView
            // PATH CHANGE: Ensure shellImage path is correct
            shellImage={shellImage.src || shellImage}
            onClose={() => setShowReward(false)}
            t={t}
          />
        )}
      </AnimatePresence>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div>
  );
}
