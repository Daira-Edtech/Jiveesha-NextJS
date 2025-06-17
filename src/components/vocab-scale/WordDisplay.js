import { motion } from "framer-motion";

const WordDisplay = ({
    currentWord,
    currentIndex,
    totalWords,
    language,
    t,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 p-6 border-2 border-white/30 rounded-2xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 shadow-lg backdrop-blur-sm relative overflow-hidden"
        >
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/10 rounded-full filter blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>

            <motion.p
                className="text-lg text-white/80 mb-3 flex justify-between items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <span>
                    {t("word")} {currentIndex + 1} {t("of")} {totalWords}
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs">
                    {t("level")}: {currentWord.level}
                </span>
            </motion.p>

            <motion.div
                key={currentWord.word}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    delay: 0.3,
                }}
                className="text-center mb-4"
            >
                <motion.p
                    className="text-5xl sm:text-6xl font-bold mb-3 text-white drop-shadow-lg"
                    whileHover={{ scale: 1.02 }}
                >
                    {currentWord.word}
                </motion.p>

                {language !== "en" &&
                    currentWord.word !== currentWord.translation && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="inline-block px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm"
                        >
                            {t("english")}: {currentWord.word}
                        </motion.div>
                    )}
            </motion.div>
        </motion.div>
    );
};

export default WordDisplay;
