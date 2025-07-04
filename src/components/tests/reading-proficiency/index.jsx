<<<<<<< HEAD
// Test6Controller.jsx (or your index.jsx)
=======
>>>>>>> f9f23e9 (Add Kannada language support; update word lists and language handling)
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useLanguage } from "../../../contexts/LanguageContext"; // Adjust path if needed
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import wordLists from "src/Data/wordLists.json"; // Assuming in the same directory
import { improveTranscriptionAccuracy } from "./accuracyImprover"; // Assuming in the same directory
import ancientPaper from "../../../../public/reading-test/ancientPaper.png"; // Adjust path
import "react-toastify/dist/ReactToastify.css";
<<<<<<< HEAD
import {
  ArrowRightCircle,
  Mic,
  MicOff,
  UploadCloud,
  Award,
  ChevronRight,
  ChevronLeft,
<<<<<<< HEAD
<<<<<<< HEAD
  HelpCircle,
=======
  HelpCircle, 
>>>>>>> 3dcec4d (Added Demo Round)
=======
  HelpCircle,
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
} from "lucide-react";
=======
import { ChevronLeft, HelpCircle } from "lucide-react";
>>>>>>> f9f23e9 (Add Kannada language support; update word lists and language handling)
import { motion, AnimatePresence } from "framer-motion";

import coralBackground from "../../../../public/reading-test/coralBackground.png"; // Adjust path
import coralineImage from "../../../../public/reading-test/coralineImage.png"; // Adjust path
import shellImage from "../../../../public/reading-test/shellImage.png"; // Adjust path

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
import TutorialView from "./TutorialView";
import TestSessionView from "./TestSessionView";
import RewardView from "./RewardView";
import TestInstructionsScreen from "./TestInstructionsScreen";
import InstructionsModal from "./InstructionsModal";
import DemoRoundView from "./DemoRoundView";
<<<<<<< HEAD
=======
import TutorialView from "./TutorialView"; 
import TestSessionView from "./TestSessionView"; 
import RewardView from "./RewardView"; 
import TestInstructionsScreen from "./TestInstructionsScreen"; 
import InstructionsModal from "./InstructionsModal"; 
import DemoRoundView from "./DemoRoundView"; 
>>>>>>> 3dcec4d (Added Demo Round)
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)

const useAudioRecorder = (onAudioRecorded) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          stream.getTracks().forEach((track) => track.stop());
<<<<<<< HEAD
        })
        .catch((error) => {
          console.warn(
            "Initial microphone access check failed or denied:",
            error
          );
        });
    }
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
=======
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          stream.getTracks().forEach(track => track.stop());
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
        })
        .catch((error) => {
          console.warn(
            "Initial microphone access check failed or denied:",
            error
          );
        });
    }
    return () => {
<<<<<<< HEAD
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
>>>>>>> 3dcec4d (Added Demo Round)
=======
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
        mediaRecorderRef.current.stop();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
    };
  }, []);

  const startRecording = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
      toast.error(
        "Audio recording is not supported on this browser or connection."
      );
      setIsRecording(false);
      return;
<<<<<<< HEAD
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
=======
        toast.error("Audio recording is not supported on this browser or connection.");
        setIsRecording(false);
        return;
    }
    if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
>>>>>>> 3dcec4d (Added Demo Round)
=======
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    }
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
<<<<<<< HEAD
<<<<<<< HEAD
        localStreamRef.current = stream;
=======
        localStreamRef.current = stream; 
>>>>>>> 3dcec4d (Added Demo Round)
=======
        localStreamRef.current = stream;
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
        let localAudioChunks = [];
        const newMediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = newMediaRecorder;
        newMediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) localAudioChunks.push(event.data);
        };
        newMediaRecorder.onstop = async () => {
          if (localAudioChunks.length > 0) {
            const audioBlob = new Blob(localAudioChunks, { type: "audio/wav" });
            onAudioRecorded(audioBlob);
<<<<<<< HEAD
<<<<<<< HEAD
            localAudioChunks = [];
=======
            localAudioChunks = []; 
>>>>>>> 3dcec4d (Added Demo Round)
=======
            localAudioChunks = [];
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
          }
        };
        newMediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
<<<<<<< HEAD
<<<<<<< HEAD
        toast.error(
          "Could not start recording. Please check microphone permissions."
        );
        setIsRecording(false);
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => track.stop());
          localStreamRef.current = null;
=======
        toast.error("Could not start recording. Please check microphone permissions.");
        setIsRecording(false);
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
>>>>>>> 3dcec4d (Added Demo Round)
=======
        toast.error(
          "Could not start recording. Please check microphone permissions."
        );
        setIsRecording(false);
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => track.stop());
          localStreamRef.current = null;
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
        }
      });
  };

  const stopRecording = () => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
<<<<<<< HEAD
=======
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop(); 
>>>>>>> 3dcec4d (Added Demo Round)
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
<<<<<<< HEAD
<<<<<<< HEAD
    setIsRecording(false);
=======
    setIsRecording(false); 
>>>>>>> 3dcec4d (Added Demo Round)
=======
    setIsRecording(false);
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
  };
  return { isRecording, startRecording, stopRecording };
};

