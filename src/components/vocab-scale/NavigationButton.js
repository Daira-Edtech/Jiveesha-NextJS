import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";

const NavigationButton = ({
    onClick,
    isLast,
    isDisabled,
    isSubmitting,
    isRecording,
    isTranscribing,
    incorrectStreak,
    t,
}) => {
    const isFinish = isLast || incorrectStreak >= 4;

    return (
        <motion.button
            whileHover={{
                scale: (isDisabled || isSubmitting || isRecording || isTranscribing) ? 1 : 1.05,
                y: (isDisabled || isSubmitting || isRecording || isTranscribing) ? 0 : -2,
                boxShadow: (isDisabled || isSubmitting || isRecording || isTranscribing)
                    ? "none"
                    : "0 4px 20px rgba(139, 92, 246, 0.3)", // Original purple shadow
            }}
            whileTap={{ scale: (isDisabled || isSubmitting || isRecording || isTranscribing) ? 1 : 0.95 }}
            onClick={onClick}
            disabled={
                isDisabled || isSubmitting || isRecording || isTranscribing
            }
            className={`relative overflow-hidden py-3 px-8 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group ${ // Added justify-center and group
                isDisabled || isSubmitting || isRecording || isTranscribing
                    ? "opacity-70 cursor-not-allowed bg-gray-500/30 text-white/70"
                    : "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-800 text-white"
            }`}
        >
            {/* Animated background - shows on hover if not disabled by any state */}
            {!(isDisabled || isSubmitting || isRecording || isTranscribing) && (
                <motion.span
                    className="absolute inset-0 z-0 bg-gradient-to-r from-blue-500 to-sky-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    // Framer Motion's whileHover would also work here, but group-hover with Tailwind is fine.
                    // If we wanted a Framer Motion transition for opacity on hover:
                    // whileHover={{ opacity: 1 }}
                    // transition={{ duration: 0.3 }}
                />
            )}

            {/* Content wrapper with higher z-index */}
            <div className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                    <>
                        <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                        <span>{t("submitting", "Submitting")}...</span>
                    </>
                ) : (
                    <>
                        <span>
                            {isFinish ? t("finishAndSubmit", "Finish & Submit") : t("nextWord", "Next Word")}
                        </span>
                        <motion.div
                            animate={
                                isFinish
                                    ? {
                                          scale: [1, 1.1, 1],
                                          rotate: [0, 5, -5, 0],
                                      }
                                    : {
                                          x: [0, 4, 0], // Subtle "next" animation
                                      }
                            }
                            transition={{
                                duration: isFinish ? 0.8 : 0.6, // Slightly different durations
                                repeat: Infinity,
                                repeatDelay: isFinish ? 1.5 : 1.2, // Slightly different delays
                                ease: "easeInOut",
                            }}
                        >
                            {isFinish ? (
                                <Check className="h-5 w-5" />
                            ) : (
                                <ChevronRight className="h-5 w-5" />
                            )}
                        </motion.div>
                    </>
                )}
            </div>
        </motion.button>
    );
};

export default NavigationButton;
