"use client";

import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import wordLists from "src/Data/wordLists.json"; // Assuming in the same directory
import ancientPaper from "../../../../public/reading-test/ancientPaper.png"; // Adjust path
import coralBackground from "../../../../public/reading-test/coralBackground.png"; // Adjust path
import coralineImage from "../../../../public/reading-test/coralineImage.png"; // Adjust path
import shellImage from "../../../../public/reading-test/shellImage.png"; // Adjust path
import { useLanguage } from "../../../contexts/LanguageContext"; // Adjust path if needed
import { improveTranscriptionAccuracy } from "./accuracyImprover"; // Assuming in the same directory
import DemoRoundView from "./DemoRoundView";
import InstructionsModal from "./InstructionsModal";
import RewardView from "./RewardView";
import TestInstructionsScreen from "./TestInstructionsScreen";
import TestSessionView from "./TestSessionView";
import TutorialView from "./TutorialView";

const useAudioRecorder = (onAudioRecorded) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          stream.getTracks().forEach((track) => track.stop());
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
      toast.error(
        "Audio recording is not supported on this browser or connection."
      );
      setIsRecording(false);
      return;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
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
            localAudioChunks = [];
          }
        };
        newMediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
        toast.error(
          "Could not start recording. Please check microphone permissions."
        );
        setIsRecording(false);
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => track.stop());
          localStreamRef.current = null;
        }
      });
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    setIsRecording(false);
  };
  return { isRecording, startRecording, stopRecording };
};

