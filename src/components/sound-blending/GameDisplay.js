"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Mic, MicOff, SkipForward, Volume2, X } from "lucide-react";
import Button from "./Button"; // Re-import Button for use here

/**
 * GameDisplay component manages the main interactive area of the game,
 * including showing listening/response states, input field, and action buttons.
 */
export default function GameDisplay({
  isPlayingSound,
  showResponseArea,
  isRecording,
  isTranscribing,
  currentTranscriptionStatus,
  error,
  userInput,
  playCurrentWordSounds,
  handleInputChange,
  startListening,
  stopListening,
  handleSubmitResponse,
  skipWord,
  showFinalSubmitButton,
  handleFinalSubmit,
  isSubmittingAll,
  inputRef, // Passed down from page.js
}) {
  const renderTranscriptionStatus = () => {
    switch (currentTranscriptionStatus) {
      case "recording":
        return (
          <div className="flex items-center justify-center gap-2 text-red-600 h-6">
            <Mic className="h-4 w-4 animate-pulse" /> Recording...
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center justify-center gap-2 text-blue-600 h-6">
            <Loader2 className="h-4 w-4 animate-spin" /> Transcribing...
          </div>
        );
      case "done":
        return (
          <div className="flex items-center justify-center gap-2 text-green-600 h-6">
            <Check className="h-4 w-4" /> Done. Ready to submit.
          </div>
        );
      case "error":
        return (
          <div className="flex items-center justify-center gap-2 text-red-600 h-6">
            <X className="h-4 w-4" /> Transcription failed.
          </div>
        );
      case "typed":
        return (
          <div className="flex items-center justify-center gap-2 text-gray-600 h-6 text-sm">
            Typed input
          </div>
        );
      case "idle":
      default:
        return (
          <div className="h-6 text-gray-500 text-sm text-center">
            Ready to record or type
          </div>
        );
    }
  };

  return (
    <>
      {/* Header Text */}
      <div className="text-center space-y-1">
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600"
        >
          Blend the Sounds!
        </motion.h2>
        <p className="text-blue-600 font-medium">
          {showResponseArea
            ? "Enter or say the word you heard"
            : "Listen carefully"}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm"
        >
          <div className="flex items-center">
            <div className="mr-2">⚠️</div>
            <p>{error}</p>
          </div>
        </motion.div>
      )}

      {/* Central Icon */}
      <motion.div
        animate={{ scale: isPlayingSound || isRecording ? [1, 1.1, 1] : 1 }}
        transition={{
          duration: 1,
          repeat: isPlayingSound || isRecording ? Infinity : 0,
          ease: "easeInOut",
        }}
        className="flex justify-center text-8xl my-6"
      >
        {/* Determine icon based on state */}
        {isPlayingSound
          ? "👂"
          : showResponseArea
          ? isRecording
            ? "🎙️"
            : isTranscribing
            ? "💬"
            : currentTranscriptionStatus === "done"
            ? "✅"
            : "✏️"
          : "🔊"}
      </motion.div>

      {/* Initial State: Play Sounds Button */}
      {!showResponseArea && !showFinalSubmitButton && (
        <div className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-100"
          >
            <p className="text-center text-blue-700">
              Listen to the sounds and combine them to form a word
            </p>
          </motion.div>
          <Button
            onClick={playCurrentWordSounds}
            disabled={isPlayingSound}
            variant={isPlayingSound ? "secondary" : "primary"}
            className="w-full"
          >
            <Volume2 className="h-5 w-5" />
            {isPlayingSound ? "Playing Sounds..." : "Play Sounds"}
          </Button>
        </div>
      )}

      {/* Response State: Input Field, Record Button, Submit/Skip */}
      {showResponseArea && !showFinalSubmitButton && (
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100"
          >
            <p className="text-center font-medium text-blue-700">
              What word did you hear?
            </p>
          </motion.div>

          {/* Transcription Status */}
          {renderTranscriptionStatus()}

          {/* Input Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full"
          >
            <input
              ref={inputRef} // Apply the ref here
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type or Record your answer"
              className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-medium text-blue-800 placeholder-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              onKeyPress={(e) => {
                if (
                  e.key === "Enter" &&
                  userInput.trim() &&
                  !isRecording &&
                  !isTranscribing
                ) {
                  handleSubmitResponse();
                }
              }}
              disabled={
                isRecording ||
                isTranscribing ||
                isPlayingSound ||
                isSubmittingAll
              }
            />
          </motion.div>

          {/* Action Buttons Container */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-2 w-full"
          >
            {/* Top Row: Record / Submit */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Record/Stop Button */}
              <Button
                onClick={isRecording ? stopListening : startListening}
                variant={isRecording ? "danger" : "secondary"}
                className="flex-1 order-1"
                disabled={isPlayingSound || isTranscribing || isSubmittingAll}
              >
                {isRecording ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
                {isRecording ? "Stop Recording" : "Record Answer"}
              </Button>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitResponse}
                variant="success"
                className="flex-1 order-2"
                disabled={
                  !userInput.trim() ||
                  isRecording ||
                  isTranscribing ||
                  isPlayingSound ||
                  isSubmittingAll
                }
              >
                <Check className="h-5 w-5" />
                Submit Answer
              </Button>
            </div>
            {/* Bottom Row: Skip Button */}
            <Button
              onClick={skipWord}
              variant="warning"
              className="w-full order-3"
              disabled={
                isPlayingSound ||
                isRecording ||
                isTranscribing ||
                isSubmittingAll
              }
            >
              <SkipForward className="h-5 w-5" /> Skip Word
            </Button>
          </motion.div>
        </div>
      )}

      {/* Final Submit Button State */}
      {showFinalSubmitButton && (
        <div className="text-center space-y-4 pt-4">
          <p className="text-lg font-semibold text-blue-800">
            All words attempted!
          </p>
          <Button
            onClick={handleFinalSubmit}
            variant="primary"
            className="w-full max-w-xs mx-auto"
            isLoading={isSubmittingAll}
          >
            Submit All Results
          </Button>
        </div>
      )}
    </>
  );
}
