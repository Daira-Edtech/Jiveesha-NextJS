"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { FaInfoCircle } from "react-icons/fa";
import { toast, Toaster } from "sonner";
import imagesData from "../../../Data/imageData"; // Ensure this path is correct
import BackButton from "../../../components/picture-test/BackButton";
import InfoDialog from "../../../components/picture-test/InfoDialog"; // New import
import LoadingSpinner from "../../../components/picture-test/LoadingSpinner";
import PictureDialogContent from "../../../components/picture-test/PictureDialogContent";
import PracticeCompleteModal from "../../../components/picture-test/PracticeCompleteModal";
import PracticeRound from "../../../components/picture-test/PracticeRoundContent"; // Your path was PracticeRoundContent
import ResultsDisplay from "../../../components/picture-test/ResultDisplay";
import WelcomeDialog from "../../../components/picture-test/WelcomeDialog";
import {
  LanguageProvider,
  useLanguage,
} from "../../../contexts/LanguageContext.jsx";

// Define view states
const VIEW_STATES = {
  WELCOME: "welcome",
  INFO_DIALOG_INITIAL: "info_dialog_initial", // New: For InfoDialog after WelcomeDialog
  PRACTICE: "practice",
  PRACTICE_COMPLETE_MODAL: "practice_complete_modal",
  TEST: "test",
  RESULTS: "results",
  LOADING_SUBMISSION: "loading_submission",
  LOADING_DATA: "loading_data",
  LOADING_RESULTS: "loading_results",
};

