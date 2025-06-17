import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "@/contexts/LanguageContext";

const TestComplete = ({ finalScore, totalWords, error, childId }) => {
    const { t } = useLanguage();
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg text-center border-t-4 border-blue-500"
        >
            <ToastContainer position="top-center" autoClose={3000} />
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
            >
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <Check className="h-8 w-8 text-blue-600" />
                </div>
            </motion.div>

            <h2 className="text-2xl font-bold mb-4 text-blue-700">
                {t("testCompleted", "Test Completed!")}
            </h2>

            {finalScore !== null && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                >
                    <p className="text-xl mb-2">
                        {t("yourFinalScoreIs", "Your final score is:")}
                    </p>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                        {finalScore} / {totalWords}
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2.5 mb-4">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: `${(finalScore / totalWords) * 100}%`,
                            }}
                            transition={{ delay: 0.6, duration: 1 }}
                            className="bg-blue-600 h-2.5 rounded-full"
                        ></motion.div>
                    </div>
                </motion.div>
            )}

            <p className="mb-6 text-blue-800">
                {t(
                    "thankYouForCompletingVocabularyScaleTest",
                    "Thank you for completing the Vocabulary Scale Test.",
                )}
            </p>

            {error && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 mb-4 p-2 bg-red-50 rounded"
                >
                    {t("submissionError", "Submission Error")}: {error}
                </motion.p>
            )}

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/take-tests`)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 flex items-center gap-2 mx-auto"
            >
                {t("BackToTests", "Back to Tests")}{" "}
                <ArrowRight className="h-4 w-4" />
            </motion.button>
        </motion.div>
    );
};

export default TestComplete;
