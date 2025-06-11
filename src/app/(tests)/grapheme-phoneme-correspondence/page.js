"use client";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";


import graphemeLettersData from "../../../components/grapheme-test/graphemeLetters.json";
import { useLanguage } from "../../../contexts/LanguageContext.jsx";

// Import local images (ensure these paths are correct relative to page.jsx)
import localAppBackgroundImage from "../../../../public/grapheme-test/backgroundImage.webp";

// Import Components & Hook (ensure these paths are correct)
import { useGraphemeTestLogic } from "../../../components/grapheme-test//useGraphemeTestLogic.js";
import PracticeInterface from "../../../components/grapheme-test/PracticeInterface";
import PracticeModal from "../../../components/grapheme-test/PracticeModal";
import ResultsScreen from "../../../components/grapheme-test/ResultScreen.jsx";
import SubmitScreen from "../../../components/grapheme-test/SubmitScreen.jsx";
import TestInterface from "../../../components/grapheme-test/TestInterface.jsx";
import WelcomeDialog from "../../../components/grapheme-test/WelcomeDialog.jsx";
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const LETTER_TIMER_DURATION = 8;
const DIALOG_TEXTS = [
    "🎶 Welcome, traveler, to Phoneme Point! The singing cliffs echo with melodies of sound and letter.",
    "🐦 We are Riff & Raff, twin songbirds and guardians of these luminous cliffs. Here, each note carries the spark of a letter's sound.",
    "🔤 Your task is to match the letters with the sounds they sing (or the other way around). Let the music of the cliffs guide you.",
    "🎼 In return, we shall grant you the Shell of Soundcraft and the Tune Torch, which reveals the silent letters in any word.",
    "Are you ready to let the cliffs sing you their secrets and find the harmony of letters and sounds?",
];

const GraphemeTestPage = ({ suppressResultPage = false, onComplete }) => {
  const { language, t } = useLanguage();
  const router = useRouter();
  const inputRef = useRef(null);

  const [letters, setLetters] = useState([]);
  const [firstLetterForPractice, setFirstLetterForPractice] = useState(null);
  const [langKey, setLangKey] = useState("english");

  const [testStage, setTestStage] = useState("intro");
  const [currentDialog, setCurrentDialog] = useState(0);
  const [score, setScore] = useState(0);
  const [isProcessingFinalSubmit, setIsProcessingFinalSubmit] = useState(false);
  const [childId, setChildId] = useState(null);
  const [token, setToken] = useState(null);
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      setChildId(localStorage.getItem("childId"));
      setToken(localStorage.getItem("access_token"));
      console.log(token);
    }
  }, []);

  useEffect(() => {
    const key = language === "ta" ? "tamil" : language === "hi" ? "hindi" : "english";
    setLangKey(key);
    const currentLangData = graphemeLettersData[key] || graphemeLettersData["english"];
    const currentLangLetters = currentLangData?.letters || [];

    setLetters(currentLangLetters);
    setFirstLetterForPractice(currentLangLetters.length > 0 ? currentLangLetters[0] : null);
    
    setTestStage("intro");
    setCurrentDialog(0);
    // resetMainTestLogic(); // The hook will reset itself when 'letters' or 'isMainTestUIVisible' changes.
  }, [language]); // Added resetMainTestLogic to dependencies if it were called here, but it's not needed.

  const handleFullTestCompletionByHook = useCallback(() => {
    setTestStage("submit");
  }, []);
  
  const isMainTestUIVisible = testStage === 'test' && letters.length > 0;

  const {
    currentIndex, timeLeft, userInputs, isRecording, inputStatus,
    handleInputChange, handleRecordButtonClick, handleNext, resetLogic: resetMainTestLogic,
  } = useGraphemeTestLogic({
    letters, LETTER_TIMER_DURATION, childId, language, backendURL, inputRef,
    onTestComplete: handleFullTestCompletionByHook,
    isTestUIVisible: isMainTestUIVisible,
  });

  const handleNextIntroDialog = () => {
    if (currentDialog < DIALOG_TEXTS.length - 1) setCurrentDialog((prev) => prev + 1);
    else setTestStage("practice");
  };
  const startPracticeAfterIntroDialog = () => setTestStage("practice");

  const handlePracticeAttemptComplete = (practiceInput, status) => setTestStage("practiceCompleted");
  const handleStartFullTestFromPracticeModal = () => setTestStage("test");
  const handleClosePracticeModalAndRetryPractice = () => setTestStage("practice");

 