const useTranscriptionService = (t, language) => {
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionReady, setTranscriptionReady] = useState(false);

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
  const transcribeAudio = async (
    audioBlob,
    targetWordsForCorrectionList = null
  ) => {
<<<<<<< HEAD
    if (!audioBlob) {
      toast.error(t("noAudioToTranscribe") || "No audio data to transcribe.");
      return null;
=======
  const transcribeAudio = async (audioBlob, targetWordsForCorrectionList = null) => {
    if (!audioBlob) {
        toast.error(t("noAudioToTranscribe") || "No audio data to transcribe.");
        return null;
>>>>>>> 3dcec4d (Added Demo Round)
=======
    if (!audioBlob) {
      toast.error(t("noAudioToTranscribe") || "No audio data to transcribe.");
      return null;
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    }
    const formData = new FormData();
    const fileName = `user_audio_${Date.now()}.wav`;
    if (audioBlob instanceof File) {
      formData.append("file", audioBlob, audioBlob.name || fileName);
    } else {
      const file = new File([audioBlob], fileName, { type: "audio/wav" });
      formData.append("file", file);
    }
    formData.append("language", language);

    setIsTranscribing(true);
    setTranscriptionReady(false);
<<<<<<< HEAD
<<<<<<< HEAD
    setTranscript("");

    try {
      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
=======
    setTranscript(""); 
      
    try {
      const response = await fetch("/api/speech-to-text", { 
        method: "POST", body: formData,
>>>>>>> 3dcec4d (Added Demo Round)
=======
    setTranscript("");

    try {
      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
      });
      if (response.ok) {
        const result = await response.json();
        const rawTranscript = result.transcription;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
        const correctionList =
          targetWordsForCorrectionList || wordLists[language] || wordLists.en;
        const safeTargetWords = Array.isArray(correctionList)
          ? correctionList
          : [];
        const correctedTranscript = improveTranscriptionAccuracy(
          rawTranscript || "",
          safeTargetWords
        );
<<<<<<< HEAD
=======
        const correctionList = targetWordsForCorrectionList || wordLists[language] || wordLists.en;
        const safeTargetWords = Array.isArray(correctionList) ? correctionList : [];
        const correctedTranscript = improveTranscriptionAccuracy(rawTranscript || "", safeTargetWords);
>>>>>>> 3dcec4d (Added Demo Round)
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
        setTranscript(correctedTranscript);
        return correctedTranscript;
      } else {
        console.error("Error during transcription:", response.statusText);
        toast.error(t("transcriptionFailedTryAgain"));
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      toast.error(t("errorUploadingAudioTryAgain"));
    } finally {
<<<<<<< HEAD
<<<<<<< HEAD
      setIsTranscribing(false);
      setTranscriptionReady(true);
    }
    return null;
  };
  return {
    transcript,
    isTranscribing,
    transcriptionReady,
    transcribeAudio,
    setTranscript,
    setTranscriptionReady,
  };
=======
        setIsTranscribing(false);
        setTranscriptionReady(true); 
    }
    return null;
  };
  return { transcript, isTranscribing, transcriptionReady, transcribeAudio, setTranscript, setTranscriptionReady };
>>>>>>> 3dcec4d (Added Demo Round)
=======
      setIsTranscribing(false);
      setTranscriptionReady(true);
    }
    return null;
  };
  return {
    transcript,
    isTranscribing,
    transcriptionReady,
    transcribeAudio,
    setTranscript,
    setTranscriptionReady,
  };
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
};

const useTestSubmission = (onTestComplete, router, t) => {
  const [testResults, setTestResults] = useState([]);
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
  const submitTest = async (
    transcriptToSubmit,
    suppressResultPage,
    language = "en"
  ) => {
<<<<<<< HEAD
=======
  const submitTest = async (transcriptToSubmit, suppressResultPage, language = "en") => {
>>>>>>> 3dcec4d (Added Demo Round)
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    const spokenWords = transcriptToSubmit.trim().toLowerCase();
    const childId = localStorage.getItem("childId") || null;
    const token = localStorage.getItem("access_token");
    if (!spokenWords) {
<<<<<<< HEAD
<<<<<<< HEAD
      toast.info(t("nothingToSubmit") || "Nothing to submit.");
      return { success: false, score: 0 };
=======
        toast.info(t("nothingToSubmit") || "Nothing to submit.");
        return { success: false, score: 0 };
>>>>>>> 3dcec4d (Added Demo Round)
=======
      toast.info(t("nothingToSubmit") || "Nothing to submit.");
      return { success: false, score: 0 };
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    }
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
        const validCorrectGroups = Array.isArray(correctGroups)
          ? correctGroups.map((g) => (Array.isArray(g) ? g : [g]))
          : [];
        const validErrorWords = Array.isArray(errorWords)
          ? errorWords.map((w) => (Array.isArray(w) ? w : [w]))
          : [];
<<<<<<< HEAD
=======
        const validCorrectGroups = Array.isArray(correctGroups) ? correctGroups.map((g) => Array.isArray(g) ? g : [g]) : [];
        const validErrorWords = Array.isArray(errorWords) ? errorWords.map((w) => Array.isArray(w) ? w : [w]) : [];
>>>>>>> 3dcec4d (Added Demo Round)
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
        const tableData = validCorrectGroups.map((group, index) => ({
          continuousCorrectWords: group.join(" "),
          errorWords: validErrorWords[index]?.join(" ") || "",
          score: score / validCorrectGroups.length, // Distribute score evenly for demo purposes
        }));
        setTestResults(tableData);
        if (suppressResultPage && typeof onTestComplete === "function") {
          onTestComplete(score);
        } else {
<<<<<<< HEAD
<<<<<<< HEAD
          toast.success(`Test submitted with score: ${score}`, {
            position: "top-center",
            onClose: () => {
              if (router && router.push) {
                const queryParams = new URLSearchParams({
                  score: score.toString(),
                  tableData: JSON.stringify(tableData),
                });
<<<<<<< HEAD
=======
          toast.success(t("testSubmittedWithScore", { score: score }), {
            position: "top-center",
            onClose: () => {
              if (router && router.push) {
                router.push({ pathname: "/results", query: { score: score.toString(), tableData: JSON.stringify(tableData) } });
>>>>>>> 3dcec4d (Added Demo Round)
=======
          toast.success(`Test submitted with score: ${score}`, {
            position: "top-center",
            onClose: () => {
              if (router && router.push) {
                router.push({
                  pathname: "/results",
                  query: {
                    score: score.toString(),
                    tableData: JSON.stringify(tableData),
                  },
                });
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
=======
                router.push(
                  `/reading-proficiency/results?${queryParams.toString()}`
                );
>>>>>>> 143db2a (feat: Add ReadingProficiencyResults component and enhance TestResults with score distribution logic)
              }
            },
          });
        }
        return { success: true, score };
      } else {
        toast.error(t("failedToSubmitTestPleaseTryAgain"));
        return { success: false, score: 0 };
      }
    } catch (error) {
      console.error("Full error details:", error);
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
      toast.error(
        t("anErrorOccurredWhileSubmittingTheTestPleaseTryAgain") ||
          t("errorOccurred")
      );
<<<<<<< HEAD
=======
      toast.error(t("anErrorOccurredWhileSubmittingTheTestPleaseTryAgain") || t("errorOccurred"));
>>>>>>> 3dcec4d (Added Demo Round)
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
      return { success: false, score: 0 };
    }
  };
  return { testResults, submitTest };
};

export default function Test6Controller({
  suppressResultPage = false,
  onComplete,
  suppressTutorial = false,
}) {
  const { language, t } = useLanguage();
  const router = useRouter();

  const [currentScreen, setCurrentScreen] = useState(
    suppressTutorial ? "instructionsScreen" : "tutorial"
  );
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

<<<<<<< HEAD
<<<<<<< HEAD
  const [demoWords, setDemoWords] = useState([]);
  const [isDemoCorrect, setIsDemoCorrect] = useState(null);
  const [demoUserTranscript, setDemoUserTranscript] = useState("");
  const [demoFeedback, setDemoFeedback] = useState("");
  const [isDemoTranscriptionAttempted, setIsDemoTranscriptionAttempted] =
    useState(false);
  const [demoAudioBlob, setDemoAudioBlob] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
=======
  const [demoWords, setDemoWords] = useState([]); 
=======
  const [demoWords, setDemoWords] = useState([]);
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
  const [isDemoCorrect, setIsDemoCorrect] = useState(null);
  const [demoUserTranscript, setDemoUserTranscript] = useState("");
  const [demoFeedback, setDemoFeedback] = useState("");
  const [isDemoTranscriptionAttempted, setIsDemoTranscriptionAttempted] =
    useState(false);
  const [demoAudioBlob, setDemoAudioBlob] = useState(null);

<<<<<<< HEAD
  const [selectedFile, setSelectedFile] = useState(null); 
>>>>>>> 3dcec4d (Added Demo Round)
=======
  const [selectedFile, setSelectedFile] = useState(null);
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
  const [showEels, setShowEels] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [coralineVisible, setCoralineVisible] = useState(!suppressTutorial);
  const [coralineAnimationState, setCoralineAnimationState] = useState("idle");
  const [introMessage, setIntroMessage] = useState("");
  const [gameProgress, setGameProgress] = useState(0);
<<<<<<< HEAD
<<<<<<< HEAD
  const [gameState, setGameState] = useState(
    suppressTutorial ? "instructionsScreen" : "intro"
  );
=======
  const [gameState, setGameState] = useState(suppressTutorial ? "instructionsScreen" : "intro");
>>>>>>> 3dcec4d (Added Demo Round)
=======
  const [gameState, setGameState] = useState(
    suppressTutorial ? "instructionsScreen" : "intro"
  );
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
  const [tutorialPhase, setTutorialPhase] = useState(0);

  const [currentWords, setCurrentWords] = useState([]);
  const [wordShells, setWordShells] = useState([]);
  const [wordsPerBatch] = useState(12);
  const [allTranscriptions, setAllTranscriptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const tutorialMessages = useMemo(
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    () =>
      [
        t("tutorialHelloExplorer"),
        t("tutorialCoralineIntro"),
        t("tutorialGlyphReefDescription"),
        t("tutorialReadingTask"),
        t("tutorialDifficulty"),
        t("tutorialShellOfFluency"),
        t("tutorialCoralSpyglass"),
        t("tutorialLetsGetReading"),
        t("tutorialReadyForMission"),
      ].filter(Boolean),
<<<<<<< HEAD
=======
    () => [
      t("tutorialHelloExplorer"), t("tutorialCoralineIntro"), t("tutorialGlyphReefDescription"),
      t("tutorialReadingTask"), t("tutorialDifficulty"), t("tutorialShellOfFluency"),
      t("tutorialCoralSpyglass"), t("tutorialLetsGetReading"), t("tutorialReadyForMission"),
    ].filter(Boolean),
>>>>>>> 3dcec4d (Added Demo Round)
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    [t]
  );

  const {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    transcript,
    isTranscribing,
    transcriptionReady,
    transcribeAudio,
    setTranscript: setGlobalTranscript,
<<<<<<< HEAD
=======
    transcript, isTranscribing, transcriptionReady, transcribeAudio,
    setTranscript: setGlobalTranscript, 
>>>>>>> 3dcec4d (Added Demo Round)
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    setTranscriptionReady: setGlobalTranscriptionReady,
  } = useTranscriptionService(t, language);

  const { submitTest } = useTestSubmission(onComplete, router, t);
<<<<<<< HEAD
<<<<<<< HEAD

  const { isRecording, startRecording, stopRecording } = useAudioRecorder(
    (audioBlob) => {
      if (currentScreen === "demo") {
        setDemoAudioBlob(audioBlob);
        toast.info(
          t("audioRecordedForDemo") ||
            "Audio recorded. Click 'Submit Demo Answer'."
        );
      } else if (currentScreen === "mainTest") {
        transcribeAudio(audioBlob).then((mainTestTranscript) => {
          // Pass full word list by default
          if (mainTestTranscript !== null) {
            setAllTranscriptions((prev) => {
              const newTranscriptions = [...prev];
              newTranscriptions[currentPage] = mainTestTranscript;
              return newTranscriptions;
            });
            glowCorrectWords(mainTestTranscript);
            setCoralineAnimationState("happy");
            setIntroMessage(t("coralineHeardClearly"));
          } else {
            setCoralineAnimationState("confused");
            setIntroMessage(t("coralineCouldntMakeOut"));
          }
        });
      }
=======
  
=======

>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
  const { isRecording, startRecording, stopRecording } = useAudioRecorder(
    (audioBlob) => {
      if (currentScreen === "demo") {
        setDemoAudioBlob(audioBlob);
        toast.info(
          t("audioRecordedForDemo") ||
            "Audio recorded. Click 'Submit Demo Answer'."
        );
      } else if (currentScreen === "mainTest") {
        transcribeAudio(audioBlob).then((mainTestTranscript) => {
          // Pass full word list by default
          if (mainTestTranscript !== null) {
            setAllTranscriptions((prev) => {
              const newTranscriptions = [...prev];
              newTranscriptions[currentPage] = mainTestTranscript;
              return newTranscriptions;
            });
<<<<<<< HEAD
        }
>>>>>>> 3dcec4d (Added Demo Round)
=======
            glowCorrectWords(mainTestTranscript);
            setCoralineAnimationState("happy");
            setIntroMessage(t("coralineHeardClearly"));
          } else {
            setCoralineAnimationState("confused");
            setIntroMessage(t("coralineCouldntMakeOut"));
          }
        });
      }
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    }
  );

  useEffect(() => {
    const langWordList = wordLists[language] || wordLists.en || [];
    if (langWordList.length > 0) {
<<<<<<< HEAD
<<<<<<< HEAD
      setDemoWords(langWordList.slice(0, 6));
    } else {
      setDemoWords(["apple", "ball", "cat", "dog", "egg", "fish"]);
=======
      setDemoWords(langWordList.slice(0, 6)); 
    } else {
      setDemoWords(["apple", "ball", "cat", "dog", "egg", "fish"]); 
>>>>>>> 3dcec4d (Added Demo Round)
=======
      setDemoWords(langWordList.slice(0, 6));
    } else {
      setDemoWords(["apple", "ball", "cat", "dog", "egg", "fish"]);
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
      console.warn("No word list found for demo words, using fallback.");
    }
  }, [language]);

  useEffect(() => {
    if (currentScreen === "mainTest" && gameState === "active") {
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
          Math.round(
            (wordsPerBatch / words.length) *
              100 *
              (1 / Math.ceil(words.length / wordsPerBatch)) *
              0.85
          )
        );
      } else {
        setGameProgress(0);
      }
    }
  }, [language, currentScreen, gameState, wordsPerBatch]);

  useEffect(() => {
    if (currentScreen === "tutorial" && tutorialMessages.length > 0) {
      setCoralineVisible(true);
      setCoralineAnimationState("entering");
      setTutorialPhase(0);
      setIntroMessage(tutorialMessages[0]);
    } else if (currentScreen !== "tutorial") {
<<<<<<< HEAD
<<<<<<< HEAD
      setCoralineVisible(false);
    }
  }, [currentScreen, tutorialMessages, t]);
=======
        setCoralineVisible(false);
    }
  }, [currentScreen, tutorialMessages, t]);

>>>>>>> 3dcec4d (Added Demo Round)

=======
      setCoralineVisible(false);
    }
  }, [currentScreen, tutorialMessages, t]);

>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
  const handleNextTutorialStep = () => {
    if (tutorialPhase < tutorialMessages.length - 1) {
      const nextPhase = tutorialPhase + 1;
      setTutorialPhase(nextPhase);
      setIntroMessage(tutorialMessages[nextPhase]);
<<<<<<< HEAD
<<<<<<< HEAD
      if (nextPhase === tutorialMessages.length - 2)
        setCoralineAnimationState("happy");
=======
      if (nextPhase === tutorialMessages.length - 2) setCoralineAnimationState("happy");
>>>>>>> 3dcec4d (Added Demo Round)
=======
      if (nextPhase === tutorialMessages.length - 2)
        setCoralineAnimationState("happy");
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    }
  };

  const handleTutorialComplete = () => {
    setCurrentScreen("instructionsScreen");
<<<<<<< HEAD
<<<<<<< HEAD
    setGameState("instructionsScreen");
    setCoralineVisible(false);
  };

  const handleStartDemo = () => {
    setCurrentScreen("demo");
    setGameState("demo");
    setIsDemoCorrect(null);
    setDemoUserTranscript("");
    setDemoFeedback("");
    setGlobalTranscript("");
    setGlobalTranscriptionReady(false);
    setIsDemoTranscriptionAttempted(false);
    setDemoAudioBlob(null);
    if (isRecording) stopRecording();
  };

  const handleDemoFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setDemoAudioBlob(file);
      toast.info(
        t("fileSelectedForDemo") || "File selected. Click 'Submit Demo Answer'."
      );
      setIsDemoTranscriptionAttempted(false);
      setDemoUserTranscript("");
      setDemoFeedback("");
      setIsDemoCorrect(null);
    }
  };

  const handleDemoSubmit = async () => {
    if (!demoAudioBlob) {
      toast.info(
        t("noAudioForDemo") || "Please record or upload audio for the demo."
      );
      return;
    }
    if (isTranscribing) return;
    setIsDemoTranscriptionAttempted(true);
    const transcribedText = await transcribeAudio(demoAudioBlob, demoWords);
    setDemoUserTranscript(transcribedText || "");

    if (transcribedText !== null && demoWords.length > 0) {
      const cleanedUserWords = (transcribedText || "")
        .toLowerCase()
        .trim()
        .replace(/[.,!?;:"']/g, "")
        .split(/\s+/)
        .filter(Boolean);
      const cleanedDemoWordsArray = demoWords.map((word) =>
        (word || "")
          .toLowerCase()
          .trim()
          .replace(/[.,!?;:"']/g, "")
      );
      let allMatch = false;
      // Strict check: user's transcript must exactly match the demo words joined by space
      // const userSequence = cleanedUserWords.join(" ");
      // const demoSequence = cleanedDemoWordsArray.join(" ");
      // if (userSequence === demoSequence) {
      //    allMatch = true;
      // }

      // Less strict: check if all demo words are present, in order, allowing for extra user words in between or at ends
      let currentDemoWordIndex = 0;
      for (const userWord of cleanedUserWords) {
        if (
          currentDemoWordIndex < cleanedDemoWordsArray.length &&
          userWord === cleanedDemoWordsArray[currentDemoWordIndex]
        ) {
          currentDemoWordIndex++;
        }
      }
      if (currentDemoWordIndex === cleanedDemoWordsArray.length) {
        allMatch = true;
      }

      if (allMatch) {
        setIsDemoCorrect(true);
        setDemoFeedback(t("demoAllWordsCorrectMessage"));
      } else {
        setIsDemoCorrect(false);
        setDemoFeedback(
          t("demoSomeWordsIncorrectMessage", { words: demoWords.join(", ") })
        );
      }
    } else {
      setIsDemoCorrect(false);
      setDemoFeedback(t("transcriptionFailedTryAgain"));
    }
    setDemoAudioBlob(null);
  };

  const handleDemoRetry = () => {
    setIsDemoCorrect(null);
    setDemoUserTranscript("");
    setDemoFeedback("");
    setGlobalTranscript("");
    setGlobalTranscriptionReady(false);
    setIsDemoTranscriptionAttempted(false);
    setDemoAudioBlob(null);
    if (isRecording) stopRecording();
  };

  const handleProceedToMainTest = () => {
    setCurrentScreen("mainTest");
    setGameState("active");
    setGlobalTranscript("");
    setGlobalTranscriptionReady(false);
    setSelectedFile(null);
    setAllTranscriptions([]);
    setCurrentPage(0);
    setGameProgress(0);
    if (isRecording) stopRecording();
  };

  const handleMainTestFileUpload = async (event) => {
=======
    setGameState("instructionsScreen"); 
    setCoralineVisible(false); 
=======
    setGameState("instructionsScreen");
    setCoralineVisible(false);
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
  };

  const handleStartDemo = () => {
    setCurrentScreen("demo");
    setGameState("demo");
    setIsDemoCorrect(null);
    setDemoUserTranscript("");
    setDemoFeedback("");
    setGlobalTranscript("");
    setGlobalTranscriptionReady(false);
    setIsDemoTranscriptionAttempted(false);
    setDemoAudioBlob(null);
    if (isRecording) stopRecording();
  };

  const handleDemoFileUpload = async (event) => {
>>>>>>> 3dcec4d (Added Demo Round)
    const file = event.target.files[0];
    if (file) {
      setDemoAudioBlob(file);
      toast.info(
        t("fileSelectedForDemo") || "File selected. Click 'Submit Demo Answer'."
      );
      setIsDemoTranscriptionAttempted(false);
      setDemoUserTranscript("");
      setDemoFeedback("");
      setIsDemoCorrect(null);
    }
  };

  const handleDemoSubmit = async () => {
    if (!demoAudioBlob) {
      toast.info(
        t("noAudioForDemo") || "Please record or upload audio for the demo."
      );
      return;
    }
    if (isTranscribing) return;
    setIsDemoTranscriptionAttempted(true);
    const transcribedText = await transcribeAudio(demoAudioBlob, demoWords);
    setDemoUserTranscript(transcribedText || "");

    if (transcribedText !== null && demoWords.length > 0) {
      const cleanedUserWords = (transcribedText || "")
        .toLowerCase()
        .trim()
        .replace(/[.,!?;:"']/g, "")
        .split(/\s+/)
        .filter(Boolean);
      const cleanedDemoWordsArray = demoWords.map((word) =>
        (word || "")
          .toLowerCase()
          .trim()
          .replace(/[.,!?;:"']/g, "")
      );
      let allMatch = false;
      // Strict check: user's transcript must exactly match the demo words joined by space
      // const userSequence = cleanedUserWords.join(" ");
      // const demoSequence = cleanedDemoWordsArray.join(" ");
      // if (userSequence === demoSequence) {
      //    allMatch = true;
      // }

      // Less strict: check if all demo words are present, in order, allowing for extra user words in between or at ends
      let currentDemoWordIndex = 0;
      for (const userWord of cleanedUserWords) {
        if (
          currentDemoWordIndex < cleanedDemoWordsArray.length &&
          userWord === cleanedDemoWordsArray[currentDemoWordIndex]
        ) {
          currentDemoWordIndex++;
        }
      }
      if (currentDemoWordIndex === cleanedDemoWordsArray.length) {
        allMatch = true;
      }

      if (allMatch) {
        setIsDemoCorrect(true);
        setDemoFeedback(t("demoAllWordsCorrectMessage"));
      } else {
        setIsDemoCorrect(false);
        setDemoFeedback(
          t("demoSomeWordsIncorrectMessage", { words: demoWords.join(", ") })
        );
      }
    } else {
      setIsDemoCorrect(false);
      setDemoFeedback(t("transcriptionFailedTryAgain"));
    }
    setDemoAudioBlob(null);
  };

  const handleDemoRetry = () => {
    setIsDemoCorrect(null);
    setDemoUserTranscript("");
    setDemoFeedback("");
    setGlobalTranscript("");
    setGlobalTranscriptionReady(false);
    setIsDemoTranscriptionAttempted(false);
    setDemoAudioBlob(null);
    if (isRecording) stopRecording();
  };

  const handleProceedToMainTest = () => {
    setCurrentScreen("mainTest");
    setGameState("active");
    setGlobalTranscript("");
    setGlobalTranscriptionReady(false);
    setSelectedFile(null);
    setAllTranscriptions([]);
    setCurrentPage(0);
    setGameProgress(0);
    if (isRecording) stopRecording();
  };

  const handleMainTestFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setCoralineAnimationState("excited");
      setIntroMessage(t("coralineExcellentRecording"));
<<<<<<< HEAD
<<<<<<< HEAD
      const mainTestTranscript = await transcribeAudio(file);
=======
      const mainTestTranscript = await transcribeAudio(file); 
>>>>>>> 3dcec4d (Added Demo Round)
=======
      const mainTestTranscript = await transcribeAudio(file);
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
      if (mainTestTranscript !== null) {
        setAllTranscriptions((prev) => {
          const newTranscriptions = [...prev];
          newTranscriptions[currentPage] = mainTestTranscript;
          return newTranscriptions;
        });
        setCoralineAnimationState("happy");
        setIntroMessage(t("coralineHeardClearly"));
        const progress = Math.min(
          Math.round(
            ((currentPage + 1) /
              Math.ceil(currentWords.length / wordsPerBatch)) *
              85
          ),
          85
        );
        setGameProgress(progress);
        glowCorrectWords(mainTestTranscript);
      } else {
        setCoralineAnimationState("confused");
        setIntroMessage(t("coralineCouldntMakeOut"));
      }
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
      setTimeout(() => {
        setCoralineAnimationState("idle");
        setIntroMessage("");
      }, 4000);
<<<<<<< HEAD
=======
      setTimeout(() => { setCoralineAnimationState("idle"); setIntroMessage(""); }, 4000);
>>>>>>> 3dcec4d (Added Demo Round)
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    }
  };

  const glowCorrectWords = (textToGlow) => {
    if (!textToGlow) return;
    const spokenWords = textToGlow.toLowerCase().split(" ");
    setWordShells((prev) =>
      prev.map((shell) => ({
        ...shell,
        glowing: spokenWords.includes(shell.word.toLowerCase()),
      }))
    );
    setTimeout(() => {
<<<<<<< HEAD
<<<<<<< HEAD
      setWordShells((prev) =>
        prev.map((shell) => ({ ...shell, glowing: false }))
      );
=======
      setWordShells((prev) => prev.map((shell) => ({ ...shell, glowing: false })) );
>>>>>>> 3dcec4d (Added Demo Round)
=======
      setWordShells((prev) =>
        prev.map((shell) => ({ ...shell, glowing: false }))
      );
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    }, 3000);
  };

  const handleSubmitPageOrTest = async () => {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
=======
    const isLastPage = (currentPage + 1) * wordsPerBatch >= currentWords.length;

>>>>>>> bd0fdc9 (feat: Refactor TestSessionView and Test6Controller for improved button logic and add TestResults component)
    let currentTranscriptForPageToSubmit = transcript;
    if (selectedFile && allTranscriptions[currentPage]) {
      currentTranscriptForPageToSubmit = allTranscriptions[currentPage];
    } else if (allTranscriptions[currentPage]) {
      currentTranscriptForPageToSubmit = allTranscriptions[currentPage];
<<<<<<< HEAD
=======
    let currentTranscriptForPageToSubmit = transcript; 
    if (selectedFile && allTranscriptions[currentPage]) { 
        currentTranscriptForPageToSubmit = allTranscriptions[currentPage];
    } else if (allTranscriptions[currentPage]) { 
        currentTranscriptForPageToSubmit = allTranscriptions[currentPage];
>>>>>>> 3dcec4d (Added Demo Round)
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    }
<<<<<<< HEAD
    if (
      isLastPage &&
      !transcriptionReady &&
      !currentTranscriptForPageToSubmit
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
=======
    if (!transcriptionReady && !currentTranscriptForPageToSubmit) {
      //   toast.info(t("transcriptionNotReady"));
      //   setShowEels(true);
      //   setCoralineAnimationState("warning");
      //   setIntroMessage(t("coralineNeedYourVoice"));
      //   setTimeout(() => {
      //     setShowEels(false);
      //     setCoralineAnimationState("idle");
      //     setIntroMessage("");
      //   }, 3000);
      //   return;
>>>>>>> 143db2a (feat: Add ReadingProficiencyResults component and enhance TestResults with score distribution logic)
    }
    const updatedAllTranscriptions = [...allTranscriptions];
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    if (
      currentTranscriptForPageToSubmit &&
      !updatedAllTranscriptions[currentPage]
    ) {
      updatedAllTranscriptions[currentPage] = currentTranscriptForPageToSubmit;
      setAllTranscriptions(updatedAllTranscriptions);
<<<<<<< HEAD
=======
    if (currentTranscriptForPageToSubmit && !updatedAllTranscriptions[currentPage]) {
        updatedAllTranscriptions[currentPage] = currentTranscriptForPageToSubmit;
        setAllTranscriptions(updatedAllTranscriptions);
>>>>>>> 3dcec4d (Added Demo Round)
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
    }

    if (isLastPage) {
      setCoralineAnimationState("focused");
      setIntroMessage(t("coralineCheckingPronunciation"));
      setGameProgress(85);
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
      const combinedTranscript = updatedAllTranscriptions
        .filter(Boolean)
        .join(" ");
      const { success, score } = await submitTest(
        combinedTranscript.trim(),
        suppressResultPage,
        language
      );
<<<<<<< HEAD
      if (success) {
        setGameProgress(100);
        if (onComplete && typeof onComplete === "function") onComplete(score);
        if (!suppressResultPage) {
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
=======
      const combinedTranscript = updatedAllTranscriptions.filter(Boolean).join(" ");
      const { success, score } = await submitTest(combinedTranscript.trim(), suppressResultPage, language);
      if (success) {
        setGameProgress(100);
        if (onComplete && typeof onComplete === "function") onComplete(score); 
        if (!suppressResultPage) { 
            if (score >= 70) {
                setGameState("success"); setCoralineAnimationState("celebrating"); setShowReward(true);
                setIntroMessage(t("coralineExcellentJob"));
                setTimeout(() => { setCoralineAnimationState("happy"); setIntroMessage(t("coralineRewardUnlocked")); }, 3000);
            } else {
                setCoralineAnimationState("encouraging"); setIntroMessage(t("coralineGoodEffort"));
            }
>>>>>>> 3dcec4d (Added Demo Round)
=======
      if (success) {
        setGameProgress(100);
        if (onComplete && typeof onComplete === "function") onComplete(score);
        if (!suppressResultPage) {
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
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
        }
      } else {
        setCoralineAnimationState("confused");
        setIntroMessage(t("coralineReefMagicError"));
      }
    } else {
      setCurrentPage((prev) => prev + 1);
<<<<<<< HEAD
<<<<<<< HEAD
      setGlobalTranscript("");
      setGlobalTranscriptionReady(false);
      setSelectedFile(null);
      const newProgress = Math.min(
        Math.round(
          (((currentPage + 2) * wordsPerBatch) / currentWords.length) * 85
        ),
        85
      );
      setGameProgress(newProgress);
      setCoralineAnimationState("happy");
      setIntroMessage(t("coralineNextPage"));
      setTimeout(() => {
        setCoralineAnimationState("idle");
        setIntroMessage("");
      }, 2000);
=======
      setGlobalTranscript(""); 
=======
      setGlobalTranscript("");
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
      setGlobalTranscriptionReady(false);
      setSelectedFile(null);
      const newProgress = Math.min(
        (((currentPage + 2) * wordsPerBatch) / currentWords.length) * 85,
        85
      );
      setGameProgress(newProgress);
<<<<<<< HEAD
      setCoralineAnimationState("happy"); setIntroMessage(t("coralineNextPage"));
      setTimeout(() => { setCoralineAnimationState("idle"); setIntroMessage(""); }, 2000);
>>>>>>> 3dcec4d (Added Demo Round)
=======
      setCoralineAnimationState("happy");
      setIntroMessage(t("coralineNextPage"));
      setTimeout(() => {
        setCoralineAnimationState("idle");
        setIntroMessage("");
      }, 2000);
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
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

  const commonHeaderButtons = (
    <>
      <Link
        href="/take-tests?skipStart=true"
        className="absolute top-4 left-4 z-[55] flex items-center gap-2 bg-white/80 hover:bg-white text-teal-800 font-medium py-2 px-3 rounded-full shadow-md transition-all"
      >
        {" "}
        <ChevronLeft className="h-5 w-5" />{" "}
        <span className="hidden sm:inline">{t("backToMap")}</span>
      </Link>
      {currentScreen !== "instructionsScreen" && (
        <button
          onClick={() => setShowInstructionsModal(true)}
          className="absolute top-4 right-4 z-[55] flex items-center gap-2 bg-white/80 hover:bg-white text-teal-800 font-medium py-2 px-3 rounded-full shadow-md transition-all"
          aria-label={t("instructionsButtonLabel")}
        >
          {" "}
          <HelpCircle className="h-5 w-5" />{" "}
          <span className="hidden sm:inline">
            {t("instructionsButtonLabel")}
          </span>
        </button>
      )}
    </>
  );

<<<<<<< HEAD
<<<<<<< HEAD
  const commonHeaderButtons = (
    <>
      <Link
        href="/taketests"
        className="absolute top-4 left-4 z-[55] flex items-center gap-2 bg-white/80 hover:bg-white text-teal-800 font-medium py-2 px-3 rounded-full shadow-md transition-all"
      >
        {" "}
        <ChevronLeft className="h-5 w-5" />{" "}
        <span className="hidden sm:inline">{t("backToTests")}</span>
      </Link>
      {currentScreen !== "instructionsScreen" && (
        <button
          onClick={() => setShowInstructionsModal(true)}
          className="absolute top-4 right-4 z-[55] flex items-center gap-2 bg-white/80 hover:bg-white text-teal-800 font-medium py-2 px-3 rounded-full shadow-md transition-all"
          aria-label={t("instructionsButtonLabel")}
        >
          {" "}
          <HelpCircle className="h-5 w-5" />{" "}
          <span className="hidden sm:inline">
            {t("instructionsButtonLabel")}
          </span>
        </button>
      )}
    </>
  );

=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
  if (
    !t ||
    (currentScreen === "tutorial" &&
      tutorialMessages.length === 0 &&
      !suppressTutorial) ||
    (currentScreen === "demo" && demoWords.length === 0)
  ) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 text-teal-700">
        Loading resources...
      </div>
    );
<<<<<<< HEAD
  }

  let screenContent;
  if (currentScreen === "tutorial") {
    screenContent = (
      <>
        {" "}
        {commonHeaderButtons}{" "}
        <TutorialView
          tutorialMessages={tutorialMessages}
          tutorialPhase={tutorialPhase}
          handleNextTutorialStep={handleNextTutorialStep}
          onTutorialComplete={handleTutorialComplete}
          introMessage={introMessage}
          coralineImage={coralineImage.src || coralineImage}
          coralineAnimationState={coralineAnimationState}
          t={t}
        />{" "}
      </>
    );
  } else if (currentScreen === "instructionsScreen") {
    screenContent = (
      <>
        {" "}
        {commonHeaderButtons}{" "}
        <TestInstructionsScreen onStartDemo={handleStartDemo} t={t} />{" "}
      </>
    );
  } else if (currentScreen === "demo") {
    screenContent = (
      <>
        {" "}
        {commonHeaderButtons}{" "}
        <DemoRoundView
          demoWords={demoWords}
          ancientPaperImage={ancientPaper.src || ancientPaper}
          isRecording={isRecording}
          startRecording={() => {
            if (isRecording) stopRecording();
            setDemoAudioBlob(null);
            setIsDemoTranscriptionAttempted(false);
            setIsDemoCorrect(null);
            setDemoUserTranscript("");
            setDemoFeedback("");
            startRecording();
          }}
          stopRecording={stopRecording}
          handleFileUpload={handleDemoFileUpload}
          onSubmit={handleDemoSubmit}
          onRetry={handleDemoRetry}
          onProceedToMainTest={handleProceedToMainTest}
          isTranscribing={isTranscribing}
          userTranscript={demoUserTranscript}
          isDemoCorrect={isDemoCorrect}
          demoFeedback={demoFeedback}
          t={t}
          isTranscriptionAttempted={isDemoTranscriptionAttempted}
        />{" "}
      </>
    );
  } else if (currentScreen === "mainTest") {
    screenContent = (
      <>
        {" "}
        {commonHeaderButtons}{" "}
        <TestSessionView
          gameProgress={gameProgress}
          currentPage={currentPage}
          currentWordsLength={currentWords.length}
          wordsPerBatch={wordsPerBatch}
          ancientPaperImage={ancientPaper.src || ancientPaper}
          visibleWords={visibleWords}
          isRecording={isRecording}
          startRecording={() => {
            setSelectedFile(null);
            setGlobalTranscript("");
            setGlobalTranscriptionReady(false);
            if (isRecording) stopRecording();
            startRecording();
          }}
          stopRecording={stopRecording}
          showEels={showEels}
          handleFileUpload={handleMainTestFileUpload}
          handleSubmitPageOrTest={handleSubmitPageOrTest}
          isTranscribing={isTranscribing}
          transcriptionReady={
            transcriptionReady ||
            (selectedFile && allTranscriptions[currentPage])
          }
          t={t}
          coralineImageForEels={coralineImage.src || coralineImage}
        />{" "}
      </>
    );
  }

=======
  if (!t || (currentScreen === "tutorial" && tutorialMessages.length === 0 && !suppressTutorial) || (currentScreen === "demo" && demoWords.length === 0)) {
    return <div className="fixed inset-0 flex items-center justify-center bg-gray-100 text-teal-700">Loading resources...</div>;
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
  }

  let screenContent;
  if (currentScreen === "tutorial") {
    screenContent = (
      <>
        {" "}
        {commonHeaderButtons}{" "}
        <TutorialView
          tutorialMessages={tutorialMessages}
          tutorialPhase={tutorialPhase}
          handleNextTutorialStep={handleNextTutorialStep}
          onTutorialComplete={handleTutorialComplete}
          introMessage={introMessage}
          coralineImage={coralineImage.src || coralineImage}
          coralineAnimationState={coralineAnimationState}
          t={t}
        />{" "}
      </>
    );
  } else if (currentScreen === "instructionsScreen") {
    screenContent = (
      <>
        {" "}
        {commonHeaderButtons}{" "}
        <TestInstructionsScreen onStartDemo={handleStartDemo} t={t} />{" "}
      </>
    );
  } else if (currentScreen === "demo") {
    screenContent = (
      <>
        {" "}
        {commonHeaderButtons}{" "}
        <DemoRoundView
          demoWords={demoWords}
          ancientPaperImage={ancientPaper.src || ancientPaper}
          isRecording={isRecording}
          startRecording={() => {
            if (isRecording) stopRecording();
            setDemoAudioBlob(null);
            setIsDemoTranscriptionAttempted(false);
            setIsDemoCorrect(null);
            setDemoUserTranscript("");
            setDemoFeedback("");
            startRecording();
          }}
          stopRecording={stopRecording}
          handleFileUpload={handleDemoFileUpload}
          onSubmit={handleDemoSubmit}
          onRetry={handleDemoRetry}
          onProceedToMainTest={handleProceedToMainTest}
          isTranscribing={isTranscribing}
          userTranscript={demoUserTranscript}
          isDemoCorrect={isDemoCorrect}
          demoFeedback={demoFeedback}
          t={t}
          isTranscriptionAttempted={isDemoTranscriptionAttempted}
        />{" "}
      </>
    );
  } else if (currentScreen === "mainTest") {
    screenContent = (
      <>
        {" "}
        {commonHeaderButtons}{" "}
        <TestSessionView
          gameProgress={gameProgress}
          currentPage={currentPage}
          currentWordsLength={currentWords.length}
          wordsPerBatch={wordsPerBatch}
          ancientPaperImage={ancientPaper.src || ancientPaper}
          visibleWords={visibleWords}
          isRecording={isRecording}
          startRecording={() => {
            setSelectedFile(null);
            setGlobalTranscript("");
            setGlobalTranscriptionReady(false);
            if (isRecording) stopRecording();
            startRecording();
          }}
          stopRecording={stopRecording}
          showEels={showEels}
          handleFileUpload={handleMainTestFileUpload}
          handleSubmitPageOrTest={handleSubmitPageOrTest}
          isTranscribing={isTranscribing}
          transcriptionReady={
            transcriptionReady ||
            (selectedFile && allTranscriptions[currentPage])
          }
          t={t}
          coralineImageForEels={coralineImage.src || coralineImage}
        />{" "}
      </>
    );
  }

>>>>>>> 3dcec4d (Added Demo Round)
  return (
    <div
      className="fixed inset-0 overflow-y-auto flex items-center justify-center p-1 sm:p-4 md:p-8 bg-cover bg-center"
      style={backgroundStyle}
    >
      {screenContent}
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
      <InstructionsModal
        isOpen={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
        t={t}
      />
<<<<<<< HEAD
      <AnimatePresence>
        {showReward && currentScreen === "mainTest" && (
          <RewardView
            shellImage={shellImage.src || shellImage}
            onClose={() => setShowReward(false)}
            t={t}
          />
=======
      <InstructionsModal isOpen={showInstructionsModal} onClose={() => setShowInstructionsModal(false)} t={t} />
      <AnimatePresence>
        {showReward && currentScreen === "mainTest" && (
          <RewardView shellImage={shellImage.src || shellImage} onClose={() => setShowReward(false)} t={t} />
>>>>>>> 3dcec4d (Added Demo Round)
=======
      <AnimatePresence>
        {showReward && currentScreen === "mainTest" && (
          <RewardView
            shellImage={shellImage.src || shellImage}
            onClose={() => setShowReward(false)}
            t={t}
          />
>>>>>>> f6455aa (chore: clean up unused components and files in reading proficiency tests)
        )}
      </AnimatePresence>
      <ToastContainer position="top-center" autoClose={3000} newestOnTop />
    </div>
  );
}
