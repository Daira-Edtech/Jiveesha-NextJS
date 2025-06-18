"use client"

// components/symbol-sequence/InstructionsScreen.js

import { motion } from "framer-motion"
import { IoClose } from "react-icons/io5"

const InstructionsScreen = ({ stage, onStartPractice, onStartTest, t, onClose }) => {
  const isOverlay = stage === "infoOverlay"

  const HowToPlayContent = () => (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#f3c969] text-center mb-6 relative">
        {t("howToPlay")}
        {isOverlay && onClose && (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-[-16px] right-[-16px] sm:top-[-12px] sm:right-[-12px] p-1 text-[#f3c969] hover:text-[#d9a24b]"
            aria-label="Close instructions"
          >
            <IoClose className="text-3xl sm:text-4xl" />
          </motion.button>
        )}
      </h2>

      <div className="space-y-4 sm:space-y-6">
        {/* Step 1 - Watch the Sequence */}
        <motion.div className="bg-[#1a2a3a]/30 rounded-2xl p-4 shadow-md border border-[#d9a24b]/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 bg-[#d9a24b] text-white rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <p className="text-md text-[#f7f1e3]">{t("watchSymbolSequence")}</p>
          </div>
          <div className="flex justify-center gap-2 sm:gap-3">
            {["⚡", "🔥", "❄️"].map((symbol, i) => (
              <motion.div
                key={`instr1-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-[#3b2f1d]/50 rounded-lg sm:rounded-xl shadow-md flex items-center justify-center text-lg sm:text-xl border-2 border-[#d9a24b]/50"
              >
                {symbol}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Step 2 - Memorize the Order */}
        <motion.div className="bg-[#1a2a3a]/30 rounded-2xl p-4 shadow-md border border-[#d9a24b]/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 bg-[#d9a24b] text-white rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <p className="text-md text-[#f7f1e3]">{t("memorizeOrder")}</p>
          </div>
          <div className="flex justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-[#d9a24b] to-[#f3c969] rounded-full flex items-center justify-center text-xl sm:text-2xl text-white font-bold shadow-lg"
            >
              🧠
            </motion.div>
          </div>
        </motion.div>

        {/* Step 3 - Recreate the Sequence */}
        <motion.div className="bg-[#1a2a3a]/30 rounded-2xl p-4 shadow-md border border-[#d9a24b]/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 bg-[#d9a24b] text-white rounded-full flex items-center justify-center font-bold text-sm">
              3
            </div>
            <p className="text-md text-[#f7f1e3]">{t("recreateFromMemory")}</p>
          </div>
          <div className="flex justify-center gap-2 sm:gap-3">
            {["⚡", "🔥", "❄️", "🌟", "💎", "🌙"].map((symbol, i) => (
              <motion.div
                key={`instr3-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-[#3b2f1d]/50 rounded-lg sm:rounded-xl shadow-md flex items-center justify-center text-lg sm:text-xl border-2 border-[#d9a24b]/50"
              >
                {symbol}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Step 4 - Time Limit */}
        <motion.div className="bg-[#1a2a3a]/30 rounded-2xl p-4 shadow-md border border-[#d9a24b]/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 bg-[#d9a24b] text-white rounded-full flex items-center justify-center font-bold text-sm">
              4
            </div>
            <p className="text-md text-[#f7f1e3]">{t("limitedViewingTime")}</p>
          </div>
          <div className="flex justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-[#f3c969] to-[#d9a24b] rounded-full flex items-center justify-center text-xl sm:text-2xl text-[#3b2f1d] font-bold shadow-lg"
            >
              ⏰
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  )

  const modalBoxBaseClasses =
    "relative max-w-2xl w-11/12 bg-gradient-to-br from-[#1a2a3a]/90 to-[#3b2f1d]/90 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#d9a24b]/30 flex flex-col"
  const scrollableAreaClass = "overflow-y-auto pr-2 pb-2 flex-grow instructions-scrollable-area"
  const modalMaxHeightClass = "max-h-[90vh]"
  const modalClassName = `${modalBoxBaseClasses} ${modalMaxHeightClass}`

  let stageContent = null

  if (stage === "initialInstructions") {
    stageContent = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center p-4 z-40"
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 25 }}
          className={modalClassName}
        >
          <div className={scrollableAreaClass}>
            <HowToPlayContent />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 w-full shrink-0 px-8 py-3 sm:py-4 bg-gradient-to-r from-[#d9a24b] to-[#f3c969] text-[#3b2f1d] rounded-full text-md sm:text-lg font-semibold shadow-lg hover:shadow-xl"
            onClick={onStartPractice}
          >
            {t("startPracticeRound")}
          </motion.button>
        </motion.div>
      </motion.div>
    )
  } else if (stage === "preTestInstructions") {
    stageContent = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center p-4 z-40"
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 25 }}
          className={modalClassName}
        >
          <div className={scrollableAreaClass}>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f3c969] text-center mb-6">{t("readyForTest")}</h2>
            <div className="bg-[#1a2a3a]/30 rounded-2xl p-4 sm:p-6 shadow-md border border-[#d9a24b]/30">
              <p className="text-md sm:text-lg text-[#f7f1e3] text-center">{t("testDescription")}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 w-full shrink-0 px-8 py-3 sm:py-4 bg-gradient-to-r from-[#d9a24b] to-[#f3c969] text-[#3b2f1d] rounded-full text-md sm:text-lg font-semibold shadow-lg hover:shadow-xl"
            onClick={onStartTest}
          >
            {t("startTest")}
          </motion.button>
        </motion.div>
      </motion.div>
    )
  } else if (stage === "infoOverlay") {
    stageContent = (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ delay: 0, type: "spring", stiffness: 200, damping: 25 }}
        className={modalClassName}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={scrollableAreaClass}>
          <HowToPlayContent />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full shrink-0 px-6 py-3 bg-gradient-to-r from-[#d9a24b] to-[#f3c969] text-[#3b2f1d] rounded-full text-md font-semibold shadow-lg hover:shadow-xl"
          onClick={onClose}
        >
          {t("close")}
        </motion.button>
      </motion.div>
    )
  }

  if (!stageContent) return null

  return (
    <>
      {stageContent}
      <style jsx global>{`
        .instructions-scrollable-area::-webkit-scrollbar {
          width: 10px;
          height: 10px;
          border-left: 3px solid transparent;
          border-right: 3px solid transparent;
          background-clip: padding-box;
        }
        .instructions-scrollable-area::-webkit-scrollbar-track {
          background: rgba(217, 162, 75, 0.15);
          border-radius: 10px;
        }
        .instructions-scrollable-area::-webkit-scrollbar-thumb {
          background-color: #d9a24b;
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .instructions-scrollable-area::-webkit-scrollbar-thumb:hover {
          background-color: #f3c969;
        }
        .instructions-scrollable-area::-webkit-scrollbar-corner {
          background: transparent;
        }
        .instructions-scrollable-area {
          scrollbar-width: thin;
          scrollbar-color: #d9a24b rgba(217, 162, 75, 0.15);
        }
      `}</style>
    </>
  )
}

export default InstructionsScreen
