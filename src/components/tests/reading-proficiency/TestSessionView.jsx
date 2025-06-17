"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightCircle,
  Mic,
  MicOff,
  UploadCloud,
  ChevronRight,
} from "lucide-react";

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-teal-100/60 rounded-full h-6 overflow-hidden border-2 border-teal-200/70 shadow-inner relative">
    <motion.div
      className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center justify-end text-md font-bold text-white pr-2 relative"
      initial={{ width: "0%" }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
    >
      {progress > 5 && (
        <motion.span
          className="absolute left-0 top-0 bottom-0 bg-white/20"
          style={{ width: "100%" }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
          }}
        />
      )}
      {progress > 10 && <span className="relative z-10">{`${progress}%`}</span>}
    </motion.div>
  </div>
);

const RecordingControls = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  showEels,
  coralineImageForEels, // Pass the image source
  t,
}) => (
  <div className="flex items-center gap-4 relative">
    <AnimatePresence>
      {showEels && (
        <motion.div
          initial={{ opacity: 0, x: -50, rotate: -30 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          exit={{ opacity: 0, x: -50, rotate: 30 }}
          className="absolute -top-16 -left-12 z-10"
        >
          <img
            src={coralineImageForEels}
            className="w-24 h-24 object-contain transform scale-x-[-1] "
            alt={t("altWarningSignImage")}
          />
        </motion.div>
      )}
    </AnimatePresence>
    <div className="relative">
      <motion.button
        onClick={onStartRecording}
        disabled={isRecording}
        className={`rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 ease-in-out
          ${
            isRecording
              ? "opacity-60 cursor-not-allowed bg-gray-200 border-2 border-gray-300"
              : "bg-white border-2 border-teal-500 shadow-lg hover:bg-teal-50"
          }`}
        aria-label={t("startRecording")}
        whileHover={
          !isRecording
            ? {
                scale: 1.1,
                boxShadow: "0 0 20px rgba(20, 184, 166, 0.6)",
              }
            : {}
        }
        whileTap={!isRecording ? { scale: 0.9 } : {}}
      >
        <Mic
          className={`h-7 w-7 ${
            isRecording ? "text-gray-500" : "text-teal-600"
          }`}
        />
      </motion.button>
      {isRecording && (
        <motion.span
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </div>
    <motion.button
      onClick={onStopRecording}
      disabled={!isRecording}
      className={`rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 ease-in-out
        ${
          !isRecording
            ? "opacity-60 cursor-not-allowed bg-gray-200 border-2 border-gray-300"
            : "bg-red-500 border-2 border-red-600 shadow-lg hover:bg-red-400"
        }`}
      aria-label={t("stopRecording")}
      whileHover={
        isRecording
          ? {
              scale: 1.1,
              boxShadow: "0 0 20px rgba(239, 68, 68, 0.6)",
            }
          : {}
      }
      whileTap={isRecording ? { scale: 0.9 } : {}}
    >
      <MicOff
        className={`h-7 w-7 ${!isRecording ? "text-gray-500" : "text-white"}`}
      />
    </motion.button>
    {isRecording && (
      <motion.div
        className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-full border border-red-200 shadow-md"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: [0.8, 1, 0.8], y: 0 }}
        transition={{
          opacity: { duration: 1.5, repeat: Infinity },
          y: { duration: 0.2 },
        }}
      >
        <Mic className="h-5 w-5" />
        <span className="text-sm font-semibold">{t("recording")}</span>
        <span className="inline-flex gap-0.5">
          {"...".split("").map((char, i) => (
            <motion.span
              key={i}
              animate={{ y: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      </motion.div>
    )}
  </div>
);

const FileUploadButton = ({ onFileUpload, t }) => (
  <div className="relative w-full sm:w-auto">
    <input
      type="file"
      accept="audio/*,.m4a,.mp3,.wav,.ogg"
      onChange={onFileUpload}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      aria-label={t("ariaLabelUploadAudioFile")}
      id="audioUpload"
    />
    <motion.label
      htmlFor="audioUpload"
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-lg shadow-md text-sm font-medium cursor-pointer"
      whileHover={{ y: -2, boxShadow: "0 6px 15px rgba(56, 189, 248, 0.3)" }}
      whileTap={{ y: 0, scale: 0.98 }}
    >
      <UploadCloud className="h-5 w-5" />
      <span>{t("uploadAudio") || "Upload Audio"}</span>
    </motion.label>
  </div>
);

const SubmitButton = ({ isTranscribing, transcriptionReady, onSubmit, t }) => {
  const isDisabled = isTranscribing || !transcriptionReady;
  return (
    <motion.button
      onClick={onSubmit}
      disabled={isDisabled}
      className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium shadow-md transition-colors duration-200 ease-in-out
        ${
          isDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
        }`}
      whileHover={
        !isDisabled
          ? {
              y: -2,
              boxShadow: "0 6px 15px rgba(16, 185, 129, 0.3)",
              filter: "brightness(1.1)",
            }
          : {}
      }
      whileTap={!isDisabled ? { y: 0, scale: 0.98 } : {}}
    >
      {isTranscribing ? (
        <>
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gray-500 rounded-full"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <span className="ml-2">{t("transcribing") || "Processing..."}</span>
        </>
      ) : (
        <>
          <span>{t("submit") || "Submit Answer"}</span>
          <ArrowRightCircle className="h-5 w-5" />
        </>
      )}
    </motion.button>
  );
};


export default function TestSessionView({
  gameProgress,
  currentPage,
  currentWordsLength,
  wordsPerBatch,
  ancientPaperImage,
  visibleWords,
  isRecording,
  startRecording,
  stopRecording,
  showEels,
  coralineImageForEels,
  handleFileUpload,
  handleSubmitPageOrTest,
  isTranscribing,
  transcriptionReady,
  t,
}) {
  const isLastPage = (currentPage + 1) * wordsPerBatch >= currentWordsLength;

  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 w-full px-4 sm:px-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <span className="text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
              {t("labelReefProgress")}
            </span>
            <span className="text-white text-sm">
              Page {currentPage + 1} of{" "}
              {Math.ceil(currentWordsLength / wordsPerBatch)}
            </span>
          </div>
          <span className="text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
            {gameProgress}%
          </span>
        </div>
        <ProgressBar progress={gameProgress} />
      </div>

      <div className="relative mb-8 w-full max-w-3xl mx-auto">
        <div className="relative h-[600px] max-h-[600px]">
          <img
            src={ancientPaperImage}
            className="w-full h-full object-cover rounded-lg"
            alt="Ancient paper background"
          />
          <div className="absolute inset-4 grid grid-cols-3 grid-rows-4 gap-1 p-24 pr-48">
            {visibleWords.map((wordObj, index) => (
              <div
                key={wordObj.id || index} // Prefer a stable id if available
                className={`flex items-center justify-center rounded-md shadow-sm p-4 transition-all duration-500 ${wordObj.glowing ? 'bg-yellow-200 scale-110' : 'bg-transparent'}`}
              >
                <span className="text-md md:text-base lg:text-xl font-bold text-black text-center leading-tight">
                  {wordObj.word}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl border border-white/30 w-full">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-auto">
            <RecordingControls
              isRecording={isRecording}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              showEels={showEels}
              coralineImageForEels={coralineImageForEels}
              t={t}
            />
          </div>
          {isLastPage ? (
             <SubmitButton
                isTranscribing={isTranscribing}
                transcriptionReady={transcriptionReady}
                onSubmit={handleSubmitPageOrTest}
                t={t}
             />
          ) : (
            <motion.button
              onClick={handleSubmitPageOrTest}
              disabled={isTranscribing || !transcriptionReady}
              className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-full shadow-lg mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("nextWords") || "Next Words"} <ChevronRight className="h-5 w-5" />
            </motion.button>
          )}
          <div className="flex flex-col md:flex-row gap-6 w-full sm:w-auto">
            <FileUploadButton onFileUpload={handleFileUpload} t={t} />
          </div>
        </div>
      </div>
    </div>
  );
}