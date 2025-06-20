import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Lightbulb, ArrowRight } from "lucide-react";
import axios from "axios";
import practiceWord from "@/Data/practiceWord";
import WordDisplay from "./WordDisplay";
import DefinitionInput from "./DefinitionInput";
import RecordingButton from "./RecordingButton";
import { useLanguage } from "@/contexts/LanguageContext";

// Custom audio recorder hook for practice round
const usePracticeAudioRecorder = (onAudioCaptured) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const isRecordingRef = useRef(isRecording);
  const { language, t } = useLanguage();

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const uploadAudio = useCallback(
    async (audioBlob) => {
      const formData = new FormData();
      const file = new File([audioBlob], "practice_definition.wav", {
        type: "audio/wav",
      });
      formData.append("file", file);
      formData.append("language", language);
      setIsTranscribing(true);
      setError(null);
      try {
        const response = await fetch(`/api/speech-to-text`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.transcription) {
          onAudioCaptured(data.transcription);
        } else {
          throw new Error("No transcription received");
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError(
          t("audioUploadFailed") || "Failed to process audio. Please try again."
        );
      } finally {
        setIsTranscribing(false);
      }
    },
    [language, onAudioCaptured, t]
  );

  const startListening = useCallback(async () => {
    if (isRecording) return;
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        uploadAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
      setError(
        t("microphoneAccessDenied") ||
          "Microphone access denied. Please allow microphone access and try again."
      );
    }
  }, [isRecording, uploadAudio, t]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && isRecordingRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  return {
    isRecording,
    isTranscribing,
    error,
    startListening,
    stopListening,
  };
};

