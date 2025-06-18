// DemoRoundView.jsx
"use client";

import { motion } from "framer-motion";
<<<<<<< HEAD
import {
  Mic,
  MicOff,
  UploadCloud,
  Check,
  X as IconX,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

// Re-using controls from previous step, ensure styling is consistent with TestSessionView if needed
const DemoRecordingControls = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  t,
}) => (
=======
import { Mic, MicOff, UploadCloud, Check, X as IconX, AlertTriangle, ChevronRight, RefreshCw } from "lucide-react";

// Re-using controls from previous step, ensure styling is consistent with TestSessionView if needed
const DemoRecordingControls = ({ isRecording, onStartRecording, onStopRecording, t }) => (
>>>>>>> 3dcec4d (Added Demo Round)
  <div className="flex items-center gap-4">
    <motion.button
      onClick={onStartRecording}
      disabled={isRecording}
      className={`rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 ease-in-out
        ${
          isRecording
            ? "opacity-60 cursor-not-allowed bg-gray-500/30 border-2 border-gray-400/50"
            : "bg-white/20 border-2 border-teal-300 shadow-lg hover:bg-teal-500/30 hover:border-teal-200"
        }`}
      aria-label={t("startRecording")}
<<<<<<< HEAD
      whileHover={
        !isRecording
          ? { scale: 1.1, boxShadow: "0 0 15px rgba(20, 184, 166, 0.4)" }
          : {}
      }
      whileTap={!isRecording ? { scale: 0.9 } : {}}
    >
      <Mic
        className={`h-7 w-7 ${isRecording ? "text-gray-300" : "text-teal-200"}`}
      />
=======
      whileHover={!isRecording ? { scale: 1.1, boxShadow: "0 0 15px rgba(20, 184, 166, 0.4)" } : {}}
      whileTap={!isRecording ? { scale: 0.9 } : {}}
    >
      <Mic className={`h-7 w-7 ${isRecording ? "text-gray-300" : "text-teal-200"}`} />
>>>>>>> 3dcec4d (Added Demo Round)
    </motion.button>
    <motion.button
      onClick={onStopRecording}
      disabled={!isRecording}
      className={`rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 ease-in-out
        ${
          !isRecording
            ? "opacity-60 cursor-not-allowed bg-gray-500/30 border-2 border-gray-400/50"
            : "bg-red-500/80 border-2 border-red-600/80 shadow-lg hover:bg-red-500/100"
        }`}
      aria-label={t("stopRecording")}
<<<<<<< HEAD
      whileHover={
        isRecording
          ? { scale: 1.1, boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)" }
          : {}
      }
      whileTap={isRecording ? { scale: 0.9 } : {}}
    >
      <MicOff
        className={`h-7 w-7 ${!isRecording ? "text-gray-300" : "text-white"}`}
      />
    </motion.button>
    {isRecording && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
=======
      whileHover={isRecording ? { scale: 1.1, boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)" } : {}}
      whileTap={isRecording ? { scale: 0.9 } : {}}
    >
      <MicOff className={`h-7 w-7 ${!isRecording ? "text-gray-300" : "text-white"}`} />
    </motion.button>
    {isRecording && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
>>>>>>> 3dcec4d (Added Demo Round)
        className="text-red-300 font-semibold flex items-center"
      >
        <Mic className="h-5 w-5 mr-1" /> {t("recordingInProgress")}
      </motion.div>
    )}
  </div>
);

const DemoFileUploadButton = ({ onFileUpload, t, disabled }) => (
<<<<<<< HEAD
  <div className="relative">
    <input
      type="file"
      accept="audio/*,.m4a,.mp3,.wav,.ogg"
      onChange={onFileUpload}
      disabled={disabled}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
      id="demoAudioUpload"
    />
    <motion.label
      htmlFor="demoAudioUpload"
      className={`flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-sky-500/80 to-blue-600/80 text-white rounded-lg shadow-md text-sm font-medium cursor-pointer
                        ${
                          disabled
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:from-sky-500 hover:to-blue-600"
                        }`}
      whileHover={
        !disabled
          ? { y: -2, boxShadow: "0 6px 15px rgba(56, 189, 248, 0.2)" }
          : {}
      }
      whileTap={!disabled ? { y: 0, scale: 0.98 } : {}}
    >
      <UploadCloud className="h-5 w-5" />
      <span>{t("uploadAudioPrompt")}</span>
    </motion.label>
  </div>
=======
    <div className="relative">
        <input
            type="file"
            accept="audio/*,.m4a,.mp3,.wav,.ogg"
            onChange={onFileUpload}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
            id="demoAudioUpload"
        />
        <motion.label
            htmlFor="demoAudioUpload"
            className={`flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-sky-500/80 to-blue-600/80 text-white rounded-lg shadow-md text-sm font-medium cursor-pointer
                        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:from-sky-500 hover:to-blue-600"}`}
            whileHover={!disabled ? { y: -2, boxShadow: "0 6px 15px rgba(56, 189, 248, 0.2)" } : {}}
            whileTap={!disabled ? { y: 0, scale: 0.98 } : {}}
        >
            <UploadCloud className="h-5 w-5" />
            <span>{t("uploadAudioPrompt")}</span>
        </motion.label>
    </div>
>>>>>>> 3dcec4d (Added Demo Round)
);

export default function DemoRoundView({
  demoWords, // Array of 6 words
  ancientPaperImage, // Prop for the background image
  isRecording,
  startRecording,
  stopRecording,
  handleFileUpload,
  onSubmit,
  onRetry,
  onProceedToMainTest,
  isTranscribing,
  userTranscript, // Full transcript of the user's attempt for the 6 words
  isDemoCorrect, // null, true, false
  demoFeedback,
  t,
  isTranscriptionAttempted,
}) {
<<<<<<< HEAD
  return (
=======
  // Determine grid columns based on number of words, aiming for 2 rows of 3, or 3 rows of 2.
  // For 6 words, 3 columns is good.
  const gridCols = demoWords.length <= 3 ? `grid-cols-${demoWords.length}` : 'grid-cols-3';
  const gridRows = demoWords.length <=3 ? 'grid-rows-1' : (demoWords.length <=6 ? 'grid-rows-2' : 'grid-rows-3'); // Basic row logic for up to 9 words

  return (
    // This main div will be centered by Test6Controller, takes full width available
>>>>>>> 3dcec4d (Added Demo Round)
    <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8">
      {/* Title and Instructions for Demo */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">
          {t("demoRoundTitle")}
        </h2>
<<<<<<< HEAD
        <p className="text-gray-200 text-md sm:text-lg">
          {t("demoReadTheseWords")}
        </p>
=======
        <p className="text-gray-200 text-md sm:text-lg">{t("demoReadTheseWords")}</p>
>>>>>>> 3dcec4d (Added Demo Round)
      </div>

      {/* Word Display Area - similar to TestSessionView */}
      <div className="relative mb-8 w-full max-w-3xl mx-auto">
        <motion.div
<<<<<<< HEAD
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-[600px] max-h-[600px] rounded-xl shadow-2xl border-2 border-amber-300/30"
        >
          {/* Background Image */}
          <img
            src={ancientPaperImage}
            className="w-full h-full object-cover rounded-xl"
            alt={t("altAncientPaperBackground") || "Ancient paper background"}
          />

          {/* Word Grid */}
          <div className="absolute inset-4 grid grid-cols-3 grid-rows-2 gap-1 p-24 pr-48">
            {demoWords.map((word, index) => (
              <div
                key={index}
                className="flex items-center justify-center rounded-md shadow-sm p-4 transition-all duration-500 bg-transparent"
              >
                <span className="text-xl md:text-base lg:text-2xl font-bold text-black text-center leading-tight">
=======
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px] sm:h-[500px] md:h-[600px] max-h-[600px]" // Adjusted height
        >
          <img
            src={ancientPaperImage}
            className="w-full h-full object-cover rounded-xl shadow-2xl border-2 border-amber-300/30"
            alt={t("altAncientPaperBackground") || "Ancient paper background"}
          />
          {/* Grid for words */}
          <div className={`absolute inset-4 sm:inset-6 md:inset-8 grid ${gridCols} ${gridRows} gap-2 sm:gap-3 md:gap-4 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16`}>
            {demoWords.map((word, index) => (
              <div
                key={index}
                className="flex items-center justify-center bg-transparent rounded-md p-1 sm:p-2" // No extra background per word, relies on paper
              >
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center leading-tight select-none">
>>>>>>> 3dcec4d (Added Demo Round)
                  {word}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Controls and Feedback Area - similar to TestSessionView's bottom panel */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        className="bg-black/20 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 w-full"
      >
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between mb-4">
          <DemoRecordingControls
            isRecording={isRecording}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            t={t}
          />
<<<<<<< HEAD
          <DemoFileUploadButton
            onFileUpload={handleFileUpload}
            t={t}
            disabled={isRecording || isTranscribing}
          />
        </div>

=======
          <DemoFileUploadButton onFileUpload={handleFileUpload} t={t} disabled={isRecording || isTranscribing}/>
        </div>
        
>>>>>>> 3dcec4d (Added Demo Round)
        {isTranscribing && (
          <p className="text-sky-300 my-3 text-center flex items-center justify-center">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-sky-300 border-t-transparent rounded-full mr-2 inline-block"
            />
            {t("transcribingInProgress")}
          </p>
        )}

        {isTranscriptionAttempted && userTranscript && !isTranscribing && (
          <div className="my-3 p-3 bg-white/5 rounded-md border border-white/10 text-center">
            <p className="text-sm text-gray-400">{t("demoYourFullAttempt")}</p>
<<<<<<< HEAD
            <p className="text-md text-gray-100 font-medium">
              "{userTranscript}"
            </p>
=======
            <p className="text-md text-gray-100 font-medium">"{userTranscript}"</p>
>>>>>>> 3dcec4d (Added Demo Round)
          </div>
        )}

        {isTranscriptionAttempted && demoFeedback && !isTranscribing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`my-3 p-3 rounded-md text-sm font-semibold flex items-center justify-center gap-2
<<<<<<< HEAD
              ${
                isDemoCorrect === true
                  ? "bg-green-600/30 text-green-200 border border-green-400/50"
                  : isDemoCorrect === false
                  ? "bg-red-600/30 text-red-200 border border-red-400/50"
                  : "bg-gray-600/30 text-gray-200 border border-gray-400/50"
              }`}
          >
            {isDemoCorrect === true ? (
              <Check size={18} />
            ) : isDemoCorrect === false ? (
              <AlertTriangle size={18} />
            ) : (
              <IconX size={18} />
            )}
            {demoFeedback}
          </motion.div>
        )}

        <div className="mt-4 space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:justify-center sm:gap-4">
          {isDemoCorrect !== true && !isTranscribing && (
            <motion.button
              onClick={onSubmit}
              disabled={isRecording || isTranscribing}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500/90 to-green-500/90 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              {t("buttonSubmitDemoAnswer")}
            </motion.button>
          )}

          {isDemoCorrect === false && !isTranscribing && (
            <motion.button
              onClick={onRetry}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={18} /> {t("buttonTryAgain")}
            </motion.button>
          )}
          {isDemoCorrect === false && !isTranscribing && (
            <motion.button
              onClick={onProceedToMainTest}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg rounded-lg shadow-xl flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {t("Skip Demo")} <ChevronRight />
            </motion.button>
          )}
          {isDemoCorrect === true && (
            <motion.button
              onClick={onProceedToMainTest}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg rounded-lg shadow-xl flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {t("buttonProceedToMainTest")} <ChevronRight />
            </motion.button>
          )}
=======
              ${isDemoCorrect === true ? "bg-green-600/30 text-green-200 border border-green-400/50" 
              : isDemoCorrect === false ? "bg-red-600/30 text-red-200 border border-red-400/50" 
              : "bg-gray-600/30 text-gray-200 border border-gray-400/50" }`}
          >
            {isDemoCorrect === true ? <Check size={18} /> : isDemoCorrect === false ? <AlertTriangle size={18} /> : <IconX size={18} /> }
            {demoFeedback}
          </motion.div>
        )}
        
        <div className="mt-4 space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:justify-center sm:gap-4">
            {isDemoCorrect !== true && !isTranscribing && (
            <motion.button
                onClick={onSubmit}
                disabled={isRecording || isTranscribing}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500/90 to-green-500/90 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.95 }}
            >
                {t("buttonSubmitDemoAnswer")}
            </motion.button>
            )}

            {isDemoCorrect === false && !isTranscribing && (
            <motion.button
                onClick={onRetry}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.95 }}
            >
                <RefreshCw size={18}/> {t("buttonTryAgain")}
            </motion.button>
            )}


            {isDemoCorrect === true && (
            <motion.button
                onClick={onProceedToMainTest}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg rounded-lg shadow-xl flex items-center justify-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05, y:-2, boxShadow: "0px 8px 20px rgba(0,0,0,0.3)"}}
                whileTap={{ scale: 0.95 }}
            >
                {t("buttonProceedToMainTest")} <ChevronRight />
            </motion.button>
            )}
>>>>>>> 3dcec4d (Added Demo Round)
        </div>
      </motion.div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 3dcec4d (Added Demo Round)
