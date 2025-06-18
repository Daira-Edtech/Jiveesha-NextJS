// components/PictureTest/PracticeRound.jsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronRight, FaEye, FaEyeSlash, FaMicrophone, FaStopCircle } from "react-icons/fa";
import { toast } from "sonner";

const TIDEPOOL_BACKGROUND_IMG_PATH_CONTENT = "/picture-test/backgroundImage.png";

export default function PracticeRound({
  practiceImage,
  t,
  language,
  onPracticeComplete,
  speakText,
}) {
  const [step, setStep] = useState(1);
  const [canSee, setCanSee] = useState(null);
  const [answer, setAnswer] = useState("");
  const [description, setDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const titleText =
    step === 1
      ? t("canYouSeeThisPicture") || "Can you see this picture?"
      : step === 2
      ? t("whatIsIt") || "What is it?"
      : t("describeThePicture") || "Describe the picture.";

  const getCorrectAnswerForLangPractice = useCallback((imageItem) => {
    if (!imageItem) return "";
     return language === "ta" ? (imageItem.correctAnswerTamil || imageItem.correctAnswer)
         : language === "hi" ? (imageItem.correctAnswerHindi || imageItem.correctAnswer)
         : imageItem.correctAnswer;
  }, [language]);

  const currentCorrectAnswer = getCorrectAnswerForLangPractice(practiceImage);

  const uploadAudio = useCallback(async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", new File([audioBlob], `practice_audio_${Date.now()}.wav`, { type: "audio/wav" }));
    formData.append("language", language);
    setIsTranscribing(true);
    const ProzessToastId = toast.loading(t("transcribing") || "Transcribing...");
    try {
      const response = await fetch("/api/speech-to-text", { method: "POST", body: formData });
      const result = await response.json();
      toast.dismiss(ProzessToastId);
      if (response.ok && result.transcription) {
        const transcription = result.transcription.toLowerCase().trim().replace(/[.,!?;:]*$/, "") || "";
        if (step === 2) setAnswer(transcription);
        else if (step === 3) setDescription(transcription);
        toast.success(t("transcriptionReceived") || "Transcription received!");
      } else {
        toast.error(result.error || (t("transcriptionFailedTryAgain") || "Transcription failed."));
      }
    } catch (error) {
      toast.dismiss(ProzessToastId);
      console.error("Error uploading practice audio:", error);
      toast.error(t("errorUploadingAudioCheckConnection") || "Audio upload error.");
    } finally {
      setIsTranscribing(false);
    }
  }, [step, language, t]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.onstop = async () => {
        const mimeType = mediaRecorderRef.current?.mimeType;
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || undefined });
        
        if (audioChunksRef.current.length > 0) {
          audioChunksRef.current = [];
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
    if (isRecording || isTranscribing) return;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        audioChunksRef.current = [];
        const options = { mimeType: 'audio/webm;codecs=opus' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.warn("audio/webm;codecs=opus not supported, falling back to default.");
            options.mimeType = ''; 
        }
        const newMediaRecorder = new MediaRecorder(stream, options.mimeType ? options : undefined);
        mediaRecorderRef.current = newMediaRecorder;
        newMediaRecorder.ondataavailable = event => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
        newMediaRecorder.onerror = event => {
          console.error("Practice MediaRecorder error:", event.error);
          toast.error((t("errorRecording") || "Recording error:") + ` ${event.error.name}`);
          stopListening();
        };
        newMediaRecorder.onstart = () => { setIsRecording(true); toast.message(t("recordingStarted") || "Recording started!"); };
        newMediaRecorder.start();
      }).catch(err => {
        console.error("Practice Mic access error:", err);
        toast.error(t("couldNotAccessMicrophoneCheckPermissions") || "Could not access microphone.");
      });
  }, [isRecording, isTranscribing, stopListening, t]);

  const toggleRecording = useCallback(() => {
    if (isRecording) stopListening();
    else startListening();
  }, [isRecording, startListening, stopListening]);

  const evaluatePractice = () => {
    let evaluation = { score: 0, message: "", sawImage: canSee, userAnswer: answer, correctAnswer: currentCorrectAnswer };
    let toastMessage = "";
    if (canSee === false) {
      toastMessage = t("practiceFeedback.cantSee", "Practice: You indicated you couldn't see the image.");
      evaluation.message = toastMessage;
      toast.info(toastMessage);
    } else {
      const userAnswerTrimmed = answer.trim().toLowerCase();
      const correctAnswerTrimmed = (currentCorrectAnswer || "").trim().toLowerCase();
      if (userAnswerTrimmed === correctAnswerTrimmed) {
        evaluation.score = 2;
        toastMessage = t("practiceFeedback.correct", "Practice: Great job! You identified it correctly.");
        evaluation.message = toastMessage;
        toast.success(toastMessage);
      } else {
        evaluation.score = 1; 
        toastMessage = t("practiceFeedback.goodTry", "Practice: Good try! The correct answer was: {{correctAnswer}}.", { correctAnswer: currentCorrectAnswer });
        evaluation.message = toastMessage;
        toast.warning(toastMessage);
      }
    }
    onPracticeComplete(evaluation);
  };

  const handleCanSeeSelection = (selection) => {
    setCanSee(selection);
    if (!selection) {
      evaluatePractice();
    } else { 
      setStep(2);
      if (speakText) speakText(t("speakGreatWhatIsIt") || "Great! What is it?");
    }
  };

  const handleNext = () => {
    if (step === 2) {
      if (!answer.trim()) { toast.warning(t("pleaseCompleteStep") || "Please provide an answer."); return; }
      setStep(3);
      if (speakText) speakText(t("describeThePicture") || "Now, please describe the picture.");
    } else if (step === 3) {
      evaluatePractice();
    }
  };
  
  useEffect(() => {
    if (speakText && step === 1) {
        speakText((t("practiceRoundTitle") || "Practice Round") + ". " + (t("canYouSeeThisPicture") || "Can you see this picture?"));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speakText, t, step]); 

  const imageContainerBaseClasses = "relative mb-3 sm:mb-4 w-full shadow-lg overflow-hidden rounded-xl mx-auto";
  const imageContainerBaseStyle = { backgroundColor: "rgba(253, 246, 227, 0.05)" };
  let imageContainerStyle = { ...imageContainerBaseStyle };
  let imageContainerSpecificClasses = "";

  // The step 1 image size is 280px. If the dialog is much shorter, this takes up a large portion.
  // Consider if this needs to be adjusted if the dialog height is very small.
  // For now, I'll keep it as is, and scrolling will handle overflow.
  if (step === 1) {
    const sizeStep1 = "280px"; // This is approx 17.5rem
    imageContainerStyle.height = sizeStep1; imageContainerStyle.width = sizeStep1;
    imageContainerSpecificClasses = `max-w-[${sizeStep1}]`;
  } else { 
    imageContainerSpecificClasses = `max-w-md w-full`; 
    imageContainerStyle.aspectRatio = "16/10";
    imageContainerStyle.height = undefined; 
    imageContainerStyle.width = undefined;  
  }

  if (!practiceImage) return <div className="text-white p-4 text-center">{t("loadingPracticeImage") || "Loading practice image..."}</div>;

  const yesButtonClasses = "px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-1.5 transition-all duration-150 bg-[#6CB4A3]/80 hover:bg-[#6CB4A3] focus:ring-2 focus:ring-[#6CB4A3] border-2 border-white/50";
  const noButtonClasses = "px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-1.5 transition-all duration-150 bg-[#A3D8D0]/70 hover:bg-[#A3D8D0]/90 border-2 border-white/70 focus:ring-2 focus:ring-white";
  const actionButtonClasses = "w-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-1.5 transition-all duration-150 bg-[#A3D8D0]/70 hover:bg-[#A3D8D0]/90 border-2 border-white/70 focus:ring-2 focus:ring-white";
  const recordingButtonActiveClasses = "ring-2 ring-red-500 ring-opacity-70 !bg-red-500/70 hover:!bg-red-600/80";


  return (
    <div className="h-screen w-full fixed inset-0 flex flex-col items-center justify-center p-2 sm:p-3 overflow-hidden">
      {TIDEPOOL_BACKGROUND_IMG_PATH_CONTENT && (
        <Image src={TIDEPOOL_BACKGROUND_IMG_PATH_CONTENT} alt={t('tidepoolBackgroundAlt') || "Background"} fill style={{ objectFit: "cover" }} className="-z-10 fixed inset-0" priority sizes="100vw"/>
      )}
      <motion.div
        key={`practice-${practiceImage.id}-${step}`}
        // MODIFIED: Reduced height to h-[32.5rem] (520px).
        // Adjusted max-h slightly.
        className="w-full max-w-md md:max-w-lg h-[32.5rem] max-h-[90vh] sm:max-h-[88vh] 
                   bg-[#FDF6E3]/20 backdrop-blur-xl rounded-3xl shadow-2xl 
                   border border-[#6CB4A3]/60 
                   flex flex-col overflow-hidden"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ boxShadow: "0 10px 30px -10px rgba(60, 110, 113, 0.4)" }}
      >
        <div className="bg-gradient-to-r from-[#3C6E71]/90 to-[#4B7F52]/90 p-3 sm:p-4 text-center relative flex-shrink-0">
          <motion.h2 key={titleText} className="text-lg sm:text-xl md:text-2xl font-bold text-white" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {`${t("practiceRoundTitle") || "Practice Round"}: ${titleText}`}
          </motion.h2>
        </div>
        <div className="p-3 sm:p-4 flex flex-col items-center flex-1 overflow-y-auto">
          <div className={`${imageContainerBaseClasses} ${imageContainerSpecificClasses}`} style={imageContainerStyle}>
            {practiceImage.imageUrl ? (
                <Image 
                    src={practiceImage.imageUrl} 
                    alt={t("altTidepoolReflection") || practiceImage.correctAnswer || "Practice image"} 
                    fill 
                    style={{ objectFit: "contain" }} 
                    priority 
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 448px, 512px"
                    onError={(e) => console.error(`Practice Image Load Error: ${e.target.src}`)}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                    {t("imageNotAvailable", "Image not available")}
                </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/20 via-black/10 to-transparent pointer-events-none" />
          </div>
          <div className="w-full max-w-md space-y-2 mt-auto pt-2 sm:pt-3">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} 
                  className={yesButtonClasses}
                  onClick={() => handleCanSeeSelection(true)}> 
                  <FaEye className="text-white/90 text-sm sm:text-base" /> {t("yesICan") || "Yes, I can"}
                </motion.button>
                <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97, opacity: 0.85 }} 
                  className={noButtonClasses}
                  onClick={() => handleCanSeeSelection(false)}> 
                  <FaEyeSlash className="text-white text-sm sm:text-base" /> {t("noICan") || "No, I can't"}
                </motion.button>
              </motion.div>
            )}
            {(step === 2 || step === 3) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-2 sm:space-y-3">
                <input type="text" value={step === 2 ? answer : description} 
                  onChange={(e) => step === 2 ? setAnswer(e.target.value) : setDescription(e.target.value)} 
                 className="w-full p-2.5 text-xs sm:text-sm border-2 border-white/50 focus:border-white 
                           bg-black/20 backdrop-blur-sm text-white placeholder:text-gray-300/70 
                           rounded-lg focus:ring-2 focus:ring-white/60 outline-none transition-all text-center"
                  placeholder={step === 2 ? (t("typeWhatYouSee") || "Type what you see...") : (t("describeThePicture") || "Describe the picture...")} 
                  aria-label={step === 2 ? (t("typeWhatYouSee") || "Type what you see...") : (t("describeThePicture") || "Describe the picture...")}
                />
                <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97, opacity: 0.85 }}
                    onClick={toggleRecording}
                    disabled={isTranscribing}
                    className={`${actionButtonClasses} group ${isRecording ? recordingButtonActiveClasses : "" }`}
                >
                  {isRecording ? (
                    <> 
                      <FaStopCircle className="text-sm sm:text-base" /> 
                      <span className="ml-1">{t("stopRecording") || "Stop Recording"}</span>
                    </>
                  ) : (
                    <> 
                      <FaMicrophone className="text-sm sm:text-base" /> 
                      {t("useVoiceInput") || "Use Voice Input"}
                    </>
                  )}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97, opacity: 0.85 }}
                    onClick={handleNext}
                    className={`${actionButtonClasses} group`}
                >
                  <span>{step === 3 ? (t("finishPractice") || "Finish Practice") : (t("continue") || "Continue")}</span>
                  {step !== 3 && <FaChevronRight className="ml-1 transform transition-transform duration-150 group-hover:translate-x-0.5 text-xs sm:text-sm" />}
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}