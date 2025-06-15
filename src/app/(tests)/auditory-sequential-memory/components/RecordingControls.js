import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

export default function RecordingControls({ 
  isRecording, 
  isTranscribing, 
  onStartRecording, 
  onStopRecording,
  t 
}) {
  return (
    <div className="flex items-center gap-6">
      <motion.button
        onClick={isRecording ? onStopRecording : onStartRecording}
        disabled={isTranscribing}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative rounded-xl h-16 w-16 flex items-center justify-center transition-all duration-300 shadow-md ${
          isTranscribing
            ? "bg-gray-100 cursor-not-allowed text-gray-400"
            : isRecording
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
        {isRecording && (
          <motion.span
            className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
      </motion.button>

      {isRecording && !isTranscribing && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl"
        >
          <span className="text-lg font-medium">{t("recording")}</span>
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

      {isTranscribing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <motion.div
            className="w-16 h-16 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent"></div>
          </motion.div>
          <div className="text-xl text-blue-600 font-medium">
            {t("processing_your_answer")}
          </div>
        </motion.div>
      )}
    </div>
  );
}