"use client";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "./Button"; // Shared Button component

const PRACTICE_LETTER_TIMER_DURATION = 10; // Or passed as prop

const PracticeInterface = ({
  practiceLetter,
  language,
  onPracticeAttemptComplete, // Callback when user finishes attempt
  backendURL, // For optional transcription
  // childId, // Optional, if you want to associate practice transcriptions
}) => {
  const [timeLeft, setTimeLeft] = useState(PRACTICE_LETTER_TIMER_DURATION);
  const [userInput, setUserInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [inputStatus, setInputStatus] = useState("idle"); // idle, recording, pending, done_voice, done_typed, error

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const inputRef = useRef(null);
  const isRecordingRef = useRef(isRecording);

  useEffect(() => { // Reset for new practiceLetter (if component is reused with different letters, unlikely here)
    setTimeLeft(PRACTICE_LETTER_TIMER_DURATION);
    setUserInput("");
    setInputStatus("idle");
    setIsRecording(false);
    inputRef.current?.focus();
  }, [practiceLetter]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Timer logic
  useEffect(() => {
    if (!practiceLetter || timeLeft <= 0) {
      if (timeLeft <= 0 && inputStatus !== "completed_by_action") { // 'completed_by_action' is a hypothetical status if user explicitly finishes
        onPracticeAttemptComplete(userInput, "timeout");
      }
      return;
    }
    const timerId = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, practiceLetter, inputStatus, onPracticeAttemptComplete, userInput]);

  const stopListening = useCallback(() => { /* ... (same as in useGraphemeTestLogic or practice page) ... */ });
  // For brevity, I'll assume a simplified stopListening for practice if no transcription
  const simplifiedStopListening = () => {
    if (isRecordingRef.current) {
        setIsRecording(false);
        // Basic cleanup if streamRef or mediaRecorderRef were used
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
        }
    }
  };


  const handleInputChange = (e) => {
    if (isRecording || inputStatus === 'pending' || inputStatus === 'done_voice') return;
    setUserInput(e.target.value);
    setInputStatus(e.target.value ? "done_typed" : "idle");
  };

  const handleRecordButtonClick = () => {
    // Simplified: For practice, let's assume no backend transcription to keep it lean.
    // If you want transcription, copy the logic from useGraphemeTestLogic/PracticeRoundPage
    if (isRecording) {
      simplifiedStopListening();
      setInputStatus("done_voice"); // Simulate voice input
      // In a real scenario with transcription, this would be set after transcription
      toast.info("Recording stopped (simulated for practice).");
    } else {
      if (inputStatus === 'done_typed' || inputStatus === 'done_voice') {
          toast.info("Input already provided."); return;
      }
      setIsRecording(true);
      setInputStatus("recording");
      toast.info("Recording started (simulated for practice)... Speak now!");
    }
  };
  
  const RenderPracticeInputStatus = () => { /* ... (similar to TestInterface's status renderer) ... */ };

  const handleFinishPractice = () => {
      simplifiedStopListening(); // Ensure recording stops
      onPracticeAttemptComplete(userInput, inputStatus.startsWith("done") ? inputStatus : "skipped");
  };

  return (
    <motion.div
      key={practiceLetter}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center min-h-[420px] sm:min-h-[400px] justify-between w-full"
    >
      {/* Top: Title */}
      <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-sky-300">Practice Letter</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Give it a try!</p>
      </div>

      {/* Middle: Letter Display & Timer (similar to TestInterface but smaller) */}
      <div className="relative mb-4">
        <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-br from-sky-100/80 via-cyan-100/80 to-blue-100/80 rounded-3xl flex items-center justify-center border-4 border-sky-300/50 shadow-lg">
          <span className="text-6xl sm:text-7xl font-bold text-gray-700" style={{ fontFamily: language === 'ta' ? 'Latha, Noto Sans Tamil, sans-serif' : language === 'hi' ? 'Poppins, Noto Sans Devanagari, sans-serif' : 'Arial, sans-serif' }}>
            {practiceLetter}
          </span>
        </div>
        <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16"> {/* Timer visual */}
                <svg className="w-full h-full" viewBox="0 0 36 36"><path d="M18 2.0845a15.9155 15.9155 0 010 31.831A15.9155 15.9155 0 010-31.831" fill="none" stroke="#0EA5E930" strokeWidth="3" /><motion.path d="M18 2.0845a15.9155 15.9155 0 010 31.831A15.9155 15.9155 0 010-31.831" fill="none" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" initial={{ strokeDasharray: "100,100" }} animate={{ strokeDasharray: `${(timeLeft / PRACTICE_LETTER_TIMER_DURATION) * 100},100` }} transition={{ duration: 1, ease: "linear" }} /></svg>
                <div className="absolute inset-0 flex items-center justify-center"><motion.span animate={{ scale: timeLeft <= 3 ? [1,1.1,1] : 1, color: timeLeft <= 3 ? "#EF4444" : "#38BDF8" }} transition={{ duration:0.5, repeat: timeLeft <= 3 ? Infinity:0 }} className="text-md sm:text-lg font-bold">{timeLeft}</motion.span></div>
            </div>
        </div>
      </div>
      
      {/* Bottom: Inputs & Finish Button */}
      <div className="w-full flex flex-col items-center">
        {RenderPracticeInputStatus()} {/* Simplified status for brevity */}
        <div className="w-full max-w-xs sm:max-w-sm my-3 flex flex-col items-center gap-2.5">
            <input ref={inputRef} type="text" value={userInput} onChange={handleInputChange} disabled={isRecording || inputStatus === 'pending' || inputStatus === 'done_voice'}
            className="w-full px-5 py-2.5 text-center text-md bg-slate-200/90 border-2 border-slate-400/50 rounded-lg focus:outline-none focus:border-sky-500 disabled:bg-slate-600/50 disabled:cursor-not-allowed placeholder-slate-500 text-slate-800 font-medium" placeholder="Type your answer"/>
            <Button onClick={handleRecordButtonClick} disabled={inputStatus === 'done_typed' || inputStatus === 'pending' || inputStatus === 'done_voice'}
            className={`w-full !py-2.5 !text-sm ${isRecording ? '!bg-red-500 hover:!bg-red-600' : '!bg-sky-500 hover:!bg-sky-600'}`}>
            <div className="flex items-center justify-center gap-1.5"> {isRecording ? <MicOff size={18}/> : <Mic size={18}/>} {isRecording ? "Stop" : "Record"} </div>
            </Button>
        </div>
        <Button onClick={handleFinishPractice} 
          className="!bg-emerald-500 hover:!bg-emerald-600 !text-white !font-semibold !py-2.5 !px-6 !text-sm mt-2">
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
  backendURL: PropTypes.string, // Optional
  // childId: PropTypes.string, // Optional
};

export default PracticeInterface;