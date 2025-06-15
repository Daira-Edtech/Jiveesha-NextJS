import { motion } from "framer-motion";

export default function TestProgressBar({ 
  mode, 
  sequenceIndex, 
  totalSequences, 
  forwardErrors, 
  reverseErrors, 
  maxErrors,
  t 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-3xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <span className="text-lg font-medium text-gray-600">
            {t("mode")}:{" "}
            <span className="font-bold capitalize text-blue-600">
              {mode}
            </span>
          </span>
          <span className="text-lg font-medium text-gray-600">
            {t("sequence")}:{" "}
            <span className="font-bold text-blue-600">
              {sequenceIndex + 1}
            </span>{" "}
            / <span className="text-gray-600">{totalSequences}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium text-gray-600">
            {t("errors")}:
          </span>
          <div className="flex gap-2">
            {[...Array(maxErrors)].map((_, i) => (
              <div
                key={i}
                className={`h-4 w-4 rounded-full transition-colors duration-300 ${
                  i < (mode === "forward" ? forwardErrors : reverseErrors)
                    ? "bg-red-500"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}