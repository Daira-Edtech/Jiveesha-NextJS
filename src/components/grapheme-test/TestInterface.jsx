"use client";
import { motion } from "framer-motion";
import { Loader2, Check as LucideCheck, Mic, MicOff } from "lucide-react";
import PropTypes from "prop-types";
import { FaChevronRight } from "react-icons/fa";

const TestInterface = ({
  currentIndex,
  letters,
  timeLeft,
  LETTER_TIMER_DURATION,
  userInputs,
  inputStatus,
  isRecording,
  isProcessingSubmit, // This prop comes from page.jsx's isProcessingFinalSubmit
  inputRef,
  handleInputChange,
  handleRecordButtonClick,
  handleNext,
  language,
}) => {
  const currentLetter = letters[currentIndex];

  const RenderCurrentInputStatus = () => {
    const status = inputStatus[currentIndex] || "idle";
    // For brevity, keeping status rendering simple. Can be expanded as in earlier versions.
    switch (status) {
      case "recording": return <div className="flex items-center justify-center gap-2 text-red-400 h-6"><Mic className="h-4 w-4 animate-pulse" /> Recording...</div>;
      case "pending": return <div className="flex items-center justify-center gap-2 text-blue-300 h-6"><Loader2 size={16} className="animate-spin" /> Transcribing...</div>;
      case "done_voice": return <div className="flex items-center justify-center gap-2 text-green-300 h-6"><LucideCheck size={16} /> Heard: <span className="bg-green-700/60 px-2 py-0.5 rounded font-medium text-green-100">{userInputs[currentIndex]}</span></div>;
      case "done_typed": return <div className="flex items-center justify-center gap-2 text-teal-300 h-6"><LucideCheck size={16} /> Typed: <span className="bg-teal-700/60 px-2 py-0.5 rounded font-medium text-teal-100">{userInputs[currentIndex]}</span></div>;
      case "error": return <div className="text-red-400 text-sm h-6 text-center">Input error. Try again or type.</div>;
      default: return <div className="text-gray-400 text-sm h-6 text-center">Type or Record the letter.</div>;
    }
  };

  return (
    <motion.div
      key={`letter-${currentIndex}`} // Ensures re-render on letter change
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: -20 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
      className="flex flex-col items-center min-h-[420px] sm:min-h-[400px] justify-between" // Added justify-between
    >
      {/* Top section: Letter and Timer */}
      <div className="relative mb-4"> {/* Reduced margin */}
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            animate={{ boxShadow: "0 0 30px rgba(251, 146, 60, 0.5)" }}
            transition={{ hover: { type: "spring", stiffness: 300 } }}
            className="w-56 h-56 md:w-64 md:h-64 bg-gradient-to-br from-orange-200/90 via-purple-200/90 to-blue-200/90 backdrop-blur-sm rounded-3xl flex items-center justify-center border-4 border-orange-400/50 relative overflow-hidden" // Slightly smaller
        >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-300/20 via-transparent to-purple-300/20 rounded-3xl" />
            <motion.span
              animate={{ textShadow: "0 0 20px rgba(251, 146, 60, 0.8)" }}
              className="text-7xl md:text-8xl font-bold text-gray-800 flex items-center justify-center" // Ensure good contrast
              style={{ fontFamily: language === 'ta' ? 'Latha, Noto Sans Tamil, sans-serif' : language === 'hi' ? 'Poppins, Noto Sans Devanagari, sans-serif' : 'Arial, sans-serif' }}
            >
              {currentLetter}
            </motion.span>
        </motion.div>
        {/* Timer */}
        <div className="absolute -top-5 -right-5 md:-top-7 md:-right-7"> {/* Adjusted position */}
            <div className="relative w-16 h-16 md:w-20 md:h-20"> {/* Slightly smaller timer */}
            <svg className="w-full h-full" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FB923C40" strokeWidth="3.5" />
                <motion.path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FB923C" strokeWidth="3.5" strokeLinecap="round" initial={{ strokeDasharray: "100, 100" }} animate={{ strokeDasharray: `${ (timeLeft / LETTER_TIMER_DURATION) * 100 }, 100`}} transition={{ duration: 1, ease: "linear" }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center"><motion.span animate={{ scale: timeLeft <= 5 ? [1, 1.2, 1] : 1, color: timeLeft <= 5 ? "#EF4444" : "#F59E0B" }} transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }} className="text-lg md:text-xl font-bold">{timeLeft}</motion.span></div>
            </div>
        </div>
      </div>

      {/* Middle section: Status and Inputs */}
      <div className="w-full flex flex-col items-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-8 mb-3 flex items-center justify-center"> {/* Reduced height/margin */}
            <RenderCurrentInputStatus />
        </motion.div>
        <div className="w-full max-w-xs sm:max-w-sm mb-3 flex flex-col items-center gap-2.5"> {/* Reduced gap/margin */}
            <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 15px rgba(251, 146, 60, 0.4)"}} // Reduced shadow
            ref={inputRef} type="text" value={userInputs[currentIndex] || ""} onChange={handleInputChange}
            className="w-full px-5 py-2.5 text-center text-md bg-white/80 backdrop-blur-sm border-2 border-orange-400/40 rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-700/40 disabled:border-gray-600/40 disabled:cursor-not-allowed placeholder-gray-500/80 text-gray-800 font-medium" // Adjusted padding/rounding
            placeholder="Type or Speak..." maxLength={10}
            disabled={isRecording || inputStatus[currentIndex] === "pending" || inputStatus[currentIndex] === "done_voice" || isProcessingSubmit }
            />
            {/* Custom styled Record Button */}
            <button
                onClick={handleRecordButtonClick}
                disabled={ inputStatus[currentIndex] === "done_typed" || inputStatus[currentIndex] === "pending" || inputStatus[currentIndex] === "done_voice" || isProcessingSubmit }
                className={`w-full py-2.5 text-sm font-medium rounded-lg relative overflow-hidden text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-md
                            ${ isRecording ? "bg-red-500 hover:bg-red-600 active:bg-red-700" : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700" }
                            disabled:opacity-60 disabled:cursor-not-allowed active:scale-98`}
            >
                {isRecording && ( <motion.div className="absolute inset-0 rounded-lg bg-white/10" animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0, 0.2]}} transition={{ duration: 1.5, repeat: Infinity }} /> )}
                <div className="relative z-10 flex items-center justify-center gap-2">
                    <motion.div className={`p-2 rounded-full ${isRecording ? "bg-white/20" : "bg-white/10"}`} animate={{ scale: isRecording ? [1, 1.05, 1] : 1 }} transition={{ duration: isRecording ? 1.2 : 0.3, repeat: isRecording ? Infinity : 0 }}>
                        {isRecording ? ( <MicOff size={20} /> ) : ( <Mic size={20} /> )}
                    </motion.div>
                    <span>{isRecording ? "Stop Recording" : "Record Letter"}</span>
                    {isRecording && ( <motion.div className="flex gap-0.5 ml-1" animate={{ scale: [1, 1.03, 1]}} transition={{ duration: 1.2, repeat: Infinity }}>
                        {[...Array(3)].map((_, i) => ( <motion.div key={i} className="w-1 h-1 bg-white rounded-full" animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -1, 0]}} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }} /> ))}
                    </motion.div> )}
                </div>
            </button>
        </div>
      </div>
      
      {/* Bottom section: Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={handleNext}
        disabled={!(inputStatus[currentIndex] === "done_voice" || inputStatus[currentIndex] === "done_typed") || isProcessingSubmit}
        className={`flex items-center justify-center gap-1.5 py-2.5 px-5 lg:px-6 rounded-lg font-semibold text-sm lg:text-md shadow-md transition-all duration-300
        bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700
        disabled:opacity-60 disabled:cursor-not-allowed active:scale-98`}
      >
        {currentIndex === letters.length - 1 ? "Complete Test" : "Next Letter"}
        <FaChevronRight className="ml-1" size={14}/>
      </motion.button>
    </motion.div>
  );
};
TestInterface.propTypes = { currentIndex: PropTypes.number.isRequired, letters: PropTypes.array.isRequired, timeLeft: PropTypes.number.isRequired, LETTER_TIMER_DURATION: PropTypes.number.isRequired, userInputs: PropTypes.array.isRequired, inputStatus: PropTypes.object.isRequired, isRecording: PropTypes.bool.isRequired, isProcessingSubmit: PropTypes.bool.isRequired, inputRef: PropTypes.object.isRequired, handleInputChange: PropTypes.func.isRequired, handleRecordButtonClick: PropTypes.func.isRequired, handleNext: PropTypes.func.isRequired, language: PropTypes.string.isRequired };
export default TestInterface;