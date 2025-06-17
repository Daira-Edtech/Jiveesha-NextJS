import { motion } from "framer-motion";
import Image from "next/image";

const microphone = "/vocab-scale/microphone.png";

const RecordingButton = ({
    isRecording,
    isSubmitting,
    isTranscribing,
    startListening,
    stopListening,
    t,
}) => {
    return (
        <div className="w-full flex flex-col items-center mt-6 gap-3">
            <motion.button
                whileHover={{
                    scale: isSubmitting || isTranscribing ? 1 : 1.08,
                    y: -3,
                }}
                whileTap={{ scale: 0.92 }}
                onClick={isRecording ? stopListening : startListening}
                disabled={isSubmitting || isTranscribing}
                className={`relative flex items-center justify-center rounded-full w-32 h-32 focus:outline-none transition-all duration-300 ${
                    isRecording
                        ? "bg-yellow-500 shadow-yellow-500/40"
                        : "bg-gradient-to-br from-[#b59a2e] to-[#eb9501] shadow-[0_8px_30px_rgba(250,204,21,0.4)]"
                } ${
                    isSubmitting || isTranscribing
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                }`}
                style={{
                    boxShadow: isRecording
                        ? "0 0 20px rgba(253, 224, 71, 0.6)"
                        : "0 6px 20px rgba(251, 191, 36, 0.6), 0 0 12px rgba(245, 158, 11, 0.8)",
                }}
            >
                {/* Pulsing aura when recording */}
                {isRecording && (
                    <motion.span
                        className="absolute inset-0 rounded-full bg-amber-300/40"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.4, 0.8, 0.4],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                )}

                {/* Inner circle with microphone */}
                <motion.div
                    className="relative z-10 rounded-full flex items-center justify-center w-24 h-24"
                    animate={{
                        scale: isRecording ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                        duration: 2,
                        repeat: isRecording ? Infinity : 0,
                        ease: "easeInOut",
                    }}
                    style={{
                        border: "1.5px solid rgba(255, 255, 255, 0.3)",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2)",
                    }}
                >
                    <Image
                        src={microphone}
                        alt="Microphone"
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain"
                    />

                    {/* Wave animation when recording */}
                    {isRecording && (
                        <div className="absolute -bottom-8 flex space-x-1">
                            {[1, 1.2, 1.5, 1.2, 1].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-yellow-400"
                                    animate={{
                                        height: [4, 12, 4],
                                        backgroundColor: [
                                            "#facc15", // gold
                                            "#fde047", // lighter gold
                                            "#facc15",
                                        ],
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Spinner animation */}
                {(isTranscribing || isSubmitting) && (
                    <motion.div
                        className="absolute inset-0 rounded-full border-[3px] border-yellow-100/30 border-t-yellow-100"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                )}
            </motion.button>

            {/* Text label */}
            <div className="text-yellow-100 text-lg mt-3 font-semibold select-none">
                {isRecording ? t("clickToStop") : t("clickToSpeak")}
            </div>
        </div>
    );
};

export default RecordingButton;