const PictureRecognitionTestPage = ({
  isContinuous = false,
  onTestComplete,
}) => {
  const { language, t } = useLanguage();
  const router = useRouter(); // Get router instance

  useEffect(() => {
    console.log("[DEBUG] Current language context:", language);

    const interval = setInterval(() => {
      console.log("[DEBUG] Current language context (every 4s):", language);
    }, 4000);

    return () => clearInterval(interval);
  }, [language]);

  const [images, setImages] = useState([]);
  const [practiceImage, setPracticeImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canSee, setCanSee] = useState(null);
  const [answer, setAnswer] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [responses, setResponses] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [currentView, setCurrentView] = useState(VIEW_STATES.LOADING_DATA);
  const [currentDialog, setCurrentDialog] = useState(0);
  const [practiceEvaluation, setPracticeEvaluation] = useState(null);
  const [showOverlayInfoDialog, setShowOverlayInfoDialog] = useState(false); // New: For button-triggered InfoDialog

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const dialogIntroTexts = [
    t("pictureTestIntroDialog1"),
    t("pictureTestIntroDialog2"),
    t("pictureTestIntroDialog3"),
    t("pictureTestIntroDialog4"),
    t("pictureTestIntroDialog5"),
  ];

  useEffect(() => {
    if (imagesData && imagesData.length > 0) {
      setImages(imagesData);
      // Ensure practice image is not the same as the first test image if test starts from index 0 of imagesData
      // For this example, let's assume imagesData[0] is okay for practice, and main test might skip it or use a different set.
      // If using imagesData directly, consider picking a dedicated practice image or adjusting main test start.
      setPracticeImage(imagesData[0]);
      setCurrentView(VIEW_STATES.WELCOME);
    } else {
      toast.error(
        t("errorLoadingImageData", "Error: Could not load image data.")
      );
    }
  }, [t]);

  const getCorrectAnswerForLang = useCallback(
    (imageItem) => {
      if (!imageItem) return "";
      return language === "ta"
        ? imageItem.correctAnswerTamil || imageItem.correctAnswer
        : language === "hi"
        ? imageItem.correctAnswerHindi || imageItem.correctAnswer
        : language === "kn"
        ? imageItem.correctAnswerKannada || imageItem.correctAnswer
        : imageItem.correctAnswer || "";
    },
    [language]
  );

  const speakText = useCallback(
    (text) => {
      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        text
      ) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = language;
        speech.rate = 0.9;
        speech.pitch = 1.1;
        window.speechSynthesis.speak(speech);
      }
    },
    [language]
  );

  const handleNextDialog = () => {
    if (currentDialog < dialogIntroTexts.length - 1) {
      setCurrentDialog((prev) => prev + 1);
    } else {
      setCurrentView(VIEW_STATES.INFO_DIALOG_INITIAL); // Transition to initial InfoDialog
      speakText(t("heresHowToPlay", "Here's a quick guide on how to play."));
    }
  };

  const handleInitialInfoDialogClose = () => {
    setCurrentView(VIEW_STATES.PRACTICE);
  };

  const handleToggleOverlayInfoDialog = () => {
    setShowOverlayInfoDialog((prev) => !prev);
  };

  const uploadAudio = useCallback(
    async (audioBlob) => {
      const formData = new FormData();
      formData.append(
        "file",
        new File([audioBlob], `audio_${Date.now()}.wav`, { type: "audio/wav" })
      );
      console.log(language);
      formData.append("language", language);

      setIsTranscribing(true);
      const ProzessToastId = toast.loading(
        t("transcribing", "Transcribing...")
      );

      try {
        console.log("transcribing");
        const response = await fetch("/api/speech-to-text", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        toast.dismiss(ProzessToastId);
        console.log(result);

        if (response.ok && result.transcription) {
          const transcription =
            result.transcription
              .toLowerCase()
              .trim()
              .replace(/[.,!?;:]*$/, "") || "";
          if (step === 2) setAnswer(transcription);
          else if (step === 3) setDescription(transcription);
          toast.success(t("transcriptionReceived", "Transcription received!"));
        } else {
          toast.error(
            result.error ||
              t("transcriptionFailedTryAgain", "Transcription failed.")
          );
        }
      } catch (error) {
        toast.dismiss(ProzessToastId);
        console.error("Error uploading audio:", error);
        toast.error(
          t("errorUploadingAudioCheckConnection", "Audio upload error.")
        );
      } finally {
        setIsTranscribing(false);
      }
    },
    [step, language, t]
  );

  const stopListening = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.onstop = async () => {
        let audioBlob = null;
        if (
          audioChunksRef.current.length > 0 &&
          mediaRecorderRef.current &&
          mediaRecorderRef.current.mimeType
        ) {
          audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorderRef.current.mimeType,
          });
        } else if (audioChunksRef.current.length > 0) {
          audioBlob = new Blob(audioChunksRef.current);
        }
        if (audioBlob) {
          audioChunksRef.current = [];
          await uploadAudio(audioBlob);
        }
        if (mediaRecorderRef.current?.stream) {
          mediaRecorderRef.current.stream
            .getTracks()
            .forEach((track) => track.stop());
        }
        mediaRecorderRef.current = null;
      };
      mediaRecorderRef.current.stop();
    } else {
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
  }, [uploadAudio]);

  const startListening = useCallback(() => {
    if (isRecording || isTranscribing) return;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        audioChunksRef.current = [];
        const options = { mimeType: "audio/webm;codecs=opus" };
        if (!MediaRecorder.isTypeSupported(options.mimeType))
          options.mimeType = "";

        const newMediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = newMediaRecorder;
        newMediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };
        newMediaRecorder.onerror = (event) => {
          console.error("MediaRecorder error:", event.error);
          toast.error(
            t("errorRecording", `Recording error: ${event.error.name}`)
          );
          stopListening();
        };
        newMediaRecorder.onstart = () => {
          setIsRecording(true);
          toast.message(t("recordingStarted", "Recording started!"));
        };
        newMediaRecorder.start();
      })
      .catch((err) => {
        console.error("Mic access error:", err);
        toast.error(
          t(
            "couldNotAccessMicrophoneCheckPermissions",
            "Could not access microphone."
          )
        );
      });
  }, [isRecording, isTranscribing, stopListening, t]);

  const toggleRecording = useCallback(() => {
    if (isRecording) stopListening();
    else startListening();
  }, [isRecording, startListening, stopListening]);

  const handlePracticeComplete = (evaluation) => {
    setPracticeEvaluation(evaluation);
    setCurrentView(VIEW_STATES.PRACTICE_COMPLETE_MODAL);
  };

  const handleRetakeTest = () => {
    if (isContinuous) {
      toast.info("Retaking is not available in continuous assessment mode.");
      return;
    }
    // Reset state for a new test run
    setCurrentIndex(0);
    setResponses([]);
    setTestResults(null);
    setCanSee(null);
    setAnswer("");
    setDescription("");
    setStep(1);
    setCurrentView(VIEW_STATES.WELCOME); // Go back to the welcome screen
  };

  const handleStartMainTest = () => {
    setCurrentIndex(0); // Or 1 if practiceImage was imagesData[0] and you want to avoid repetition
    setResponses([]);
    setTestResults(null);
    resetForNextImage();
    setCurrentView(VIEW_STATES.TEST);
    setTimeout(
      () =>
        speakText(
          (t("start_forward_instructions", "The main test will start now.") ||
            "The main test will start now.") +
            " " +
            (t("canYouSeeThisPicture", "Can you see this picture?") ||
              "Can you see this picture?")
        ),
      500
    );
  };

  const currentImage = images[currentIndex];

  const handleCanSeeSelection = (selection) => {
    setCanSee(selection);
    if (!currentImage) return;
    if (!selection) {
      const currentResp = {
        image: currentImage.imageUrl,
        userAnswer: "N/A (cannot see)",
        correctAnswer: getCorrectAnswerForLang(currentImage),
        isCorrect: false,
        description: "N/A (cannot see)",
        language: language,
        canSee: false,
      };
      const updatedResponses = [...responses, currentResp];
      setResponses(updatedResponses);
      if (currentIndex === images.length - 1)
        submitFinalResults(updatedResponses);
      else nextImage();
    } else {
      setStep(2);
      speakText(t("speakGreatWhatIsIt", "Great! What is it?"));
    }
  };

  const handleNextOrSubmit = () => {
    if (!currentImage) return;
    if (step === 2) {
      if (!answer.trim()) {
        toast.warning(t("pleaseCompleteStep", "Please provide an answer."));
        return;
      }
      setStep(3);
      speakText(t("describeThePicture", "Now, please describe the picture."));
    } else if (step === 3) {
      const correctAnswer = getCorrectAnswerForLang(currentImage);
      const isCorrect =
        answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

      const currentResp = {
        image: currentImage.imageUrl,
        userAnswer: answer,
        correctAnswer: correctAnswer,
        isCorrect,
        description: description,
        language: language,
        canSee: canSee === null ? true : canSee, // Ensure canSee is boolean
      };
      const updatedResponses = [...responses, currentResp];
      setResponses(updatedResponses);
      if (currentIndex === images.length - 1)
        submitFinalResults(updatedResponses);
      else nextImage();
    }
  };

  const resetForNextImage = () => {
    setAnswer("");
    setDescription("");
    setCanSee(null);
    setStep(1);
    if (isRecording) stopListening();
  };

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetForNextImage();
      setTimeout(
        () => speakText(t("canYouSeeThisPicture", "Can you see this picture?")),
        300
      );
    }
  };

  const fetchResultsById = useCallback(
    async (resultId) => {
      const token = localStorage.getItem("access_token");
      setCurrentView(VIEW_STATES.LOADING_RESULTS);
      try {
        const response = await fetch(
          `/api/picture-test/getResultByID?id=${resultId}`,
          {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );
        const resultData = await response.json();
        if (!response.ok)
          throw new Error(resultData.error || "Failed to fetch results.");
        setTestResults(resultData);
        setCurrentView(VIEW_STATES.RESULTS);
      } catch (error) {
        console.error("Fetch results error:", error); // Added console log
        toast.error(t("errorFetchingResults", "Error fetching results.")); // Added toast
        setCurrentView(VIEW_STATES.TEST); // Fallback to test or an error view
      }
    },
    [t]
  ); // Added t

  const submitFinalResults = async (finalResponsesData) => {
    if (isContinuous) {
      if (onTestComplete) {
        const score = finalResponsesData.filter((r) => r.isCorrect).length;
        onTestComplete({
          score,
          total: images.length,
          test: "PictureRecognition",
          responses: finalResponsesData,
        });
      }
      return;
    }

    const token = localStorage.getItem("access_token");
    const childId = localStorage.getItem("childId");

    if (!childId) {
      toast.error(t("selectStudentFirst", "Please select a student first."));
      return;
    }

    setCurrentView(VIEW_STATES.LOADING_SUBMISSION);

    try {
      const apiUrl = "/api/picture-test/submitResult";

      const payload = {
        childId,
        responses: finalResponsesData,
        language: language,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Submission failed");
      }

      fetchResultsById(result.id);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        t("errorSubmittingResults", "An error occurred while submitting.")
      );
      setCurrentView(VIEW_STATES.TEST); // Revert to test view on error
    }
  };

  // Render logic based on view state
  const renderContent = () => {
    switch (currentView) {
      case VIEW_STATES.LOADING_DATA:
        return (
          <LoadingSpinner text={t("loadingTestData", "Loading test data...")} />
        );
      case VIEW_STATES.WELCOME:
        return (
          <WelcomeDialog
            dialogIntroTexts={dialogIntroTexts}
            currentDialog={currentDialog}
            handleNextDialog={handleNextDialog}
            t={t}
          />
        );
      // New Case: Initial Info Dialog
      case VIEW_STATES.INFO_DIALOG_INITIAL:
        return (
          <InfoDialog
            t={t}
            onClose={handleInitialInfoDialogClose}
            title={t("howToPlayTitle", "How to Play")}
          />
        );
      case VIEW_STATES.PRACTICE:
        if (!practiceImage)
          return (
            <LoadingSpinner
              text={t("loadingPracticeImage", "Loading practice...")}
            />
          );
        return (
          <PracticeRound
            practiceImage={practiceImage}
            t={t}
            language={language}
            onPracticeComplete={handlePracticeComplete}
            speakText={speakText}
          />
        );
      case VIEW_STATES.PRACTICE_COMPLETE_MODAL:
        return (
          <PracticeCompleteModal
            t={t}
            onStartMainTest={handleStartMainTest}
            evaluationResult={practiceEvaluation}
          />
        );
      case VIEW_STATES.LOADING_RESULTS: // Added this case for clarity
        return (
          <LoadingSpinner text={t("loadingResults", "Loading results...")} />
        );
      case VIEW_STATES.LOADING_SUBMISSION: // Added this case for clarity
        return (
          <LoadingSpinner
            text={t("submittingResults", "Submitting results...")}
          />
        );
      case VIEW_STATES.RESULTS:
        if (!testResults) {
          setCurrentView(VIEW_STATES.TEST);
          return (
            <LoadingSpinner text={t("loadingResults", "Loading results...")} />
          );
        }
        return (
          <>
            <BackButton t={t} targetPath="/take-tests" />
            <ResultsDisplay
              testResults={testResults}
              t={t}
              onRetakeTest={handleRetakeTest}
            />
          </>
        );
      case VIEW_STATES.TEST:
        if (!currentImage)
          return (
            <LoadingSpinner
              text={t("loadingTestData", "Loading test data...")}
            />
          );
        return (
          <>
            <BackButton t={t} targetPath="/take-tests?skipStart=true" />
            <PictureDialogContent
              currentImage={currentImage}
              currentIndex={currentIndex}
              step={step}
              answer={answer}
              setAnswer={setAnswer}
              description={description}
              setDescription={setDescription}
              handleCanSeeSelection={handleCanSeeSelection}
              isRecording={isRecording}
              mediaRecorderRef={mediaRecorderRef}
              toggleRecording={toggleRecording}
              handleNext={handleNextOrSubmit}
              isSubmitting={
                // isSubmitting is true if loading final submission for the last image/step
                currentView === VIEW_STATES.LOADING_SUBMISSION &&
                currentIndex === images.length - 1 &&
                step === 3
              }
              isLastImage={currentIndex === images.length - 1}
              t={t}
              totalImages={images.length}
            />
          </>
        );
      default:
        return <LoadingSpinner text={t("loading", "Loading...")} />;
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" closeButton duration={3000} />

      {/* Info Button - visible during practice and test */}
      {(currentView === VIEW_STATES.PRACTICE ||
        currentView === VIEW_STATES.TEST) && (
        <button
          onClick={handleToggleOverlayInfoDialog}
          className="fixed top-4 right-4 z-[60] p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white shadow-lg transition-colors active:scale-95"
          aria-label={
            t ? t("showInstructions", "Show Instructions") : "Show Instructions"
          }
          title={
            t ? t("showInstructions", "Show Instructions") : "Show Instructions"
          }
        >
          <FaInfoCircle size={24} />
        </button>
      )}

      {/* Overlay Info Dialog - triggered by the info button */}
      {showOverlayInfoDialog && (
        <InfoDialog
          t={t}
          onClose={handleToggleOverlayInfoDialog}
          title={t("howToPlayTitle", "How to Play")}
        />
      )}

      {renderContent()}
    </>
  );
};

export default PictureRecognitionTestPage;
