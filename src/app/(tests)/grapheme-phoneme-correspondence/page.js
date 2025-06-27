// app/(tests)/grapheme-phoneme-correspondence/page.js
"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { AlertTriangle, Info as InfoIcon, Loader2 } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";

import graphemeLettersData from "../../../components/grapheme-test/graphemeLetters.json";
// LanguageProvider and useLanguage are used by GraphemeTestContent
import { LanguageProvider, useLanguage } from "../../../contexts/LanguageContext.jsx";

import localAppBackgroundImage from "../../../../public/grapheme-test/backgroundImage.webp";

import InfoDialog from "../../../components/grapheme-test/InfoDialog.jsx";
import PracticeInterface from "../../../components/grapheme-test/PracticeInterface";
import PracticeModal from "../../../components/grapheme-test/PracticeModal";
import ResultsScreen from "../../../components/grapheme-test/ResultScreen.jsx";
import SubmitScreen from "../../../components/grapheme-test/SubmitScreen.jsx";
import TestInterface from "../../../components/grapheme-test/TestInterface.jsx";
import { useGraphemeTestLogic } from "../../../components/grapheme-test/useGraphemeTestLogic.js";
import WelcomeDialog from "../../../components/grapheme-test/WelcomeDialog.jsx";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const LETTER_TIMER_DURATION = 8;
const DIALOG_TEXTS = [
  "🎶 Welcome, traveler, to Phoneme Point! The singing cliffs echo with melodies of sound and letter.",
  "🐦 We are Riff & Raff, twin songbirds and guardians of these luminous cliffs. Here, each note carries the spark of a letter's sound.",
  "🔤 Your task is to match the letters with the sounds they sing (or the other way around). Let the music of the cliffs guide you.",
  "🎼 In return, we shall grant you the Shell of Soundcraft and the Tune Torch, which reveals the silent letters in any word.",
  "Are you ready to let the cliffs sing you their secrets and find the harmony of letters and sounds?",
];