const handleSubmitFinal = async () => {
  // --- SOFT DEBUG: Function Entry ---
  console.log("handleSubmitFinal: Function called.");

  if (!childId || !token) {
    toast.error("User information not found.");
    // --- SOFT DEBUG: Missing Info & Abort ---
    console.warn("handleSubmitFinal: Aborted - childId or token missing.", { childIdExists: !!childId, tokenExists: !!token });
    return;
  }

  setIsProcessingFinalSubmit(true);
  toast.loading("Processing your responses...");
  // --- SOFT DEBUG: Start Processing & Current User Inputs (from hook) ---
  console.log("handleSubmitFinal: Processing started. Current userInputs (from hook):", userInputs);

  const finalUserInputs = [...userInputs]; // Ensure userInputs from hook is used
  while (finalUserInputs.length < letters.length) {
    finalUserInputs.push("");
  }
  // --- SOFT DEBUG: Prepared Inputs for Submission ---
  console.log("handleSubmitFinal: Prepared finalUserInputs for submission:", finalUserInputs);

  try {
    const payload = {
      childId,
      letters,
      transcriptions: finalUserInputs.slice(0, letters.length),
      language: langKey,
    };
    // --- SOFT DEBUG: API Call Details (Endpoint & Payload) ---
    console.log("handleSubmitFinal: Sending POST request to /api/grapheme-test/submitResult with payload:", payload);

    const evalResponse = await axios.post(
      './api/grapheme-test/submitResult', // Using backendURL prefix. If internal API, path alone might be okay.
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.dismiss();
    // --- SOFT DEBUG: API Call Successful (Status & Response Data) ---
    console.log("handleSubmitFinal: API call successful. Status:", evalResponse.status, "Response data:", evalResponse.data);

    if (evalResponse.data && typeof evalResponse.data.score === 'number') {
      setScore(evalResponse.data.score);
      // --- SOFT DEBUG: Score Updated ---
      console.log("handleSubmitFinal: Score set to:", evalResponse.data.score);

      if (suppressResultPage && typeof onComplete === "function") {
        // --- SOFT DEBUG: Suppressing Result Page ---
        console.log("handleSubmitFinal: Suppressing result page and calling onComplete.");
        onComplete(evalResponse.data.score);
        setTestStage("intro");
        // --- SOFT DEBUG: Stage Transition ---
        console.log("handleSubmitFinal: Test stage set to 'intro'.");
      } else {
        // --- SOFT DEBUG: Showing Results Page ---
        console.log("handleSubmitFinal: Showing results page.");
        setTestStage("results");
        // --- SOFT DEBUG: Stage Transition ---
        console.log("handleSubmitFinal: Test stage set to 'results'.");
      }
    } else {
      toast.error("Invalid response from server. Score not found.");
      // --- SOFT DEBUG: Invalid API Response Structure ---
      console.error("handleSubmitFinal: Invalid response structure from API. Score missing.", evalResponse.data);
      setTestStage("submit"); // Stay on submit or show an error state
    }

  } catch (error) {
    toast.dismiss();
    toast.error("Failed to process results. Please try again.");
    
    // --- SOFT DEBUG: API Error Details ---
    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      console.error(
        "handleSubmitFinal: API Error - Status:", error.response.status,
        "Data:", error.response.data
        // "Headers:", error.response.headers // Headers can be very verbose, log if needed
      );
    } else if (error.request) {
      // Request was made but no response received (network issue, server down)
      console.error("handleSubmitFinal: Network Error - No response received. Request details:", error.request);
    } else {
      // Something else went wrong in setting up the request
      console.error("handleSubmitFinal: Request Setup Error - Message:", error.message);
    }
    // --- SOFT DEBUG: Full Error Object (for more details if needed) ---
    // console.error("handleSubmitFinal: Full error object:", error); // Uncomment if you need the whole thing
    setTestStage("submit");
    // --- SOFT DEBUG: Stage Transition due to Error ---
    console.log("handleSubmitFinal: Test stage set back to 'submit' due to error.");
  } finally {
    setIsProcessingFinalSubmit(false);
    // --- SOFT DEBUG: Processing Finished ---
    console.log("handleSubmitFinal: Processing finished. isProcessingFinalSubmit set to false.");
  }
};

  // This restart function is primarily for the "Try Again" button on the ResultsScreen
  const restartEntireTestFlowFromIntro = () => {
    resetMainTestLogic(); 
    setScore(0); 
    setIsProcessingFinalSubmit(false);
    setCurrentDialog(0); 
    setTestStage("intro"); 
  };

  // --- REVISED Back Button Logic ---
  const handleBackButtonClick = () => {
    let confirmAndExit = false;
    switch (testStage) {
      case "intro":
        router.push("/take-tests"); // To main menu
        break;
      case "practice":
      case "practiceCompleted":
        setTestStage("intro");    // Back to intro dialogs
        setCurrentDialog(0);      // Reset intro dialogs
        break;
      case "test":
      case "submit":
        if (typeof window !== "undefined") {
            confirmAndExit = window.confirm(
            "Are you sure you want to exit to the main menu? Your current progress will be lost."
            );
        }
        if (confirmAndExit) {
          resetMainTestLogic();     // Reset the main test's logic (e.g., currentIndex)
          router.push("/take-tests"); // Navigate to the main test menu
        }
        break;
      case "results":
        router.push("/take-tests"); // From results screen, "back" goes to main menu
        break;
      default:
        router.push("/take-tests"); // Fallback
    }
  };

  const getBackButtonText = () => {
    switch (testStage) {
      case "intro": return t("backToMenu") || "Back to Menu";
      case "practice": case "practiceCompleted": return t("backToIntro") || "Back to Intro";
      case "test": case "submit": return t("exitToMenu") || "Exit to Menu";
      case "results": return t("backToMenu") || "Back to Menu";
      default: return t("back") || "Back";
    }
  };

  // --- RENDER LOGIC BASED ON testStage ---
  let mainCardContent;
  if (testStage === "intro") {
    mainCardContent = <div className="text-center py-12 min-h-[400px] flex items-center justify-center"><Loader2 size={36} className="animate-spin text-sky-400" /><p className="ml-3 text-lg text-slate-300">Loading Introduction...</p></div>;
  } else if ((testStage === 'practice' || testStage === 'practiceCompleted') && !firstLetterForPractice) {
    mainCardContent = <div className="text-center py-12 min-h-[400px] flex items-center justify-center"><Loader2 size={36} className="animate-spin text-sky-400" /><p className="ml-3 text-lg text-slate-300">Loading Practice Letter...</p></div>;
  } else if (testStage === "practice") {
    mainCardContent = <PracticeInterface practiceLetter={firstLetterForPractice} language={language} onPracticeAttemptComplete={handlePracticeAttemptComplete} backendURL={backendURL} />;
  } else if (testStage === "practiceCompleted") {
    mainCardContent = <div className="text-center py-12 min-h-[400px] flex items-center justify-center"><p className="text-lg text-slate-300">Practice Complete! Modal will guide you.</p></div>;
  } else if (isProcessingFinalSubmit && testStage !== 'results') {
    mainCardContent = <motion.div key="processing-final-submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12 min-h-[400px] flex items-center justify-center"><div className="flex flex-col items-center gap-6"><motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-6xl text-white">🎵</motion.div><Loader2 size={48} className="text-orange-400 animate-spin" /><p className="text-2xl text-orange-200 font-medium">Processing your melody...</p></div></motion.div>;
  } else if (testStage === "submit") {
    mainCardContent = <SubmitScreen onSubmit={handleSubmitFinal} isProcessingSubmit={isProcessingFinalSubmit} />;
  } else if (testStage === "results") {
    mainCardContent = <ResultsScreen score={score} totalLetters={letters.length} onRestartTest={restartEntireTestFlowFromIntro} />;
  } else if (testStage === "test" && currentIndex < letters.length && letters.length > 0) {
    mainCardContent = <TestInterface currentIndex={currentIndex} letters={letters} timeLeft={timeLeft} LETTER_TIMER_DURATION={LETTER_TIMER_DURATION} userInputs={userInputs} inputStatus={inputStatus} isRecording={isRecording} isProcessingSubmit={isProcessingFinalSubmit} inputRef={inputRef} handleInputChange={handleInputChange} handleRecordButtonClick={handleRecordButtonClick} handleNext={handleNext} language={language} />;
  } else if (testStage === "test" && letters.length === 0 && !firstLetterForPractice) { // More specific loading for test letters
     mainCardContent = <div className="text-center py-12 min-h-[400px] flex items-center justify-center"><Loader2 size={36} className="animate-spin text-sky-400" /><p className="ml-3 text-lg text-slate-300">Loading Test Letters...</p></div>;
  } else if (testStage === "test" && currentIndex >= letters.length && letters.length > 0) { // Test logic hook finished, page should transition to submit
    mainCardContent = <div className="text-center py-12 min-h-[400px] flex items-center justify-center" key="finalizing-test-transition"><Loader2 size={36} className="animate-spin text-orange-400" /><p className="ml-3 text-lg text-orange-300">Finalizing Test...</p></div>;
  } else { // Fallback for any unhandled or initial loading state before letters/practiceLetter are set
    mainCardContent = <div className="text-center py-12 min-h-[400px] flex items-center justify-center"><Loader2 size={36} className="animate-spin text-gray-400" /><p className="ml-3 text-lg text-gray-300">Loading...</p></div>;
  }

  // --- Main Render ---
  // Handle full-screen intro dialog separately as it overlays everything
  if (testStage === "intro") {
    return <WelcomeDialog dialog={DIALOG_TEXTS} currentDialog={currentDialog} onNextDialog={handleNextIntroDialog} onStartTest={startPracticeAfterIntroDialog} t={t} />;
  }
  
  return (
    <div className="fixed inset-0"> {/* Main page wrapper */}
      <Image src={localAppBackgroundImage} alt="Grapheme test background" layout="fill" objectFit="cover" quality={75} priority placeholder="blur" className="-z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-orange-900/40 via-purple-900/30 to-blue-900/50" />
      
      {/* Back Button - always visible except during intro dialog */}
      <motion.button 
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} 
        onClick={handleBackButtonClick}
        className="fixed top-4 left-4 z-[101] flex items-center gap-2 bg-white/80 hover:bg-white text-gray-800 font-semibold py-2 px-3 rounded-lg shadow-md transition-all text-sm" 
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft className="text-blue-600" />
        {getBackButtonText()}
      </motion.button>

      {/* Main Content Card Area */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }} 
          className="w-full max-w-2xl bg-gradient-to-br from-slate-800/80 via-gray-800/70 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-slate-700/50 shadow-2xl relative overflow-hidden"
        >
          
          {(testStage !== 'intro' && testStage !== 'practice' && testStage !== 'practiceCompleted') && (
            <>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-400/10 rounded-full filter blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full filter blur-2xl animate-pulse" style={{ animationDelay: "1s" }}></div>
            </>
          )}
          
          
          {(testStage === 'test' || testStage === 'submit' || (testStage === 'results' && !suppressResultPage)) && letters.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <div className="flex justify-between mb-2 sm:mb-3"><span className="text-xs sm:text-sm font-medium text-orange-200">🎼 Progress: {Math.min(currentIndex, letters.length)}/{letters.length}</span><span className="text-xs sm:text-sm font-medium text-orange-200">{letters.length > 0 ? Math.round((Math.min(currentIndex, letters.length) / letters.length) * 100) : 0}%</span></div>
              <div className="w-full bg-purple-900/50 rounded-full h-3 sm:h-4 overflow-hidden border border-orange-400/30">
                <motion.div initial={{ width: 0 }} animate={{ width: `${letters.length > 0 ? (Math.min(currentIndex, letters.length) / letters.length) * 100 : 0}%`}} transition={{ duration: 0.8, ease: "easeOut" }} className="bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 h-full rounded-full relative">
                  <motion.div animate={{ x: [-10, 10, -10] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-white/20 rounded-full" />
                </motion.div>
              </div>
            </div>
          )}
          <AnimatePresence mode="wait">
            {mainCardContent}
          </AnimatePresence>
        </motion.div>

        
        {testStage === 'test' && currentIndex < letters.length && !isProcessingFinalSubmit && letters.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} 
              className="mt-6 sm:mt-8 text-center"
            >
              <motion.p 
                animate={{ y: [0, -4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} 
                className="text-white font-medium text-sm sm:text-base bg-slate-700/50 backdrop-blur-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-slate-600/50 shadow-md"
              >
                Type or speak the letter you see
              </motion.p>
            </motion.div>
          )}
      </div>

    
      <PracticeModal
        isOpen={testStage === "practiceCompleted"}
        onClose={handleClosePracticeModalAndRetryPractice} 
        onStartFullTest={handleStartFullTestFromPracticeModal}
        message="Practice complete! How did you find it? Ready for the full challenge?"
      />
    </div>
  );
};

GraphemeTestPage.propTypes = {
  suppressResultPage: PropTypes.bool,
  onComplete: PropTypes.func,
};

export default GraphemeTestPage;

