"use client"

// components/symbol-sequence/InfoDialog.js

import { motion } from "framer-motion"
import { IoClose } from "react-icons/io5"

const InfoDialog = ({ show, onClose, t }) => {
  if (!show) {
    return null
  }

  return (
    <>
      <motion.div
        key="infoDialogBackdrop"
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-[#1a2a3a]/90 to-[#3b2f1d]/90 rounded-3xl p-6 sm:p-8 max-w-2xl w-11/12 mx-auto shadow-2xl relative border-4 border-[#d9a24b]/30 max-h-[90vh] overflow-y-auto info-dialog-scrollable-content"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 text-[#f3c969] hover:text-[#d9a24b] z-10"
            aria-label="Close information"
          >
            <IoClose className="text-3xl sm:text-4xl" />
          </motion.button>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#f3c969] mb-6 text-center pt-4">{t("aboutTheGame")}</h2>

          <div className="space-y-4 sm:space-y-6">
            {/* How to Play Section */}
            <div className="bg-[#1a2a3a]/30 rounded-2xl p-4 sm:p-6 shadow-lg border border-[#d9a24b]/30">
              <h3 className="text-lg sm:text-xl font-semibold text-[#f3c969] mb-3 sm:mb-4">{t("howToPlay")}</h3>
              <p className="text-sm sm:text-base text-[#f7f1e3] mb-3 sm:mb-4">{t("symbolGameDescription")}</p>
              <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-[#f7f1e3]">
                <li>{t("watchSymbolSequence")}</li>
                <li>{t("memorizeOrder")}</li>
                <li>{t("recreateFromMemory")}</li>
                <li>{t("limitedViewingTime")}</li>
              </ol>
            </div>

            {/* Game Structure Section */}
            <div className="bg-[#1a2a3a]/30 rounded-2xl p-4 sm:p-6 shadow-lg border border-[#d9a24b]/30">
              <h3 className="text-lg sm:text-xl font-semibold text-[#f3c969] mb-3 sm:mb-4">{t("gameStructure")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                <div>
                  <h4 className="font-semibold text-[#f7f1e3]">{t("practiceRound")}</h4>
                  <p className="text-[#f7f1e3]">{t("practiceRoundDescription")}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#f7f1e3]">{t("mainTest")}</h4>
                  <p className="text-[#f7f1e3]">{t("mainTestDescription")}</p>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-[#1a2a3a]/30 rounded-2xl p-4 sm:p-6 shadow-lg border border-[#d9a24b]/30">
              <h3 className="text-lg sm:text-xl font-semibold text-[#f3c969] mb-3 sm:mb-4">{t("tips")}</h3>
              <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-[#f7f1e3]">
                <li>{t("focusOnSymbolOrder")}</li>
                <li>{t("lookForPatterns")}</li>
                <li>{t("useMemoryTechniques")}</li>
                <li>{t("stayCalm")}</li>
              </ul>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-[#d9a24b] to-[#f3c969] text-[#3b2f1d] rounded-full text-md font-semibold shadow-lg hover:shadow-xl"
            onClick={onClose}
          >
            {t("close")}
          </motion.button>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        .info-dialog-scrollable-content::-webkit-scrollbar {
          width: 12px;
          height: 12px;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          background-clip: padding-box;
        }
        .info-dialog-scrollable-content::-webkit-scrollbar-track {
          background: rgba(217, 162, 75, 0.1);
          border-radius: 10px;
        }
        .info-dialog-scrollable-content::-webkit-scrollbar-thumb {
          background-color: #d9a24b;
          border-radius: 10px;
          border: 2px solid rgba(217, 162, 75, 0.1);
          background-clip: padding-box;
        }
        .info-dialog-scrollable-content::-webkit-scrollbar-thumb {
          border: 3px solid transparent;
          background-clip: content-box;
        }
        .info-dialog-scrollable-content::-webkit-scrollbar-thumb:hover {
          background-color: #f3c969;
        }
        .info-dialog-scrollable-content::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
    </>
  )
}

export default InfoDialog