// This is the component that actually uses the language context and most of the logic
const GraphemeTestContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // This hook causes GraphemeTestContent to be dynamic
  const suppressResultPage = searchParams.get("suppressResultPage") === "true";

  const { language: contextLanguage, t: contextT } = useLanguage();

  const t = useMemo(() => {
    if (typeof contextT === 'function') return contextT;
    return (key, fallbackValue) => fallbackValue || key;
  }, [contextT]);

  const language = contextLanguage || 'en';
  const inputRef = useRef(null);

  const [letters, setLetters] = useState([]);
  const [firstLetterForPractice, setFirstLetterForPractice] = useState(null);
  const [langKey, setLangKey] = useState("english");

  const [testStage, setTestStage] = useState("loading_init");
  const [currentDialog, setCurrentDialog] = useState(0);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [scoreData, setScoreData] = useState({ score: 0, total: 0 });
  const [isProcessingFinalSubmit, setIsProcessingFinalSubmit] = useState(false);
  const [childId, setChildId] = useState(null);
  const [token, setToken] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [languageDataLoaded, setLanguageDataLoaded] = useState(false);
  
  const isTestUIVisible = useMemo(() => 
    testStage === "test" && letters.length > 0 && languageDataLoaded,
    [testStage, letters, languageDataLoaded]
  );
  
  const handleFullTestCompletionByHook = useCallback(() => {
    setTestStage("submit");
  }, []);

  const {
    currentIndex, timeLeft, userInputs, isRecording, inputStatus,
    handleInputChange, handleRecordButtonClick, handleNext,
    resetLogic: resetMainTestLogic,
  } = useGraphemeTestLogic({
    letters, LETTER_TIMER_DURATION, childId, language, backendURL, inputRef,
    onTestComplete: handleFullTestCompletionByHook, isTestUIVisible,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedChildId = localStorage.getItem("childId");
      const storedToken = localStorage.getItem("access_token");
      setChildId(storedChildId);
      setToken(storedToken);
      setInitialDataLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!initialDataLoaded || !language) return;

    setLanguageDataLoaded(false);
    const key = language === "ta" ? "tamil" : language === "hi" ? "hindi" : "english";
    setLangKey(key);
    const currentLangData = graphemeLettersData[key] || graphemeLettersData["english"];
    const currentLangLetters = currentLangData?.letters || [];

    if (currentLangLetters.length === 0) {
      console.warn(`No letters found for language: ${key}.`);
      toast.error(t("errorNoLettersForLang", `No test letters found for the selected language.`));
      setLetters([]);
      setFirstLetterForPractice(null);
    } else {
      setLetters(currentLangLetters);
      setFirstLetterForPractice(currentLangLetters.length > 0 ? currentLangLetters[0] : null);
    }
    
    if (testStage === "loading_init" || !languageDataLoaded) { // If initial load or language changed causing reload
        setTestStage("intro");
    } // Avoid resetting to intro if already past it and only minor language data re-fetch

    setCurrentDialog(0);
    setScoreData({ score: 0, total: 0 });
    setIsProcessingFinalSubmit(false);
    if (typeof resetMainTestLogic === 'function') {
        resetMainTestLogic();
    }
    setLanguageDataLoaded(true);
<<<<<<< HEAD

=======
>>>>>>> 97d04a7 (Refactor Grapheme and Picture Test Components)
  }, [language, initialDataLoaded, t, resetMainTestLogic, testStage]); // Added testStage to dependency to ensure correct re-intro logic

  const onCompleteHandler = useCallback(
    (finalScore) => {
      const scoreValue = typeof finalScore === 'object' ? finalScore.score : finalScore;
      toast.info(
        t("testCompletedWithScoreSuppressed", `Test completed: ${scoreValue}. Results page suppressed.`)
      );
      router.push("/take-tests?skipStart=true");
    },
    [router, t]
  );

  const handleNextIntroDialog = () => {
    if (!languageDataLoaded) {
        toast.warn(t("pleaseWaitLoadingLang", "Please wait, loading language data..."));
        return;
    }
    if (currentDialog < DIALOG_TEXTS.length - 1) {
      setCurrentDialog((prev) => prev + 1);
    } else {
      if (letters.length === 0) {
        toast.error(t("errorCannotStartTestNoLetters", "Cannot start: No letters for this language."));
        setTestStage("error_state_no_letters");
        return;
      }
      setTestStage("info");
    }
  };

  const handleCloseInfoDialogAndStartPractice = () => {
    setShowInfoDialog(false);
    if (testStage === "info") {
      if (letters.length === 0 || !firstLetterForPractice) {
         toast.error(t("errorCannotStartPracticeNoLetters", "Cannot start practice: No letters."));
         setTestStage("error_state_no_letters");
         return;
      }
      setTestStage("practice");
    }
  };

  const handlePracticeAttemptComplete = (practiceInput, status) => {
    setTestStage("practiceCompleted");
  };

  const handleStartFullTestFromPracticeModal = () => {
    if (letters.length === 0) {
        toast.error(t("errorCannotStartTestNoLetters", "Cannot start test: No letters."));
        setTestStage("error_state_no_letters");
        return;
    }
    if (typeof resetMainTestLogic === 'function') resetMainTestLogic();
    setTestStage("test");
  };

  const handleClosePracticeModalAndRetryPractice = () => {
    if (letters.length === 0 || !firstLetterForPractice) {
        toast.error(t("errorCannotRetryPracticeNoLetters", "Cannot retry practice: No letters."));
        setTestStage("error_state_no_letters");
        return;
    }
    setTestStage("practice");
  };

  const handleSubmitFinal = async () => {
<<<<<<< HEAD
    if (!childId || !token) { toast.error(t("errorAuthMissing", "User info missing.")); setIsProcessingFinalSubmit(false); return; }
=======
    if (!childId) {
      toast.error(t("errorAuthMissing", "User info missing."));
      setIsProcessingFinalSubmit(false);
      return;
    }
>>>>>>> 97d04a7 (Refactor Grapheme and Picture Test Components)
    setIsProcessingFinalSubmit(true);
    const submissionToastId = toast.loading(t("processingResponses", "Processing..."));
    const finalUserInputs = [...userInputs];
    while (finalUserInputs.length < letters.length) { finalUserInputs.push(""); }
    const userResponses = {};
    letters.forEach((letter, index) => { userResponses[letter] = finalUserInputs[index] || ""; });
    const payload = { childId, userResponses, language: langKey };
    try {
<<<<<<< HEAD
      const evalResponse = await axios.post(`${backendURL}/api/grapheme-test/submitResult`, payload, { headers: { Authorization: `Bearer ${token}` } });
=======
      const evalResponse = await axios.post(
        `/api/grapheme-test/submitResult`,
        payload
      );
>>>>>>> 97d04a7 (Refactor Grapheme and Picture Test Components)
      toast.dismiss(submissionToastId);
<<<<<<< HEAD
      if (evalResponse.data && typeof evalResponse.data.score === "number" && typeof evalResponse.data.totalPossibleScore === "number") {
=======
      if (evalResponse.data && typeof evalResponse.data.score === "number") {
>>>>>>> 3c6531f (enhance test result handling)
        const newScore = evalResponse.data.score;
        const totalPossible = evalResponse.data.totalPossibleScore;
        setScoreData({ score: newScore, total: totalPossible });
        toast.success(t("resultsProcessed", "Results processed!"));
        if (suppressResultPage && typeof onCompleteHandler === "function") {
          onCompleteHandler({ score: newScore, total: totalPossible });
        } else { setTestStage("results"); }
      } else { toast.error(t("errorInvalidResponse", "Invalid server response.")); setTestStage("submit"); }
    } catch (error) {
      toast.dismiss(submissionToastId);
      toast.error(t("errorProcessingFailed", "Failed to process results."));
      console.error("API Error submitFinal:", error.response?.data || error.message); setTestStage("submit");
    } finally { setIsProcessingFinalSubmit(false); }
  };

  const restartEntireTestFlowFromIntro = () => {
    setInitialDataLoaded(false); 
    setLanguageDataLoaded(false);
    setTestStage("loading_init");
  };

  const handleBackButtonClick = () => {
    switch (testStage) {
      case "intro":
      case "loading_init":
      case "error_state_no_letters":
        router.push("/take-tests?skipStart=true");
        break;
      case "info":
        setTestStage("intro");
        setCurrentDialog(DIALOG_TEXTS.length > 0 ? DIALOG_TEXTS.length - 1 : 0);
        break;
      case "practice":
      case "practiceCompleted":
        setTestStage("info");
        break;
      case "test":
      case "submit":
        // MODIFICATION: Removed window.confirm here
        if (typeof resetMainTestLogic === 'function') {
            resetMainTestLogic();
        }
        router.push("/take-tests?skipStart=true");
        break;
      case "results":
        router.push("/take-tests?skipStart=true");
        break;
      default:
        router.push("/take-tests?skipStart=true");
    }
  };

  const getBackButtonText = () => {
    // ... (getBackButtonText logic - no changes from previous full code)
    switch (testStage) {
<<<<<<< HEAD
      case "intro": case "loading_init": case "error_state_no_letters": return t("backToMenu", "Back to Menu");
      case "info": return t("backToIntro", "Back to Intro"); // This button leads to "intro" stage. No alert was here.
      case "practice": return t("backToInfo", "Back to Instructions");
      case "practiceCompleted": return t("backToInfo", "Back to Instructions");
      case "test": case "submit": return t("exitToMenu", "Exit to Menu"); // This button previously had confirm. Now removed.
      case "results": return t("backToMenu", "Back to Menu");
      default: return t("back", "Back");
=======
      case "intro":
      case "loading_init":
      case "error_state_no_letters":
        return t("backToMap", "Back to Map");
      case "info":
        return t("backToIntro", "Back to Intro"); // This button leads to "intro" stage. No alert was here.
      case "practice":
        return t("backToInfo", "Back to Instructions");
      case "practiceCompleted":
        return t("backToInfo", "Back to Instructions");
      case "test":
      case "submit":
        return t("backToMap", "Back to Map"); // This button previously had confirm. Now removed.
      case "results":
        return t("backToMap", "Back to Map");
      default:
        return t("back", "Back");
>>>>>>> 2792444 (all the best guys)
    }
  };

  // ----- Main Card Content Logic -----
  let mainCardContent;
  // (Main card content logic - no changes from previous full code, ensure it uses the safe 't')
  if (!languageDataLoaded && testStage !== "loading_init" && testStage !== "intro") {
    mainCardContent = (<div className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center gap-4"><Loader2 size={36} className="animate-spin text-sky-400" /><p className="ml-3 text-lg text-slate-300">{t("loadingLanguageData", "Loading language data...")}</p></div>);
  } else if (testStage === "loading_init" || (testStage === "intro" && !languageDataLoaded )) {
     mainCardContent = (<div className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center gap-4"><Loader2 size={40} className="animate-spin text-sky-400" /><p className="text-lg text-slate-300">{t("loadingInitialData", "Loading Initial Data...")}</p></div>);
  } else if (testStage === "error_state_no_letters") {
    mainCardContent = (<div className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center gap-4">
        <AlertTriangle size={48} className="text-red-400" />
<<<<<<< HEAD
        <p className="text-lg text-red-300">{t("errorNoLettersForTestDisplay", "No letters for this language.")}</p>
        <p className="text-sm text-slate-400">{t("errorTryDifferentLangOrContactSupport", "Try different language or contact support.")}</p>
        <button onClick={() => router.push("/take-tests")} className="mt-4 py-2 px-4 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors">{t("backToTests", "Back to Tests")}</button>
    </div>);
  } else if (testStage === "practice" && !firstLetterForPractice && letters.length > 0) { 
     mainCardContent = (<div className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center gap-4"><Loader2 size={36} className="animate-spin text-sky-400" /><p className="ml-3 text-lg text-slate-300">{t("loadingPracticeLetter", "Loading Practice Letter...")}</p></div>);
=======
        <p className="text-lg text-red-300">
          {t("errorNoLettersForTestDisplay", "No letters for this language.")}
        </p>
        <p className="text-sm text-slate-400">
          {t(
            "errorTryDifferentLangOrContactSupport",
            "Try different language or contact support."
          )}
        </p>
        <button
          onClick={() => router.push("/take-tests?skipStart=true")}
          className="mt-4 py-2 px-4 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors"
        >
          {t("backToTests", "Back to Tests")}
        </button>
      </div>
    );
  } else if (
    testStage === "practice" &&
    !firstLetterForPractice &&
    letters.length > 0
  ) {
    mainCardContent = (
      <div className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 size={36} className="animate-spin text-sky-400" />
        <p className="ml-3 text-lg text-slate-300">
          {t("loadingPracticeLetter", "Loading Practice Letter...")}
        </p>
      </div>
    );
>>>>>>> 2792444 (all the best guys)
  } else if (testStage === "practice") {
    mainCardContent = (<PracticeInterface practiceLetter={firstLetterForPractice} language={language} onPracticeAttemptComplete={handlePracticeAttemptComplete}/>);
  } else if (testStage === "practiceCompleted" || testStage === "info") { 
    mainCardContent = (
      <div className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 size={30} className="animate-spin text-slate-400" />
        <p className="ml-3 text-lg text-slate-300">
          {testStage === "info" ? t("loadingInstructions", "Loading Instructions...") : t("practiceCompleteModalGuide", "Practice Complete! Modal guides you.")}
        </p>
      </div>);
  } else if (isProcessingFinalSubmit && testStage !== "results") {
    mainCardContent = (
      <motion.div key="processing-final-submit" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
        className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <motion.div animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl text-white p-4 bg-purple-500/20 rounded-full shadow-lg">🎵</motion.div>
          <Loader2 size={48} className="text-orange-400 animate-spin my-4" />
          <p className="text-2xl text-orange-200 font-medium">{t("processingMelody", "Processing your melody...")}</p>
          <p className="text-sm text-purple-300">{t("almostThere", "Almost there, fine-tuning the notes!")}</p>
        </div>
      </motion.div>
    );
  } else if (testStage === "submit") {
    mainCardContent = (<SubmitScreen onSubmit={handleSubmitFinal} isProcessingSubmit={isProcessingFinalSubmit} t={t} />);
  } else if (testStage === "results") {
    mainCardContent = (<ResultsScreen score={scoreData.score} totalLetters={scoreData.total || letters.length} onRestartTest={restartEntireTestFlowFromIntro} t={t} />);
  } else if (testStage === "test" && currentIndex < letters.length && letters.length > 0) {
    mainCardContent = (
      <TestInterface
        currentIndex={currentIndex} letters={letters} timeLeft={timeLeft} LETTER_TIMER_DURATION={LETTER_TIMER_DURATION}
        userInputs={userInputs} inputStatus={inputStatus} isRecording={isRecording} isProcessingSubmit={isProcessingFinalSubmit}
        inputRef={inputRef} handleInputChange={handleInputChange} handleRecordButtonClick={handleRecordButtonClick}
        handleNext={handleNext} language={language}
      />);
  } else if (testStage === "test" && letters.length === 0 ) {
     mainCardContent = (<div className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center gap-4"><Loader2 size={36} className="animate-spin text-sky-400" /><p className="ml-3 text-lg text-slate-300">{t("loadingTestLetters", "Loading Test Letters...")}</p></div>);
  } else if (testStage === "test" && currentIndex >= letters.length && letters.length > 0) {
     mainCardContent = (<div className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center gap-4" key="finalizing-test-transition"><Loader2 size={36} className="animate-spin text-orange-400" /><p className="ml-3 text-lg text-orange-300">{t("finalizingTest", "Finalizing Test...")}</p></div>);
  } else { 
    mainCardContent = (<div className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center gap-4"><Loader2 size={36} className="animate-spin text-gray-400" /><p className="ml-3 text-lg text-gray-300">{t("loading", "Loading...")}</p></div>);
  }


  // ----- Initial Loading Screens / Welcome Dialog -----
  if (testStage === "loading_init" || (testStage === "intro" && !languageDataLoaded) ) {
    // Show a consistent full-page loader during these initial phases
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 text-white z-[200]">
          <Image src={localAppBackgroundImage} alt={t("loadingGraphemeTestBackgroundAlt", "Loading background")} layout="fill" objectFit="cover" quality={70} priority className="-z-10 opacity-70"/>
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900/50 via-purple-900/40 to-blue-900/60" />
          <Loader2 className="animate-spin h-12 w-12 text-sky-400 mb-4" />
          <p className="text-xl text-slate-300">
            {/* Use the safe 't' here for these early messages */}
            {testStage === "loading_init" ? t("initializingTest", "Initializing Test...") : t("preparingTheCliffs", "Preparing the singing cliffs...")}
          </p>
        </div>
    );
  }
  
  if (testStage === "intro") {
    return (
      <WelcomeDialog
        dialog={DIALOG_TEXTS} currentDialog={currentDialog} onNextDialog={handleNextIntroDialog}
        onStartTest={handleNextIntroDialog} t={t}
      />
    );
  }

  // ----- Main Test UI -----
  return (
    <div className="fixed inset-0">
      <Image src={localAppBackgroundImage} alt={t("graphemeTestBackgroundAlt", "Grapheme test background")} layout="fill" objectFit="cover" quality={75} priority placeholder="blur" className="-z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-orange-900/40 via-purple-900/30 to-blue-900/50 opacity-90" />

      {(testStage !== "intro" && testStage !== "info" && testStage !== "loading_init" && testStage !== "error_state_no_letters") && (
        <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            onClick={handleBackButtonClick}
            className="fixed top-4 left-4 z-[101] flex items-center gap-2 bg-white/80 hover:bg-white text-gray-800 font-semibold py-2 px-3 rounded-lg shadow-md transition-all text-sm active:scale-95"
            whileHover={{ scale: 1.05 }}>
            <FaArrowLeft className="text-blue-600" />{getBackButtonText()}
        </motion.button>
      )}

      {(testStage === "practice" || testStage === "test") && (
        <motion.button onClick={() => setShowInfoDialog(true)}
          className="fixed top-4 right-4 z-[160] p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-orange-300 hover:text-orange-200 shadow-lg transition-colors active:scale-95"
          aria-label={t("showInstructions", "Show Instructions")} title={t("showInstructions", "Show Instructions")}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <InfoIcon size={22} />
        </motion.button>
      )}
      
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="w-full max-w-2xl bg-gradient-to-br from-slate-800/85 via-gray-800/75 to-slate-900/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-slate-700/50 shadow-2xl relative overflow-hidden">
          
          {(testStage === "test" || testStage === "submit" || (testStage === "results" && !suppressResultPage) ) && (<>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 animate-pulse-fast"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-400/10 rounded-full filter blur-2xl animate-pulse delay-500"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full filter blur-2xl animate-pulse delay-1000"></div>
          </>)}

          {(testStage === "test" || testStage === "submit" || (testStage === "results" && !suppressResultPage)) && letters.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <div className="flex justify-between mb-2 sm:mb-3">
                  <span className="text-xs sm:text-sm font-medium text-orange-200">🎼 {t("progress", "Progress")}: {Math.min(currentIndex, letters.length)}/{letters.length}</span>
                  <span className="text-xs sm:text-sm font-medium text-orange-200">{Math.round((Math.min(currentIndex, letters.length) / (letters.length || 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-purple-900/50 rounded-full h-3 sm:h-4 overflow-hidden border border-orange-400/30 shadow-inner">
                  <motion.div initial={{ width: "0%" }} animate={{ width: `${(Math.min(currentIndex, letters.length) / (letters.length || 1)) * 100}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 h-full rounded-full relative">
                    <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay:0.5 }}
                      className="absolute inset-0 bg-white/25 blur-[3px] rounded-full" style={{ transform: "skewX(-20deg)"}} />
                  </motion.div>
                </div>
              </div>)}
          <AnimatePresence mode="wait">{mainCardContent}</AnimatePresence>
        </motion.div>

        {testStage === "test" && currentIndex < letters.length && !isProcessingFinalSubmit && letters.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 sm:mt-8 text-center">
              <motion.p animate={{ y: [0, -4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="text-white font-medium text-sm sm:text-base bg-slate-700/60 backdrop-blur-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-slate-600/50 shadow-md">
                {t("typeOrSpeakHint", "Type or speak the letter you see")}
              </motion.p>
            </motion.div>)}
      </div>

      <PracticeModal isOpen={testStage === "practiceCompleted"} onClose={handleClosePracticeModalAndRetryPractice}
        onStartFullTest={handleStartFullTestFromPracticeModal}
        message={t("practiceCompleteMessage", "Practice complete! Ready for the full challenge?")} t={t} />

      <InfoDialog isOpen={showInfoDialog || testStage === "info"} onClose={handleCloseInfoDialogAndStartPractice} t={t} />
    </div>
  );
};


export default function GraphemePhonemeCorrespondencePage() {
 
  const staticFallbackContent = (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 text-white z-[200]">
      <Image 
        src={localAppBackgroundImage.src} // Assuming localAppBackgroundImage is an object with a 'src' property
        alt="Loading grapheme test background" 
        layout="fill" objectFit="cover" quality={60} priority 
        className="-z-10 opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-orange-900/50 via-purple-900/40 to-blue-900/60" />
      <Loader2 className="animate-spin h-12 w-12 text-sky-400 mb-4" />
      <p className="text-xl text-slate-300">Loading Grapheme Test...</p>
    </div>
  );

  return (
    <Suspense fallback={staticFallbackContent}>
<<<<<<< HEAD
      <LanguageProvider> {/* LanguageProvider wraps GraphemeTestContent */}
=======
      <LanguageProvider>
>>>>>>> 3c6531f (enhance test result handling)
        <GraphemeTestContent />
      </LanguageProvider>
    </Suspense>
  );
}