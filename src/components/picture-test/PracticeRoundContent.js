// components/PictureTest/PracticeRound.jsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaChevronRight,
  FaEye,
  FaEyeSlash,
  FaMicrophone,
  FaStopCircle,
} from "react-icons/fa";
import { toast } from "sonner";

const TIDEPOOL_BACKGROUND_IMG_PATH_CONTENT =
  "/picture-test/backgroundImage.png";

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

  const getCorrectAnswerForLangPractice = useCallback(
    (imageItem) => {
      if (!imageItem) return "";
      return language === "ta"
        ? imageItem.correctAnswerTamil || imageItem.correctAnswer
        : language === "hi"
        ? imageItem.correctAnswerHindi || imageItem.correctAnswer
        : language === "kn"
        ? imageItem.correctAnswerKannada || imageItem.correctAnswer
        : imageItem.correctAnswer;
    },
    [language]
  );

  const currentCorrectAnswer = getCorrectAnswerForLangPractice(practiceImage);

  const uploadAudio = useCallback(
    async (audioBlob) => {
      const formData = new FormData();
      formData.append(
        "file",
        new File([audioBlob], `practice_audio_${Date.now()}.wav`, {
          type: "audio/wav",
        })
      );
      formData.append("language", language);
      setIsTranscribing(true);
      const ProzessToastId = toast.loading(
        t("transcribing") || "Transcribing..."
      );
      try {
        const response = await fetch("/api/speech-to-text", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        toast.dismiss(ProzessToastId);
        if (response.ok && result.transcription) {
          const transcription =
            result.transcription
              .toLowerCase()
              .trim()
              .replace(/[.,!?;:]*$/, "") || "";
          if (step === 2) setAnswer(transcription);
          else if (step === 3) setDescription(transcription);
          toast.success(
            t("transcriptionReceived") || "Transcription received!"
          );
        } else {
          toast.error(
            result.error ||
              t("transcriptionFailedTryAgain") ||
              "Transcription failed."
          );
        }
      } catch (error) {
        toast.dismiss(ProzessToastId);
        console.error("Error uploading practice audio:", error);
        toast.error(
          t("errorUploadingAudioCheckConnection") || "Audio upload error."
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
        const mimeType = mediaRecorderRef.current?.mimeType;
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType || undefined,
        });

        if (audioChunksRef.current.length > 0) {
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
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.warn(
            "audio/webm;codecs=opus not supported, falling back to default."
          );
          options.mimeType = "";
        }
        const newMediaRecorder = new MediaRecorder(
          stream,
          options.mimeType ? options : undefined
        );
        mediaRecorderRef.current = newMediaRecorder;
        newMediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };
        newMediaRecorder.onerror = (event) => {
          console.error("Practice MediaRecorder error:", event.error);
          toast.error(
            (t("errorRecording") || "Recording error:") + ` ${event.error.name}`
          );
          stopListening();
        };
        newMediaRecorder.onstart = () => {
          setIsRecording(true);
          toast.message(t("recordingStarted") || "Recording started!");
        };
        newMediaRecorder.start();
      })
      .catch((err) => {
        console.error("Practice Mic access error:", err);
        toast.error(
          t("couldNotAccessMicrophoneCheckPermissions") ||
            "Could not access microphone."
        );
      });
  }, [isRecording, isTranscribing, stopListening, t]);

  const toggleRecording = useCallback(() => {
    if (isRecording) stopListening();
    else startListening();
  }, [isRecording, startListening, stopListening]);

  const evaluatePractice = () => {
    let evaluation = {
      score: 0,
      message: "",
      sawImage: canSee,
      userAnswer: answer,
      correctAnswer: currentCorrectAnswer,
    };
    let toastMessage = "";
    if (canSee === false) {
      toastMessage = t(
        "practiceFeedback.cantSee",
        "Practice: You indicated you couldn't see the image."
      );
      evaluation.message = toastMessage;
      toast.info(toastMessage);
    } else {
      const userAnswerTrimmed = answer.trim().toLowerCase();
      const correctAnswerTrimmed = (currentCorrectAnswer || "")
        .trim()
        .toLowerCase();
      if (userAnswerTrimmed === correctAnswerTrimmed) {
        evaluation.score = 2;
        toastMessage = t(
          "practiceFeedback.correct",
          "Practice: Great job! You identified it correctly."
        );
        evaluation.message = toastMessage;
        toast.success(toastMessage);
      } else {
        evaluation.score = 1;
        toastMessage = t(
          "practiceFeedback.goodTry",
          "Practice: Good try! The correct answer was: {{correctAnswer}}.",
          { correctAnswer: currentCorrectAnswer }
        );
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
      if (!answer.trim()) {
        toast.warning(t("pleaseCompleteStep") || "Please provide an answer.");
        return;
      }
      setStep(3);
      if (speakText)
        speakText(
          t("describeThePicture") || "Now, please describe the picture."
        );
    } else if (step === 3) {
      evaluatePractice();
    }
  };

  useEffect(() => {
    if (speakText && step === 1) {
      speakText(
        (t("practiceRoundTitle") || "Practice Round") +
          ". " +
          (t("canYouSeeThisPicture") || "Can you see this picture?")
      );
    }
  }, [speakText, t, step]);

  const imageContainerBaseClasses =
    "relative mb-3 sm:mb-4 w-full shadow-lg overflow-hidden rounded-xl mx-auto";
  const imageContainerBaseStyle = {
    backgroundColor: "rgba(253, 246, 227, 0.05)",
  };
  let imageContainerStyle = { ...imageContainerBaseStyle };
  let imageContainerSpecificClasses = "";

  if (step === 1) {
    const sizeStep1 = "280px"; // This is approx 17.5rem
    imageContainerStyle.height = sizeStep1;
    imageContainerStyle.width = sizeStep1;
    imageContainerSpecificClasses = `max-w-[${sizeStep1}]`;
  } else {
    imageContainerSpecificClasses = `max-w-md w-full`;
    imageContainerStyle.aspectRatio = "16/10";
    imageContainerStyle.height = undefined;
    imageContainerStyle.width = undefined;
  }

  if (!practiceImage)
    return (
      <div className="text-white p-4 text-center">
        {t("loadingPracticeImage") || "Loading practice image..."}
      </div>
    );

  const yesButtonClasses =
    "px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-1.5 transition-all duration-150 bg-[#6CB4A3]/80 hover:bg-[#6CB4A3] focus:ring-2 focus:ring-[#6CB4A3] border-2 border-white/50";
  const noButtonClasses =
    "px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-1.5 transition-all duration-150 bg-[#A3D8D0]/70 hover:bg-[#A3D8D0]/90 border-2 border-white/70 focus:ring-2 focus:ring-white";
  const actionButtonClasses =
    "w-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center gap-1.5 transition-all duration-150 bg-[#A3D8D0]/70 hover:bg-[#A3D8D0]/90 border-2 border-white/70 focus:ring-2 focus:ring-white";
  const recordingButtonActiveClasses =
    "ring-2 ring-red-500 ring-opacity-70 !bg-red-500/70 hover:!bg-red-600/80";

  return (
    <div className="h-screen w-full fixed inset-0 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {TIDEPOOL_BACKGROUND_IMG_PATH_CONTENT && (
        <Image
          src={TIDEPOOL_BACKGROUND_IMG_PATH_CONTENT}
          alt={t("tidepoolBackgroundAlt") || "Background"}
          fill
          style={{ objectFit: "cover" }}
          className="-z-10 fixed inset-0 filter blur-sm"
          priority
          sizes="100vw"
        />
      )}
      <motion.div
        key={`practice-${practiceImage.id}-${step}`}
        className="w-full max-w-3xl bg-[#FDF6E3]/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-[#6CB4A3]/50 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ boxShadow: "0 10px 30px -10px rgba(60, 110, 113, 0.3)" }}
      >
        <div className="bg-gradient-to-r from-[#3C6E71]/90 to-[#4B7F52]/90 p-6 text-center relative overflow-hidden">
          <motion.h2
            key={titleText}
            className="text-2xl md:text-3xl font-bold text-white relative z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {`${t("practiceRoundTitle") || "Practice Round"}: ${titleText}`}
          </motion.h2>
        </div>
        <div className="p-6 flex flex-col items-center overflow-y-auto">
          <motion.div
            className="relative rounded-xl overflow-hidden border-2 border-[#6CB4A3]/50 shadow-lg"
            whileHover={{ scale: 1.01 }}
            style={{
              maxWidth: "100%",
              width: "fit-content",
              backgroundColor: "rgba(253, 246, 227, 0.1)",
            }}
          >
            {practiceImage.imageUrl ? (
              <>
                <Image
                  src={practiceImage.imageUrl}
                  alt={
                    t("altTidepoolReflection") ||
                    practiceImage.correctAnswer ||
                    "Practice image"
                  }
                  width={500}
                  height={350}
                  className="max-h-80 sm:max-h-96 object-contain mx-auto"
                  style={{ maxWidth: "100%", height: "auto", display: "block" }}
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#3C6E71]/30 to-transparent pointer-events-none" />
              </>
            ) : (
              <div className="w-96 h-80 flex items-center justify-center text-gray-300">
                {t("imageNotAvailable", "Image not available")}
              </div>
            )}
          </motion.div>
          <div className="mt-8 w-full max-w-md space-y-4">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 5px 15px rgba(75, 127, 82, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#4B7F52] to-[#6CB4A3] text-white font-bold rounded-xl shadow-lg relative overflow-hidden"
                  onClick={() => handleCanSeeSelection(true)}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <FaEye className="text-white/90" />{" "}
                    {t("yesICan") || "Yes, I can"}
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 5px 15px rgba(255, 202, 212, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#FFCAD4] to-[#FFE57F] text-[#3E2F2F] font-bold rounded-xl shadow-lg relative overflow-hidden"
                  onClick={() => handleCanSeeSelection(false)}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <FaEyeSlash className="text-[#3E2F2F]/90" />{" "}
                    {t("noICan") || "No, I can't"}
                  </span>
                </motion.button>
              </motion.div>
            )}
            {(step === 2 || step === 3) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <input
                  type="text"
                  value={step === 2 ? answer : description}
                  onChange={(e) =>
                    step === 2
                      ? setAnswer(e.target.value)
                      : setDescription(e.target.value)
                  }
                  className="w-full p-4 border-2 border-[#A3D8D0] rounded-xl focus:border-[#3C6E71] focus:ring-2 focus:ring-[#A3D8D0] outline-none transition-all text-lg bg-[#FDF6E3]/90 backdrop-blur-sm text-gray-800 placeholder:text-gray-500"
                  placeholder={
                    step === 2 ? t("typeWhatYouSee") : t("describeThePicture")
                  }
                  aria-label={
                    step === 2 ? t("typeWhatYouSee") : t("describeThePicture")
                  }
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleRecording}
                  disabled={isTranscribing}
                  className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold relative overflow-hidden transition-all ${
                    isRecording
                      ? "bg-gradient-to-r from-[#FFCAD4] to-[#FFE57F] text-[#3E2F2F]"
                      : "bg-gradient-to-r from-[#3C6E71] to-[#4B7F52] text-white"
                  }`}
                >
                  {isRecording ? (
                    <div className="relative z-10 flex items-center gap-2">
                      <div className="flex space-x-1 items-center">
                        <motion.div
                          key={1}
                          className="w-2 h-2 bg-[#3E2F2F] rounded-full"
                          animate={{ height: [2, 10, 2] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                        />
                        <motion.div
                          key={2}
                          className="w-2 h-2 bg-[#3E2F2F] rounded-full"
                          animate={{ height: [2, 10, 2] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                        />
                        <motion.div
                          key={3}
                          className="w-2 h-2 bg-[#3E2F2F] rounded-full"
                          animate={{ height: [2, 10, 2] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: 0.6,
                          }}
                        />
                      </div>
                      {t("stopRecording") || "Stop Recording"}
                    </div>
                  ) : (
                    <div className="relative z-10 flex items-center gap-2">
                      <FaMicrophone />
                      {t("useVoiceInput") || "Use Voice Input"}
                    </div>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 5px 20px rgba(60, 110, 113, 0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white relative overflow-hidden transition-all bg-gradient-to-r from-[#3C6E71] to-[#6CB4A3]`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {step === 3
                      ? t("finishPractice") || "Finish Practice"
                      : t("continue") || "Continue"}
                    {step !== 3 && <FaChevronRight />}
                  </span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
