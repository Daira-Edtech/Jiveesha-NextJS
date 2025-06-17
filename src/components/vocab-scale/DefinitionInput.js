import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import RecordingButton from "./RecordingButton";

const DefinitionInput = ({
    currentDefinition,
    setCurrentDefinition,
    wordText, // This prop is passed but not directly used in the JSX of this component.
    isRecording,
    isTranscribing,
    isSubmitting,
    startListening,
    stopListening,
    incorrectStreak,
    error,
    language, // This prop is passed but not directly used in the JSX of this component.
    t,
}) => {
    return (
        <div className="mb-4">
            <motion.label
                htmlFor="definition"
                className="block text-xl font-medium text-white mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {t("whatDoesThisWordMean")}
            </motion.label>

            <motion.div
                initial={{ opacity: 0.8, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
            >
                <motion.textarea
                    id="definition"
                    rows="4"
                    value={currentDefinition}
                    onChange={(e) => setCurrentDefinition(e.target.value)}
                    placeholder={t("enterDefinitionHere")}
                    className={`w-full text-2xl px-4 py-3 text-white bg-white/10 backdrop-blur-sm border-2 ${
                        isRecording ? "border-red-400/50" : "border-white/20"
                    } rounded-xl focus:outline-none focus:border-blue-400 transition-all duration-300 placeholder-white/50`}
                    disabled={isSubmitting || isRecording || isTranscribing}
                    whileFocus={{
                        boxShadow: "0 0 0 2px rgba(96, 165, 250, 0.5)",
                        scale: 1.01,
                    }}
                />

                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <RecordingButton
                        isRecording={isRecording}
                        isSubmitting={isSubmitting}
                        isTranscribing={isTranscribing}
                        startListening={startListening}
                        stopListening={stopListening}
                        t={t}
                    />

                    <AnimatePresence>
                        {isTranscribing && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex items-center gap-2 text-white"
                            >
                                <motion.div
                                    className="w-4 h-4 border-2 border-blue-300/50 border-t-blue-300 rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                                {/* If needed, add transcribing text: {t("transcribing")}... */}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {incorrectStreak > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="mt-3 flex items-center gap-2 text-amber-300 text-sm"
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: incorrectStreak >= 3 ? Infinity : 0,
                                    repeatType: "mirror",
                                }}
                            >
                                <AlertCircle className="h-4 w-4" />
                            </motion.div>
                            <span>
                                {t("consecutiveIncorrectSkipped")}:{" "}
                                {incorrectStreak}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="mt-3 p-3 bg-red-500/20 rounded-lg text-red-200 text-sm flex items-start gap-2"
                        >
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default DefinitionInput;
