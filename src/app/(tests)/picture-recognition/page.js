// app/picture-test/page.js
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import imagesData from "../../../Data/imageData"; // Ensure this path is correct
import BackButton from "../../../components/picture-test/BackButton";
import LoadingSpinner from "../../../components/picture-test/LoadingSpinner";
import PictureDialogContent from "../../../components/picture-test/PictureDialogContent";
import PracticeCompleteModal from "../../../components/picture-test/PracticeCompleteModal"; // New import
import PracticeRound from "../../../components/picture-test/PracticeRoundContent"; // New import
import ResultsDisplay from "../../../components/picture-test/ResultDisplay"; // Corrected import
import WelcomeDialog from "../../../components/picture-test/WelcomeDialog";
import { LanguageProvider, useLanguage } from "../../../contexts/LanguageContext.jsx";

// Define view states
const VIEW_STATES = {
  WELCOME: "welcome",
  PRACTICE: "practice",
  PRACTICE_COMPLETE_MODAL: "practice_complete_modal",
  TEST: "test",
  RESULTS: "results",
  LOADING_SUBMISSION: "loading_submission", // For final test submission
  LOADING_DATA: "loading_data" // For initial data load
};

const PictureRecognitionTestPage = () => {
  const { language, t } = useLanguage();

  const [images, setImages] = useState([]); // Initialize empty, load in useEffect
  const [practiceImage, setPracticeImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canSee, setCanSee] = useState(null);
  const [answer, setAnswer] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(1); // For main test
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [responses, setResponses] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [currentView, setCurrentView] = useState(VIEW_STATES.LOADING_DATA); // Start with loading
  const [currentDialog, setCurrentDialog] = useState(0); // For WelcomeDialog
  const [practiceEvaluation, setPracticeEvaluation] = useState(null);


  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const dialogIntroTexts = [
    t("pictureTestIntroDialog1"), t("pictureTestIntroDialog2"),
    t("pictureTestIntroDialog3"), t("pictureTestIntroDialog4"),
    t("pictureTestIntroDialog5"),
  ];
  
  useEffect(() => {
    // Simulate loading or fetch imagesData
    if (imagesData && imagesData.length > 0) {
      setImages(imagesData);
      setPracticeImage(imagesData[0]); // Use the first image for practice
      setCurrentView(VIEW_STATES.WELCOME);
    } else {
      // Handle case where imagesData might be empty or undefined
      toast.error(t("errorLoadingImageData") || "Error: Could not load image data.");
      // Potentially set to an error view or redirect
    }
  }, [t]); // Added t to dependencies

  const getCorrectAnswerForLang = useCallback((imageItem) => {
    if (!imageItem) return "";
    return language === "ta" ? (imageItem.correctAnswerTamil || imageItem.correctAnswer)
        : language === "hi" ? (imageItem.correctAnswerHindi || imageItem.correctAnswer)
        : imageItem.correctAnswer;
  }, [language]);

  const speakText = useCallback((text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && text) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = language;
      speech.rate = 0.9;
      speech.pitch = 1.1;
      window.speechSynthesis.speak(speech);
    }
  }, [language]);

  const handleNextDialog = () => {
    if (currentDialog < dialogIntroTexts.length - 1) {
      setCurrentDialog((prev) => prev + 1);
    } else {
      setCurrentView(VIEW_STATES.PRACTICE); // Transition to Practice Round
      // speakText for practice round will be handled by PracticeRound component itself
    }
  };

  // --- Main Test Recording Logic ---
  const uploadAudio = useCallback(async (audioBlob) => {
    // This is for the MAIN TEST, PracticeRound has its own.
    const formData = new FormData();
    formData.append("file", new File([audioBlob], `audio_${Date.now()}.wav`, { type: "audio/wav" }));
    formData.append("language", language);

    setIsTranscribing(true);
    const ProzessToastId = toast.loading(t("transcribing") || "Transcribing...");

    try {
      const response = await fetch("/api/speech-to-text", { method: "POST", body: formData });
      const result = await response.json();
      toast.dismiss(ProzessToastId);

      if (response.ok && result.transcription) {
        const transcription = result.transcription.toLowerCase().trim().replace(/[.,!?;:]*$/, "") || "";
        // 'step' here refers to the main test's step state
        if (step === 2) setAnswer(transcription); 
        else if (step === 3) setDescription(transcription);
        toast.success(t("transcriptionReceived") || "Transcription received!");
      } else {
        toast.error(result.error || t("transcriptionFailedTryAgain") || "Transcription failed.");
      }
    } catch (error) {
      toast.dismiss(ProzessToastId);
      console.error("Error uploading audio:", error);
      toast.error(t("errorUploadingAudioCheckConnection") || "Audio upload error.");
    } finally {
      setIsTranscribing(false);
    }
  }, [step, language, t]); // 'step' is crucial here

  const stopListening = useCallback(() => {
    // This is for the MAIN TEST
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current.mimeType });
        if (audioChunksRef.current.length > 0) {
           audioChunksRef.current = []; // Clear before async operation
           await uploadAudio(audioBlob);
        }
        if (mediaRecorderRef.current?.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        mediaRecorderRef.current = null;
      };
      mediaRecorderRef.current.stop();
    } else {
        if (mediaRecorderRef.current?.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        mediaRecorderRef.current = null;
    }
    setIsRecording(false);
  }, [uploadAudio]);

  const startListening = useCallback(() => {
    // This is for the MAIN TEST
    if (isRecording || isTranscribing) return;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        audioChunksRef.current = [];
        const options = { mimeType: 'audio/webm;codecs=opus' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) options.mimeType = '';
        
        const newMediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = newMediaRecorder;
        newMediaRecorder.ondataavailable = event => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
        newMediaRecorder.onerror = event => {
          console.error("MediaRecorder error:", event.error);
          toast.error(t("errorRecording") || `Recording error: ${event.error.name}`);
          stopListening();
        };
        newMediaRecorder.onstart = () => { setIsRecording(true); toast.message(t("recordingStarted") || "Recording started!");};
        newMediaRecorder.start();
      }).catch(err => {
        console.error("Mic access error:", err);
        toast.error(t("couldNotAccessMicrophoneCheckPermissions") || "Could not access microphone.");
      });
  }, [isRecording, isTranscribing, stopListening, t]);

  const toggleRecording = useCallback(() => {
    // This is for the MAIN TEST
    if (isRecording) stopListening();
    else startListening();
  }, [isRecording, startListening, stopListening]);
  // --- End Main Test Recording Logic ---

  const handlePracticeComplete = (evaluation) => {
    setPracticeEvaluation(evaluation); // Save evaluation result
    setCurrentView(VIEW_STATES.PRACTICE_COMPLETE_MODAL);
    // Toast for evaluation is shown by PracticeRound itself
  };

  const handleStartMainTest = () => {
    setCurrentIndex(0);
    setResponses([]);
    setTestResults(null);
    resetForNextImage(); // Resets step, answer, description, canSee for main test
    setCurrentView(VIEW_STATES.TEST);
    setTimeout(() => speakText(t("start_forward_instructions") + " " + t("canYouSeeThisPicture")), 500);
  };
  
  const currentImage = images[currentIndex];

  const handleCanSeeSelection = (selection) => { // For Main Test
    setCanSee(selection);
    if (!currentImage) return;
    if (!selection) {
      const currentResp = {
        image: currentImage.imageUrl, userAnswer: "N/A (cannot see)",
        correctAnswer: getCorrectAnswerForLang(currentImage), description: "N/A (cannot see)",
        language: language, canSee: false,
      };
      const updatedResponses = [...responses, currentResp];
      setResponses(updatedResponses);
      if (currentIndex === images.length - 1) submitFinalResults(updatedResponses);
      else nextImage();
    } else {
      setStep(2);
      speakText(t("speakGreatWhatIsIt"));
    }
  };

  const handleNextOrSubmit = () => { // For Main Test
    if (!currentImage) return;
    if (step === 2) {
      if (!answer.trim()) { toast.warning(t("pleaseCompleteStep") || "Please provide an answer."); return; }
      setStep(3);
      speakText(t("describeThePicture"));
    } else if (step === 3) {
      const currentResp = {
        image: currentImage.imageUrl, userAnswer: answer,
        correctAnswer: getCorrectAnswerForLang(currentImage), description: description,
        language: language, canSee: true,
      };
      const updatedResponses = [...responses, currentResp];
      setResponses(updatedResponses);
      if (currentIndex === images.length - 1) submitFinalResults(updatedResponses);
      else nextImage();
    }
  };

  const resetForNextImage = () => {
    setAnswer(""); setDescription(""); setCanSee(null); setStep(1);
    if (isRecording) stopListening();
  };

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetForNextImage();
      setTimeout(() => speakText(t("canYouSeeThisPicture")), 300);
    }
  };

  const submitFinalResults = async (finalResponsesData) => {
    const token = localStorage.getItem("access_token");
    const childId = localStorage.getItem("childId");
    if (!childId || !token) {
      toast.error(t("authOrStudentDataMissing") || "Student/Auth data missing.");
      return;
    }
    setCurrentView(VIEW_STATES.LOADING_SUBMISSION);
    const submissionToastId = toast.loading(t("processingYourResults") || "Processing results...");
    try {
      const response = await fetch("/api/picture-test/submitResult", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ child_id: childId, answers: finalResponsesData }),
      });
      const resultData = await response.json();
      toast.dismiss(submissionToastId);
      if (!response.ok) throw new Error(resultData.error || `Submission failed. Status: ${response.status}`);
      setTestResults(resultData);
      toast.success(t("testSubmittedSuccessfully") || "Test submitted successfully!");
      setCurrentView(VIEW_STATES.RESULTS);
    } catch (error) {
      toast.dismiss(submissionToastId);
      console.error("Error submitting test:", error);
      toast.error(error.message || t("failedToSubmitTest") || "Failed to submit.");
      setCurrentView(VIEW_STATES.TEST); // Go back to test view or an error view
    }
  };

  const handleRetakeTest = () => {
    setCurrentDialog(0); // Reset welcome dialog
    setCurrentView(VIEW_STATES.WELCOME); // Start from welcome
    // Other states like currentIndex, responses will be reset when main test starts
  };

  useEffect(() => {
    return () => { // Cleanup
      if (isRecording) stopListening();
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [isRecording, stopListening]);


  // --- Conditional Rendering based on currentView ---
  const renderContent = () => {
    switch (currentView) {
      case VIEW_STATES.LOADING_DATA:
        return <LoadingSpinner text={t("loadingTestData") || "Loading test data..."} />;
      case VIEW_STATES.WELCOME:
        return <WelcomeDialog dialogIntroTexts={dialogIntroTexts} currentDialog={currentDialog} handleNextDialog={handleNextDialog} t={t} />;
      case VIEW_STATES.PRACTICE:
        if (!practiceImage) return <LoadingSpinner text={t("loadingPracticeImage") || "Loading practice..."} />;
        return <PracticeRound practiceImage={practiceImage} t={t} language={language} onPracticeComplete={handlePracticeComplete} speakText={speakText} />;
      case VIEW_STATES.PRACTICE_COMPLETE_MODAL:
        return <PracticeCompleteModal t={t} onStartMainTest={handleStartMainTest} evaluationResult={practiceEvaluation} />;
      case VIEW_STATES.LOADING_SUBMISSION:
        return <LoadingSpinner text={t("processingYourResults") || "Processing..."} />;
      case VIEW_STATES.RESULTS:
        if (!testResults) { // Should ideally not happen if view is RESULTS
             setCurrentView(VIEW_STATES.TEST); // Fallback
             return <LoadingSpinner text={t("loadingResults")}/>;
        }
        return (
            <>
                <BackButton t={t} targetPath="/take-tests"/>
                <ResultsDisplay testResults={testResults} t={t} onRetakeTest={handleRetakeTest} />
            </>
        );
      case VIEW_STATES.TEST:
        if (!currentImage) return <LoadingSpinner text={t("loadingTestData") || "Loading test data..."} />;
        return (
          <>
            <BackButton t={t} targetPath="/take-tests"/>
            <PictureDialogContent
              currentImage={currentImage} currentIndex={currentIndex} step={step}
              answer={answer} setAnswer={setAnswer} description={description} setDescription={setDescription}
              handleCanSeeSelection={handleCanSeeSelection} isRecording={isRecording} mediaRecorderRef={mediaRecorderRef}
              toggleRecording={toggleRecording} handleNext={handleNextOrSubmit}
              isSubmitting={currentView === VIEW_STATES.LOADING_SUBMISSION && currentIndex === images.length - 1 && step === 3} // Corrected isSubmitting condition
              isLastImage={currentIndex === images.length - 1} t={t} totalImages={images.length}
            />
          </>
        );
      default:
        return <LoadingSpinner text={t("loading") || "Loading..."} />;
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" closeButton duration={3000} />
      {renderContent()}
    </>
  );
};

export default function PictureTestPageContainer() {
  return (
    <LanguageProvider>
      <PictureRecognitionTestPage />
    </LanguageProvider>
  );
}