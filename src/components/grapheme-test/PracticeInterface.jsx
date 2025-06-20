// components/grapheme-test/PracticeInterface.jsx
"use client";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Button from "./Button"; // Assuming Button.jsx is in the same components/grapheme-test folder

const PRACTICE_LETTER_TIMER_DURATION = 10;

const PracticeInterface = ({
  practiceLetter,
  language,
  onPracticeAttemptComplete,
  // backendURL, // Kept for potential future use if transcription is added to practice
}) => {
  const [timeLeft, setTimeLeft] = useState(PRACTICE_LETTER_TIMER_DURATION);
  const [userInput, setUserInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [inputStatus, setInputStatus] = useState("idle"); // idle, recording, done_voice, done_typed

  // Refs for media and input
  const mediaRecorderRef = useRef(null); // For potential actual recording
  const streamRef = useRef(null); // For potential actual recording stream
  const inputRef = useRef(null); // For focusing the text input
  const isRecordingRef = useRef(isRecording); // To access current isRecording state in callbacks

  // Reset interface for a new practice letter
  useEffect(() => {
    setTimeLeft(PRACTICE_LETTER_TIMER_DURATION);
    setUserInput("");
    setInputStatus("idle");
    setIsRecording(false); // Ensure recording is reset
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [practiceLetter]);

  // Sync isRecordingRef with isRecording state
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Timer countdown logic
  useEffect(() => {
    if (!practiceLetter || timeLeft <= 0) {
      if (timeLeft <= 0 && inputStatus !== "completed_by_action" && inputStatus !== "skipped_practice") {
        // If timer runs out and user hasn't finished or skipped
        onPracticeAttemptComplete(userInput, "timeout");
      }
      return; // Stop timer if no letter or time is up
    }
    const timerId = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timerId); // Cleanup timer
  }, [timeLeft, practiceLetter, inputStatus, onPracticeAttemptComplete, userInput]);

  // Simplified stop listening logic for practice (no backend transcription)
  const simplifiedStopListening = useCallback(() => {
    if (isRecordingRef.current) {
      setIsRecording(false); // Update state to reflect recording has stopped

      // Basic cleanup if media stream/recorder were used (for future extension)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
      // If recording was stopped by user, mark input as done by voice for practice
      if (inputStatus === "recording") {
        setInputStatus("done_voice");
      }
    }
  }, [inputStatus]); // Add inputStatus to dependencies if its change should affect this callback

  // Handle text input change
  const handleInputChange = (e) => {
    if (isRecording || inputStatus === 'done_voice') return; // Prevent typing if recording or voice input done
    setUserInput(e.target.value);
    setInputStatus(e.target.value ? "done_typed" : "idle");
  };

  // Handle record button click
  const handleRecordButtonClick = () => {
    if (isRecording) {
      simplifiedStopListening();
      toast.info("Practice recording stopped.");
    } else {
      // Prevent starting new recording if input already provided
      if (inputStatus === 'done_typed' || inputStatus === 'done_voice') {
        toast.info("Input already provided for practice.");
        return;
      }
      setIsRecording(true);
      setInputStatus("recording");
      toast.info("Practice recording started... Speak now!");
      // Note: Actual microphone access and recording logic (like in useGraphemeTestLogic)
      // would be added here if full voice input is desired for practice.
      // For this simplified version, we're just toggling state.
    }
  };
  
  // Render status message based on input state
  const RenderPracticeInputStatus = () => {
    switch (inputStatus) {
      case "recording": return <div className="flex items-center justify-center gap-2 text-red-400 h-6"><Mic className="h-4 w-4 animate-pulse" /> Recording...</div>;
      case "done_voice": return <div className="flex items-center justify-center gap-2 text-green-400 h-6">Voice Input (Practice)</div>;
      case "done_typed": return <div className="flex items-center justify-center gap-2 text-teal-400 h-6">Typed (Practice)</div>;
      default: return <div className="text-gray-400 text-sm h-6 text-center">Type or Record the letter for practice.</div>;
    }
  };

  // Handle finishing the practice attempt
  const handleFinishPractice = () => {
      simplifiedStopListening(); // Ensure recording stops if active
      onPracticeAttemptComplete(userInput, inputStatus.startsWith("done") ? inputStatus : "skipped_practice");
  };

  return (
    <motion.div
      key={`practice-${practiceLetter}`} // Key ensures re-animation on letter change
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center min-h-[420px] sm:min-h-[400px] justify-between w-full"
    >
      {/* Top Section: Title */}
      <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-orange-400">Practice Letter</h2>
          <p className="text-purple-300 text-xs sm:text-sm">Give it a try!</p>
      </div>

      {/* Middle Section: Letter Display & Timer */}
      <div className="relative mb-4">
        {/* Letter Display Box - Themed like TestInterface */}
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-br from-orange-200/80 via-purple-200/80 to-blue-200/80 backdrop-blur-sm rounded-3xl flex items-center justify-center border-4 border-orange-400/40 shadow-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-300/10 via-transparent to-purple-300/10 rounded-3xl" />
          <span className="text-6xl sm:text-7xl font-bold text-gray-700" style={{ fontFamily: language === 'ta' ? 'Latha, Noto Sans Tamil, sans-serif' : language === 'hi' ? 'Poppins, Noto Sans Devanagari, sans-serif' : 'Arial, sans-serif' }}>
            {practiceLetter}
          </span>
        </motion.div>
        {/* Timer Visual - Themed like TestInterface */}
        <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                <svg className="w-full h-full" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}> {/* Rotate to start from top */}
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#FB923C30" strokeWidth="3.5" /> {/* Orange base */}
                    <motion.circle
                        cx="18" cy="18" r="15.9155"
                        fill="none" 
                        stroke="#FB923C" /* Orange progress */
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                        strokeDasharray="100 100" // Corresponds to circle circumference
                        initial={{ strokeDashoffset: 100 }} // Start full
                        animate={{ strokeDashoffset: 100 - ((timeLeft / PRACTICE_LETTER_TIMER_DURATION) * 100) }} // Animate offset
                        transition={{ duration: 1, ease: "linear" }} 
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span 
                        animate={{ scale: timeLeft <= 3 ? [1,1.1,1] : 1, color: timeLeft <= 3 ? "#EF4444" : "#F97316" }} /* Orange/Red for timer text */
                        transition={{ duration:0.5, repeat: timeLeft <= 3 ? Infinity:0 }} 
                        className="text-md sm:text-lg font-bold"
                    >
                        {timeLeft}
                    </motion.span>
                </div>
            </div>
        </div>
      </div>
      
      {/* Bottom Section: Input Status, Text Input, Record Button, Finish Button */}
      <div className="w-full flex flex-col items-center">
        <div className="h-8 mb-2 flex items-center justify-center">
            <RenderPracticeInputStatus />
        </div>
        <div className="w-full max-w-xs sm:max-w-sm my-3 flex flex-col items-center gap-2.5">
            <motion.input 
                whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(251, 146, 60, 0.3)"}} // Orange focus
                ref={inputRef} type="text" value={userInput} onChange={handleInputChange} 
                disabled={isRecording || inputStatus === 'done_voice'}
                className="w-full px-5 py-2.5 text-center text-md bg-white/70 backdrop-blur-sm border-2 border-orange-400/30 rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-600/40 disabled:cursor-not-allowed placeholder-gray-500/70 text-gray-800 font-medium" 
                placeholder="Type (Practice)"
                maxLength={10} // Optional: limit input length
            />
            {/* Record Button - Themed like TestInterface */}
            <Button 
                onClick={handleRecordButtonClick} 
                disabled={inputStatus === 'done_typed' || inputStatus === 'done_voice'}
                className={`w-full !py-2.5 !text-sm ${isRecording ? '!bg-red-500 hover:!bg-red-600 active:!bg-red-700' : '!bg-blue-500 hover:!bg-blue-600 active:!bg-blue-700'} disabled:!opacity-60`}
            >
                <div className="flex items-center justify-center gap-1.5"> 
                    {isRecording ? <MicOff size={18}/> : <Mic size={18}/>} 
                    {isRecording ? "Stop" : "Record (Practice)"} 
                </div>
            </Button>
        </div>
        {/* Finish Button - Themed like TestInterface */}
        <Button 
            onClick={handleFinishPractice} 
            className="!bg-gradient-to-r !from-teal-500 !to-cyan-600 hover:!from-teal-600 hover:!to-cyan-700 !text-white !font-semibold !py-2.5 !px-6 !text-sm mt-2"
        >
          Done with Practice
        </Button>
      </div>
    </motion.div>
  );
};

PracticeInterface.propTypes = {
  practiceLetter: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  onPracticeAttemptComplete: PropTypes.func.isRequired,
};

export default PracticeInterface;