const PracticeRound = ({ language, t, onPracticeComplete }) => {
  const [currentDefinition, setCurrentDefinition] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [practiceComplete, setPracticeComplete] = useState(false);

  // Handle transcription completion for practice
  const handlePracticeTranscription = useCallback((transcription) => {
    setCurrentDefinition(transcription);
  }, []);

  // Use custom audio recorder for practice
  const {
    isRecording,
    isTranscribing,
    error: recorderError,
    startListening,
    stopListening,
  } = usePracticeAudioRecorder(handlePracticeTranscription);

  // Handle recorder errors
  useEffect(() => {
    if (recorderError) {
      setFeedback(recorderError);
    }
  }, [recorderError]);

  // Practice word with translation
  const practiceWordData = {
    word: practiceWord.word,
    level: practiceWord.level,
    translation: practiceWord.translations[language] || practiceWord.word,
  };

  const handleSubmitPractice = useCallback(async () => {
    if (!currentDefinition.trim() || isEvaluating) return;

    setIsEvaluating(true);
    setFeedback("");
    stopListening();

    try {
      const response = await axios.post(
        "/api/vocabscale-test/evaluatePractice",
        {
          definition: currentDefinition,
          language: language,
        }
      );

      const {
        score,
        feedback: responseFeedback,
        isCorrect: correct,
      } = response.data;

      setFeedback(responseFeedback);
      setIsCorrect(correct);
      setAttempts((prev) => prev + 1);

      if (correct) {
        // Wait a bit to show success feedback, then complete practice
        setTimeout(() => {
          setPracticeComplete(true);
          setTimeout(() => {
            onPracticeComplete();
          }, 2000);
        }, 2000);
      } else {
        // Show hint after 2 failed attempts
        if (attempts >= 1) {
          setShowHint(true);
        }
      }
    } catch (error) {
      console.error("Practice evaluation error:", error);
      setFeedback(
        t("errorEvaluatingPractice") ||
          "Error evaluating practice. Please try again."
      );
    } finally {
      setIsEvaluating(false);
    }
  }, [
    currentDefinition,
    isEvaluating,
    language,
    attempts,
    onPracticeComplete,
    stopListening,
    t,
  ]);

  const handleTryAgain = () => {
    setCurrentDefinition("");
    setFeedback("");
    setIsCorrect(false);
  };

  const getHintText = () => {
    const hints = {
      en: "Hint: A cat is a small furry animal that says 'meow' and is often kept as a pet.",
      ta: "குறிப்பு: பூனை என்பது 'மியாவ்' என்று சொல்லும் சிறிய உரோம விலங்கு, பெரும்பாலும் வீட்டு பிராணியாக வளர்க்கப்படுகிறது.",
      hi: "संकेत: बिल्ली एक छोटा रोमिल जानवर है जो 'म्याऊं' कहता है और अक्सर पालतू जानवर के रूप में रखा जाता है।",
    };
    return hints[language] || hints.en;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Practice Round Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <motion.div
          className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full text-blue-200 text-sm mb-3"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Lightbulb className="h-4 w-4" />
          {t("practiceRound") || "Practice Round"}
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2">
          {t("practiceTitle") || "Let's Practice Together!"}
        </h2>

        <p className="text-white/80 max-w-2xl mx-auto">
          {t("practiceDescription") ||
            "Before we start the real test, let's practice with one word. Try to explain what this word means. Don't worry if you don't get it right the first time - we'll help you!"}
        </p>
      </motion.div>

      {/* Practice Word Display */}
      <WordDisplay
        currentWord={practiceWordData}
        currentIndex={0}
        totalWords={1}
        language={language}
        t={t}
      />

      {/* Definition Input */}
      <div className="mb-4">
        <motion.label
          htmlFor="practice-definition"
          className="block text-xl font-medium text-white mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t("whatDoesThisWordMean") || "What does this word mean?"}
        </motion.label>

        <motion.div
          initial={{ opacity: 0.8, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <motion.textarea
            id="practice-definition"
            rows="4"
            value={currentDefinition}
            onChange={(e) => setCurrentDefinition(e.target.value)}
            placeholder={
              t("enterDefinitionHere") || "Enter your definition here..."
            }
            className={`w-full text-2xl px-4 py-3 text-white bg-white/10 backdrop-blur-sm border-2 ${
              isRecording
                ? "border-red-400/50"
                : isCorrect
                ? "border-green-400/50"
                : feedback && !isCorrect
                ? "border-red-400/50"
                : "border-white/20"
            } rounded-xl focus:outline-none focus:border-blue-400 transition-all duration-300 placeholder-white/50`}
            disabled={
              isEvaluating || isRecording || isTranscribing || practiceComplete
            }
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <RecordingButton
              isRecording={isRecording}
              isSubmitting={isEvaluating}
              isTranscribing={isTranscribing}
              startListening={startListening}
              stopListening={stopListening}
              t={t}
            />

            <motion.button
              onClick={handleSubmitPractice}
              disabled={
                !currentDefinition.trim() || isEvaluating || practiceComplete
              }
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isEvaluating ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  {t("checking") || "Checking..."}
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {t("checkAnswer") || "Check Answer"}
                </>
              )}
            </motion.button>

            {feedback && !isCorrect && !isEvaluating && (
              <motion.button
                onClick={handleTryAgain}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {t("tryAgain") || "Try Again"}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Hint Display */}
      <AnimatePresence>
        {showHint && !isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-amber-500/20 rounded-lg border border-amber-400/30"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-200 font-medium text-sm mb-1">
                  {t("needHelp") || "Need a little help?"}
                </h4>
                <p className="text-amber-100 text-sm">{getHintText()}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Display */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-4 rounded-lg border ${
              isCorrect
                ? "bg-green-500/20 border-green-400/30"
                : "bg-red-500/20 border-red-400/30"
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-300 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p
                  className={`${
                    isCorrect ? "text-green-100" : "text-red-100"
                  } text-sm`}
                >
                  {feedback}
                </p>
                {isCorrect && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-green-200 text-sm mt-2 font-medium"
                  >
                    {t("practiceCompleteMessage") ||
                      "Great job! Now you're ready for the real test!"}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Animation */}
      <AnimatePresence>
        {practiceComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              className="bg-gradient-to-br from-green-500/90 to-emerald-600/90 backdrop-blur-xl rounded-3xl p-8 text-center text-white max-w-md mx-4"
              animate={{
                scale: [1, 1.05, 1],
                rotateY: [0, 5, -5, 0],
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">
                {t("practiceComplete") || "Practice Complete!"}
              </h3>
              <p className="text-white/90 mb-4">
                {t("readyForRealTest") || "You're ready for the real test now!"}
              </p>
              <div className="flex items-center justify-center gap-2 text-white/80">
                <span>{t("startingMainTest") || "Starting main test"}</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attempt Counter */}
      <div className="mt-auto">
        <div className="text-white/60 text-sm text-center">
          {attempts > 0 && (
            <span>
              {t("attempts") || "Attempts"}: {attempts}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeRound;
