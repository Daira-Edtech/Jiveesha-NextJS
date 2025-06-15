import { motion, AnimatePresence } from "framer-motion";

export default function DigitDisplay({ digit, digitIndex, isVisible }) {
  return (
    <div className="relative h-80 w-80 flex items-center justify-center">
      <AnimatePresence>
        {isVisible && digit !== null && (
          <motion.div
            key={digitIndex}
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: { type: "spring", stiffness: 200, damping: 15 },
            }}
            exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-9xl font-bold text-blue-600 p-10 bg-white rounded-2xl shadow-lg border border-gray-100">
              {digit}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}