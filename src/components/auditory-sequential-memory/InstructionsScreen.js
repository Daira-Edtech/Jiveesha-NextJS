"use client"

// components/auditory-sequential/InstructionsScreen.js

import { motion } from "framer-motion"
import { Volume2, HelpCircle } from "lucide-react"
import { FaPlay } from "react-icons/fa"

const InstructionsScreen = ({ stage, onStartForward, onStartReverse, t }) => {
  if (stage === "forward") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto p-10 sm:p-12 lg:p-16 rounded-3xl border-2 border-yellow-700/40 shadow-2xl backdrop-blur-lg bg-gradient-to-br from-amber-600/50 via-yellow-500/30 to-amber-800/50 max-w-4xl w-full"
      >
        {/* Warm glow inside cave */}
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-yellow-400/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-yellow-600/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-amber-400/70 rounded-full filter blur-3xl animate-pulse animation-delay-1000"></div>

        <div className="mb-10 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <Volume2 size={80} className="text-yellow-700 drop-shadow-lg" />
          </motion.div>
        </div>

        <motion.h2
          className="text-5xl font-bold text-white mb-8 text-center drop-shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {t("memory_test")}
        </motion.h2>

        <motion.div
          className="space-y-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-2xl text-white leading-relaxed text-center font-medium">{t("welcome_memory_game")}</p>

          <ul className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
            {[1, 2, 3].map((num) => (
              <motion.li
                key={num}
                className="flex items-center gap-6 bg-white/10 p-6 sm:p-8 rounded-2xl border-2 border-yellow-700/20 shadow-lg transition-all duration-300 hover:shadow-yellow-600/30 hover:scale-[1.02]"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + num * 0.1 }}
              >
                <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-yellow-600 text-white font-bold text-xl">
                  {num}
                </span>
                <span className="text-2xl text-white font-semibold">
                  {num === 1 && t("listen_carefully_numbers")}
                  {num === 2 && t("repeat_back_exactly")}
                  {num === 3 && t("start_easy_get_harder")}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{
              scale: 1.05,
              y: -3,
              boxShadow: "0 10px 25px -5px rgba(202, 138, 4, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartForward}
            className="group relative px-10 py-5 bg-gradient-to-r from-yellow-600 to-yellow-800 text-white text-2xl font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <span className="drop-shadow-sm">{t("start_test")}</span>
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
              <FaPlay className="drop-shadow-sm" />
            </motion.div>
            <div className="absolute -inset-2 rounded-xl bg-yellow-300/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </div>
      </motion.div>
    )
  }

  if (stage === "reverse") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6 }}
        className="text-center p-12 max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-amber-600/50 via-yellow-500/30 to-amber-800/50 backdrop-blur-lg border-2 border-amber-400/30 shadow-2xl"
      >
        <motion.div
          className="mb-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <HelpCircle size={80} className="mx-auto text-amber-500" />
        </motion.div>

        <motion.h2
          className="text-5xl font-bold text-white mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {t("level_up_reverse_challenge")}
        </motion.h2>

        <motion.div
          className="space-y-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-2xl text-white leading-relaxed font-medium">{t("now_exciting_twist")}</p>

          <motion.div
            className="p-10 rounded-2xl max-w-3xl mx-auto border-2 border-amber-400/30 backdrop-blur"
            whileHover={{ scale: 1.01 }}
          >
            <p className="text-2xl text-white font-medium">
              {t("if_i_say")} <span className="font-bold text-white px-3 py-1 rounded-lg">1 - 3 - 5</span>
              <br />
              {t("you_say")} <span className="font-bold text-white px-3 py-1 rounded-lg">5 - 3 - 1</span>
            </p>
          </motion.div>
        </motion.div>

        <motion.button
          onClick={onStartReverse}
          className="group relative px-10 py-5 bg-yellow-700/70 border-2 border-amber-500/50 text-white text-2xl font-bold rounded-xl shadow-lg transition-all duration-300 hover:bg-amber-500/60 backdrop-blur"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {t("start_reverse_challenge")}
          <div className="absolute inset-0 rounded-xl bg-green-400/30 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
        </motion.button>
      </motion.div>
    )
  }

  return null
}

export default InstructionsScreen