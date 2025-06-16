"use client"; // This component uses framer-motion and relies on browser APIs (microphone).

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Mic, MicOff, XCircle } from "lucide-react"; // Importing icons

/**
 * ListeningEvaluatingScreen component handles user's audio input, transcription display,
 * and provides visual feedback on the evaluation result.
 */
export default function ListeningEvaluatingScreen({
  mode,
  isRecording,
  isTranscribing,
  transcript,
  evaluationResult,
  stopListening,
  t,
  MAX_ERRORS, // Passed from parent for error display
  forwardErrors, // Passed from parent for error display
  reverseErrors, // Passed from parent for error display
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center space-y-6 sm:space-y-8 p-6 sm:p-10 bg-white rounded-2xl shadow-lg max-w-sm sm:max-w-md md:max-w-3xl mx-auto border border-gray-100 min-h-[calc(100vh-10rem)] justify-center"
    >
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
        {mode === "forward"
          ? t("repeat_numbers_order")
          : t("say_numbers_reverse")}
      </h3>

      <div className="flex items-center gap-4 sm:gap-6">
        <motion.button
          onClick={stopListening}
          disabled={!isRecording}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative rounded-xl h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center transition-all duration-300 shadow-md ${
            !isRecording
              ? "bg-gray-100 cursor-not-allowed text-gray-400"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isRecording ? <MicOff size={30} className="sm:size-32" /> : <Mic size={30} className="sm:size-32" />}
          {isRecording && (
            <motion.span
              className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          )}
        </motion.button>

        {isRecording && !isTranscribing && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-blue-50 text-blue-600 rounded-xl"
          >
            <span className="text-base sm:text-lg font-medium">{t("recording")}</span>
            <span className="flex gap-0.5">
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
              >
                •
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
              >
                •
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 1 }}
              >
                •
              </motion.span>
            </span>
          </motion.div>
        )}
      </div>

      {isTranscribing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center space-y-3 sm:space-y-4"
        >
          <motion.div
            className="w-12 h-12 sm:w-16 sm:h-16 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent"></div>
          </motion.div>
          <div className="text-lg sm:text-xl text-blue-600 font-medium">
            {t("processing_your_answer")}
          </div>
        </motion.div>
      )}

      {transcript && !isTranscribing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base sm:text-xl"
        >
          <p className="text-lg text-gray-600">
            {t("you_said")}:{" "}
            <strong className="text-gray-800">{transcript}</strong>
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {evaluationResult && (
          <motion.div
            key="evaluationFeedback"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center space-y-3 sm:space-y-4 mt-4 sm:mt-6"
          >
            {evaluationResult === "correct" ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle size={40} className="sm:size-48 text-green-600" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 text-green-600 px-6 py-3 sm:px-8 sm:py-4 rounded-xl border border-green-200"
                >
                  <span className="text-xl sm:text-2xl font-bold">{t("correct")}!</span>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <XCircle size={40} className="sm:size-48 text-blue-600" />
                </motion.div>
                <div className="bg-blue-50 text-blue-600 px-6 py-3 sm:px-8 sm:py-4 rounded-xl border border-blue-200">
                  <span className="text-xl sm:text-2xl font-bold">
                    {t("lets_try_next_one")}
                  </span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
