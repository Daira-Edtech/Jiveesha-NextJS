// app/(tests)/grapheme-phoneme-correspondence/page.js
"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { AlertTriangle, Info as InfoIcon, Loader2 } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";

import graphemeLettersData from "../../../components/grapheme-test/graphemeLetters.json";
// LanguageProvider and useLanguage are used by GraphemeTestContent
import {
  LanguageProvider,
  useLanguage,
} from "../../../contexts/LanguageContext.jsx";

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
const GraphemeTestContent = ({ isContinuous = false, onTestComplete }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // This hook causes GraphemeTestContent to be dynamic
  const suppressResultPage =
    searchParams.get("suppressResultPage") === "true" || isContinuous;

  const { language: contextLanguage, t: contextT } = useLanguage();

  const t = useMemo(() => {
    if (typeof contextT === "function") return contextT;
    return (key, fallbackValue) => fallbackValue || key;
  }, [contextT]);

  const language = contextLanguage || "en";
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

  const isTestUIVisible = useMemo(
    () => testStage === "test" && letters.length > 0 && languageDataLoaded,
    [testStage, letters, languageDataLoaded]
  );

  const handleFullTestCompletionByHook = useCallback(() => {
    setTestStage("submit");
  }, []);

  const {
    currentIndex,
    timeLeft,
    userInputs,
    isRecording,
    inputStatus,
    handleInputChange,
    handleRecordButtonClick,
    handleNext,
    resetLogic: resetMainTestLogic,
  } = useGraphemeTestLogic({
    letters,
    LETTER_TIMER_DURATION,
    childId,
    language,
    backendURL,
    inputRef,
    onTestComplete: handleFullTestCompletionByHook,
    isTestUIVisible,
  });

  const onCompleteHandler = useCallback(
    (finalScore) => {
      const scoreValue =
        typeof finalScore === "object" ? finalScore.score : finalScore;
      toast.info(
        t(
          "testCompletedWithScoreSuppressed",
          `Test completed: ${scoreValue}. Results page suppressed.`
        )
      );
      router.push("/take-tests?skipStart=true");
    },
    [router, t]
  );

  const handleSubmitFinal = useCallback(async () => {
    if (isContinuous) {
      if (onTestComplete) {
        const correctAnswers = userInputs.filter(
          (input) => input.isCorrect
        ).length;
        const totalQuestions = letters.length;
        const score = correctAnswers;
        onTestComplete({
          score,
          total: totalQuestions,
          test: "GraphemePhonemeCorrespondence",
          responses: userInputs.map((input, index) => ({
            letter: letters[index].letter,
            userInput: input.userInput,
            isCorrect: input.isCorrect,
            reactionTime: input.reactionTime,
            audio: input.audio,
          })),
        });
      }
      return;
    }

    if (!childId) {
      toast.error(t("errorAuthMissing", "User info missing."));
      setIsProcessingFinalSubmit(false);
      return;
    }
    setIsProcessingFinalSubmit(true);
    const submissionToastId = toast.loading(
      t("processingResponses", "Processing...")
    );

    const finalUserInputs = [...userInputs];
    while (finalUserInputs.length < letters.length) {
      finalUserInputs.push("");
    }

    const userResponses = {};
    letters.forEach((letter, index) => {
      userResponses[letter] = finalUserInputs[index] || "";
    });

    const payload = {
      childId: childId,
      testName: "Grapheme-Phoneme Correspondence",
      testResults: userInputs.map((input, index) => ({
        letter: letters[index].letter,
        userInput: input.userInput,
        isCorrect: input.isCorrect,
        reactionTime: input.reactionTime,
        audio: input.audio,
      })),
      // Score is calculated server-side for standalone tests
    };

    try {
      const apiRoute = `/api/grapheme-phoneme-correspondence`;

      const response = await axios.post(`${backendURL}${apiRoute}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.dismiss(submissionToastId);

      if (response.data && typeof response.data.score === "number") {
        const correctCount = response.data.score;
        const totalPossible =
          response.data.totalPossibleScore || letters.length;

        setScoreData({ score: correctCount, total: totalPossible });
        toast.success(t("resultsProcessed", "Results processed!"));
        if (suppressResultPage && typeof onCompleteHandler === "function") {
          onCompleteHandler({ score: correctCount, total: totalPossible });
        } else {
          setTestStage("results");
        }
      } else {
        console.error("Invalid API response structure:", response.data);
        toast.error(t("errorInvalidResponse", "Invalid server response."));
        setTestStage("submit");
      }
    } catch (error) {
      toast.dismiss(submissionToastId);
      toast.error(t("errorProcessingFailed", "Failed to process results."));
      console.error(
        "API Error submitFinal:",
        error.response?.data || error.message
      );
      setTestStage("submit");
    } finally {
      setIsProcessingFinalSubmit(false);
    }
  }, [
    isContinuous,
    onTestComplete,
    userInputs,
    letters,
    childId,
    t,
    token,
    suppressResultPage,
    onCompleteHandler,
  ]);

  useEffect(() => {
    if (testStage === "submit") {
      handleSubmitFinal();
    }
  }, [testStage, handleSubmitFinal]);

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
    const key =
      language === "ta" ? "tamil" : language === "hi" ? "hindi" : "english";
    setLangKey(key);
    const currentLangData =
      graphemeLettersData[key] || graphemeLettersData["english"];
    const currentLangLetters = currentLangData?.letters || [];

    if (currentLangLetters.length === 0) {
      console.warn(`No letters found for language: ${key}.`);
      toast.error(
        t(
          "errorNoLettersForLang",
          `No test letters found for the selected language.`
        )
      );
      setLetters([]);
      setFirstLetterForPractice(null);
    } else {
      setLetters(currentLangLetters);
      setFirstLetterForPractice(
        currentLangLetters.length > 0 ? currentLangLetters[0] : null
      );
    }

    if (testStage === "loading_init" || !languageDataLoaded) {
      // If initial load or language changed causing reload
      setTestStage("intro");
    } // Avoid resetting to intro if already past it and only minor language data re-fetch

    setCurrentDialog(0);
    // Only reset score data when starting fresh, not during results display
    if (testStage !== "results") {
      setScoreData({ score: 0, total: 0 });
    }
    setIsProcessingFinalSubmit(false);

    // Only reset the test logic when loading initial data or when language changes
    // Don't reset during test progression
    if (
      (testStage === "loading_init" || !languageDataLoaded) &&
      typeof resetMainTestLogic === "function"
    ) {
      resetMainTestLogic();
    }

    setLanguageDataLoaded(true);
  }, [
    language,
    initialDataLoaded,
    t,
    testStage,
    languageDataLoaded,
    resetMainTestLogic,
  ]);

  const handleNextIntroDialog = () => {
    if (!languageDataLoaded) {
      toast.warn(
        t("pleaseWaitLoadingLang", "Please wait, loading language data...")
      );
      return;
    }
    if (currentDialog < DIALOG_TEXTS.length - 1) {
      setCurrentDialog((prev) => prev + 1);
    } else {
      if (letters.length === 0) {
        toast.error(
          t(
            "errorCannotStartTestNoLetters",
            "Cannot start: No letters for this language."
          )
        );
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
        toast.error(
          t(
            "errorCannotStartPracticeNoLetters",
            "Cannot start practice: No letters."
          )
        );
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
      toast.error(
        t("errorCannotStartTestNoLetters", "Cannot start test: No letters.")
      );
      setTestStage("error_state_no_letters");
      return;
    }
    if (typeof resetMainTestLogic === "function") resetMainTestLogic();
    setTestStage("test");
  };

  const handleClosePracticeModalAndRetryPractice = () => {
    if (letters.length === 0 || !firstLetterForPractice) {
      toast.error(
        t(
          "errorCannotRetryPracticeNoLetters",
          "Cannot retry practice: No letters."
        )
      );
      setTestStage("error_state_no_letters");
      return;
    }
    setTestStage("practice");
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
        if (typeof resetMainTestLogic === "function") {
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
    }
  };

  // ----- Main Card Content Logic -----
  let mainCardContent;
  // (Main card content logic - no changes from previous full code, ensure it uses the safe 't')
  if (
    !languageDataLoaded &&
    testStage !== "loading_init" &&
    testStage !== "intro"
  ) {
    mainCardContent = (
      <div className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 size={36} className="animate-spin text-sky-400" />
        <p className="ml-3 text-lg text-slate-300">
          {t("loadingLanguageData", "Loading language data...")}
        </p>
      </div>
    );
  } else if (
    testStage === "loading_init" ||
    (testStage === "intro" && !languageDataLoaded)
  ) {
    mainCardContent = (
      <div className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-sky-400" />
        <p className="text-lg text-slate-300">
          {t("loadingInitialData", "Loading Initial Data...")}
        </p>
      </div>
    );
  } else if (testStage === "error_state_no_letters") {
    mainCardContent = (
      <div className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center gap-4">
        <AlertTriangle size={48} className="text-red-400" />
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
          {t("preparingPractice", "Preparing practice round...")}
        </p>
      </div>
    );
  } else if (testStage === "intro") {
    mainCardContent = (
      <WelcomeDialog
        dialogText={DIALOG_TEXTS[currentDialog]}
        onNext={handleNextIntroDialog}
        isLastDialog={currentDialog === DIALOG_TEXTS.length - 1}
      />
    );
  } else if (testStage === "info") {
    mainCardContent = (
      <InfoDialog
        onClose={handleCloseInfoDialogAndStartPractice}
        langKey={langKey}
      />
    );
  } else if (testStage === "practice") {
    mainCardContent = (
      <PracticeInterface
        letter={firstLetterForPractice}
        onAttemptComplete={handlePracticeAttemptComplete}
        langKey={langKey}
        key={`practice-${firstLetterForPractice?.letter || "no-letter"}`}
      />
    );
  } else if (testStage === "practiceCompleted") {
    mainCardContent = (
      <PracticeModal
        onStartTest={handleStartFullTestFromPracticeModal}
        onRetryPractice={handleClosePracticeModalAndRetryPractice}
      />
    );
  } else if (isTestUIVisible) {
    mainCardContent = (
      <TestInterface
        key={`test-interface-${currentIndex}`}
        letter={letters[currentIndex]}
        timeLeft={timeLeft}
        currentIndex={currentIndex}
        total={letters.length}
        userInput={userInputs[currentIndex]?.userInput || ""}
        isRecording={isRecording}
        inputStatus={inputStatus}
        handleInputChange={handleInputChange}
        handleRecordButtonClick={handleRecordButtonClick}
        handleNext={handleNext}
        inputRef={inputRef}
        langKey={langKey}
      />
    );
  } else if (testStage === "submit") {
    mainCardContent = (
      <SubmitScreen
        isSubmitting={isProcessingFinalSubmit}
        onSubmit={handleSubmitFinal}
      />
    );
  } else if (testStage === "results") {
    mainCardContent = (
      <ResultsScreen
        score={scoreData.score}
        total={scoreData.total}
        onRestart={() => {
          if (typeof resetMainTestLogic === "function") resetMainTestLogic();
          setTestStage("test");
        }}
        onBackToMap={() => router.push("/take-tests?skipStart=true")}
      />
    );
  } else {
    mainCardContent = (
      <div className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-sky-400" />
        <p className="text-lg text-slate-300">
          {t("loadingState", "Loading...")}
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${localAppBackgroundImage.src})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-4xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={testStage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col"
          >
            <div className="p-4 sm:p-6 border-b border-slate-700/50 flex justify-between items-center">
              <button
                onClick={handleBackButtonClick}
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors disabled:opacity-50"
                disabled={isProcessingFinalSubmit}
              >
                <FaArrowLeft />
                <span>{getBackButtonText()}</span>
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-fuchsia-400 flex-1 mx-4">
                {t("graphemeTestTitle", "Grapheme-Phoneme Correspondence")}
              </h1>
              <button
                onClick={() => setShowInfoDialog(true)}
                className="text-slate-300 hover:text-white transition-colors disabled:opacity-50"
                disabled={isProcessingFinalSubmit}
              >
                <InfoIcon size={20} />
              </button>
            </div>
            <div className="flex-grow p-4 sm:p-6 flex flex-col justify-center">
              {mainCardContent}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {showInfoDialog && (
        <InfoDialog
          onClose={() => setShowInfoDialog(false)}
          isOverlay={true}
          langKey={langKey}
        />
      )}
    </div>
  );
};

// The page component that wraps everything
const GraphemePhonemeCorrespondencePage = ({
  isContinuous = false,
  onTestComplete,
}) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <LanguageProvider>
        <GraphemeTestContent
          isContinuous={isContinuous}
          onTestComplete={onTestComplete}
        />
      </LanguageProvider>
    </Suspense>
  );
};

export default GraphemePhonemeCorrespondencePage;
