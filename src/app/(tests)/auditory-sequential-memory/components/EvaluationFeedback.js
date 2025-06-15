import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

export default function EvaluationFeedback({ evaluationResult, t }) {
  return (
    <AnimatePresence>
      {evaluationResult && (
        <motion.div
          key="evaluationFeedback"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex flex-col items-center space-y-4 mt-6"
        >
          {evaluationResult === "correct" ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <CheckCircle size={48} className="text-green-600" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 text-green-600 px-8 py-4 rounded-xl border border-green-200"
              >
                <span className="text-2xl font-bold">{t("correct")}!</span>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <XCircle size={48} className="text-blue-600" />
              </motion.div>
              <div className="bg-blue-50 text-blue-600 px-8 py-4 rounded-xl border border-blue-200">
                <span className="text-2xl font-bold">
                  {t("lets_try_next_one")}
                </span>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}