"use client"

// components/auditory-sequential/PresentingScreen.js

import { motion, AnimatePresence } from "framer-motion"

const PresentingScreen = ({ displayedDigit, digitIndex, t }) => {
  const isFirstDigit = digitIndex === 0

  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced digit display container */}
      <motion.div
        className="relative h-96 w-96 flex items-center justify-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Warm glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-amber-500/30 to-amber-700/20 rounded-full filter blur-3xl animate-pulse" />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-500/60 rounded-full"
            animate={{
              x: [0, Math.sin(i) * 100, 0],
              y: [0, Math.cos(i) * 100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + i * 10}%`,
              top: `${20 + i * 10}%`,
            }}
          />
        ))}

        <AnimatePresence>
          {displayedDigit !== null && (
            <motion.div
              key={digitIndex}
              initial={{ opacity: 0, scale: 0.3, rotateY: -90 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateY: 0,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  opacity: { duration: 0.3 },
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.3,
                rotateY: 90,
                transition: {
                  duration: isFirstDigit ? 0.3 : 0.4,
                  delay: isFirstDigit ? 0 : 0.1,
                },
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Enhanced digit box with warm theme */}
              <motion.div
                className="relative text-[10rem] font-bold text-white p-16 rounded-3xl backdrop-blur-xl border shadow-2xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(146, 64, 14, 0.15) 0%, rgba(180, 83, 9, 0.25) 50%, rgba(120, 53, 15, 0.15) 100%)",
                  borderColor: "rgba(180, 83, 9, 0.4)",
                  borderWidth: "2px",
                }}
                animate={{
                  boxShadow: [
                    "0 0 30px rgba(180, 83, 9, 0.3)",
                    "0 0 50px rgba(180, 83, 9, 0.5)",
                    "0 0 30px rgba(180, 83, 9, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-700/10 rounded-3xl" />

                {/* Warm corner decorations */}
                <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-amber-500/60 rounded-tl-lg" />
                <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-amber-500/60 rounded-tr-lg" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-amber-500/60 rounded-bl-lg" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-amber-500/60 rounded-br-lg" />

                <span className="relative z-10 drop-shadow-lg">{displayedDigit}</span>

                {/* Subtle animated background pattern */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 25% 25%, rgba(180, 83, 9, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(146, 64, 14, 0.3) 0%, transparent 50%)",
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced instruction message */}
      <motion.div
        className="relative text-4xl font-bold text-white px-12 py-8 rounded-2xl shadow-xl backdrop-blur-xl border-2 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(120, 53, 15, 0.15) 50%, rgba(0, 0, 0, 0.3) 100%)",
          borderColor: "rgba(180, 83, 9, 0.4)",
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        {/* Warm background shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent"
          animate={{ x: [-300, 300] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        <span className="relative z-10 drop-shadow-lg">{t("listenCarefully")}</span>

        {/* Corner accents */}
        <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-amber-500/60" />
        <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-amber-500/60" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-amber-500/60" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-amber-500/60" />
      </motion.div>
    </motion.div>
  )
}

export default PresentingScreen