const useTranscriptionService = (t, language) => {
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionReady, setTranscriptionReady] = useState(false);

  const transcribeAudio = async (
    audioBlob,
    targetWordsForCorrectionList = null
  ) => {
    if (!audioBlob) {
      toast.error(t("noAudioToTranscribe") || "No audio data to transcribe.");
      return null;
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
    setTranscript("");

    try {
      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        const rawTranscript = result.transcription;
        const correctionList =
          targetWordsForCorrectionList || wordLists[language] || wordLists.en;
        const safeTargetWords = Array.isArray(correctionList)
          ? correctionList
          : [];
        const correctedTranscript = improveTranscriptionAccuracy(
          rawTranscript || "",
          safeTargetWords
        );
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
};
//vimalchangesdonehere
const useTestSubmission = (onTestComplete, router, t) => {
  const [testResults, setTestResults] = useState([]);
  const submitTest = async (
  transcriptToSubmit,
  suppressResultPage,
  language = "en"
) => {
  const spokenWords = transcriptToSubmit.trim().toLowerCase();
  const childId = localStorage.getItem("childId") || null;
  const token = localStorage.getItem("access_token");

  if (!spokenWords) {
    toast.info(t("nothingToSubmit") || "Nothing to submit.");
    return { success: false, score: 0 };
  }

  try {
    const currentRoute = pathname; // make sure you get this via usePathname or pass as a prop

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
        ? correctGroups.map((g) => (Array.isArray(g) ? g : [g]))
        : [];
      const validErrorWords = Array.isArray(errorWords)
        ? errorWords.map((w) => (Array.isArray(w) ? w : [w]))
        : [];

      const tableData = validCorrectGroups.map((group, index) => ({
        continuousCorrectWords: group.join(" "),
        errorWords: validErrorWords[index]?.join(" ") || "",
        score: score / validCorrectGroups.length,
      }));

      setTestResults(tableData);

      if (suppressResultPage && typeof onTestComplete === "function") {
        onTestComplete(score);
      } else {
        toast.success(`Test submitted with score: ${score}`, {
          position: "top-center",
          onClose: () => {
            if (currentRoute !== "/dummy") {
              const queryParams = new URLSearchParams({
                score: score.toString(),
                tableData: JSON.stringify(tableData),
              });
              router.push(
                `/reading-proficiency/results?${queryParams.toString()}`
              );
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
    toast.error(
      t("anErrorOccurredWhileSubmittingTheTestPleaseTryAgain") ||
        t("errorOccurred")
    );
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

  const [demoWords, setDemoWords] = useState([]);
  const [isDemoCorrect, setIsDemoCorrect] = useState(null);
  const [demoUserTranscript, setDemoUserTranscript] = useState("");
  const [demoFeedback, setDemoFeedback] = useState("");
  const [isDemoTranscriptionAttempted, setIsDemoTranscriptionAttempted] =
    useState(false);
  const [demoAudioBlob, setDemoAudioBlob] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [showEels, setShowEels] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [coralineVisible, setCoralineVisible] = useState(!suppressTutorial);
  const [coralineAnimationState, setCoralineAnimationState] = useState("idle");
  const [introMessage, setIntroMessage] = useState("");
  const [gameProgress, setGameProgress] = useState(0);
  const [gameState, setGameState] = useState(
    suppressTutorial ? "instructionsScreen" : "intro"
  );
  const [tutorialPhase, setTutorialPhase] = useState(0);

  const [currentWords, setCurrentWords] = useState([]);
  const [wordShells, setWordShells] = useState([]);
  const [wordsPerBatch] = useState(12);
  const [allTranscriptions, setAllTranscriptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const tutorialMessages = useMemo(
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
    [t]
  );

  const {
    transcript,
    isTranscribing,
    transcriptionReady,
    transcribeAudio,
    setTranscript: setGlobalTranscript,
    setTranscriptionReady: setGlobalTranscriptionReady,
  } = useTranscriptionService(t, language);

  const { submitTest } = useTestSubmission(onComplete, router, t);

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
    }
  );

  useEffect(() => {
    const langWordList = wordLists[language] || wordLists.en || [];
    if (langWordList.length > 0) {
      setDemoWords(langWordList.slice(0, 6));
    } else {
      setDemoWords(["apple", "ball", "cat", "dog", "egg", "fish"]);
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
      setCoralineVisible(false);
    }
  }, [currentScreen, tutorialMessages, t]);

  const handleNextTutorialStep = () => {
    if (tutorialPhase < tutorialMessages.length - 1) {
      const nextPhase = tutorialPhase + 1;
      setTutorialPhase(nextPhase);
      setIntroMessage(tutorialMessages[nextPhase]);
      if (nextPhase === tutorialMessages.length - 2)
        setCoralineAnimationState("happy");
    }
  };

  const handleTutorialComplete = () => {
    setCurrentScreen("instructionsScreen");
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
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setCoralineAnimationState("excited");
      setIntroMessage(t("coralineExcellentRecording"));
      const mainTestTranscript = await transcribeAudio(file);
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
      setTimeout(() => {
        setCoralineAnimationState("idle");
        setIntroMessage("");
      }, 4000);
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
      setWordShells((prev) =>
        prev.map((shell) => ({ ...shell, glowing: false }))
      );
    }, 3000);
  };

  const handleSubmitPageOrTest = async () => {
    let currentTranscriptForPageToSubmit = transcript;
    if (selectedFile && allTranscriptions[currentPage]) {
      currentTranscriptForPageToSubmit = allTranscriptions[currentPage];
    } else if (allTranscriptions[currentPage]) {
      currentTranscriptForPageToSubmit = allTranscriptions[currentPage];
    }
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
    }
    const updatedAllTranscriptions = [...allTranscriptions];
    if (
      currentTranscriptForPageToSubmit &&
      !updatedAllTranscriptions[currentPage]
    ) {
      updatedAllTranscriptions[currentPage] = currentTranscriptForPageToSubmit;
      setAllTranscriptions(updatedAllTranscriptions);
    }
    const isLastPage = (currentPage + 1) * wordsPerBatch >= currentWords.length;
    if (isLastPage) {
      setCoralineAnimationState("focused");
      setIntroMessage(t("coralineCheckingPronunciation"));
      setGameProgress(85);
      const combinedTranscript = updatedAllTranscriptions
        .filter(Boolean)
        .join(" ");
      const { success, score } = await submitTest(
        combinedTranscript.trim(),
        suppressResultPage,
        language
      );
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
        }
      } else {
        setCoralineAnimationState("confused");
        setIntroMessage(t("coralineReefMagicError"));
      }
    } else {
      setCurrentPage((prev) => prev + 1);
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

  return (
    <div
      className="fixed inset-0 overflow-y-auto flex items-center justify-center p-1 sm:p-4 md:p-8 bg-cover bg-center"
      style={backgroundStyle}
    >
      {screenContent}
      <InstructionsModal
        isOpen={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
        t={t}
      />
      <AnimatePresence>
        {showReward && currentScreen === "mainTest" && (
          <RewardView
            shellImage={shellImage.src || shellImage}
            onClose={() => setShowReward(false)}
            t={t}
          />
        )}
      </AnimatePresence>
      <ToastContainer position="top-center" autoClose={3000} newestOnTop />
    </div>
  );
}
