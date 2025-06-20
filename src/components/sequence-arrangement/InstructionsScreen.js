// app/(tests)/sequence-arrangement/InstructionsScreen.js
"use client";

import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5"; // Assuming you might want a close button for overlay
import { animals as animalEmojis } from "./Constants.js";

const InstructionsScreen = ({
  stage,
  onStartPractice,
  onStartTest,
  t,
  onClose
}) => {
  const isOverlay = stage === "infoOverlay";

  const HowToPlayContent = () => (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 text-center mb-6 relative">
        {t("howToPlay")}
        {isOverlay && onClose && (
            <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-[-16px] right-[-16px] sm:top-[-12px] sm:right-[-12px] p-1 text-amber-600 hover:text-amber-800" // Adjusted position
                aria-label="Close instructions"
            >
                <IoClose className="text-3xl sm:text-4xl" />
            </motion.button>
        )}
      </h2>
      <div className="space-y-4 sm:space-y-6">
        {/* Step 1 (condensed for brevity) */}
        <motion.div className="bg-white rounded-2xl p-4 shadow-md border">
            <div className="flex items-center gap-3 mb-3"><div className="w-7 h-7 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div><p className="text-md text-amber-800">{t("showAnimalsInOrder")}</p></div>
            <div className="flex justify-center gap-2 sm:gap-3">{[animalEmojis.fish, animalEmojis.mouse, animalEmojis.fish].map((a,i)=><motion.div key={`instr1-${i}`} initial={{scale:0}} animate={{scale:1}} transition={{delay:0.1+i*0.05}} className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl shadow-md flex items-center justify-center text-lg sm:text-xl border-2 border-amber-200">{a}</motion.div>)}</div>
        </motion.div>
        {/* Step 2 (condensed) */}
        <motion.div className="bg-white rounded-2xl p-4 shadow-md border">
            <div className="flex items-center gap-3 mb-3"><div className="w-7 h-7 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div><p className="text-md text-amber-800">{t("recreateSequence")}</p></div>
            <div className="flex justify-center gap-2 sm:gap-3">{[animalEmojis.fish, animalEmojis.mouse, animalEmojis.fish, animalEmojis.rabbit].map((a,i)=><motion.div key={`instr2-${i}`} initial={{scale:0}} animate={{scale:1}} transition={{delay:0.15+i*0.05}} className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl shadow-md flex items-center justify-center text-lg sm:text-xl border-2 border-amber-200">{a}</motion.div>)}</div>
        </motion.div>
        {/* Step 3 (condensed) */}
        <motion.div className="bg-white rounded-2xl p-4 shadow-md border">
            <div className="flex items-center gap-3 mb-3"><div className="w-7 h-7 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div><p className="text-md text-amber-800">{t("fiveSecondsToMemorize")}</p></div>
            <div className="flex justify-center"><motion.div animate={{scale:[1,1.1,1],rotate:[0,5,-5,0]}} transition={{duration:2,repeat:Infinity,ease:"easeInOut"}} className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full flex items-center justify-center text-xl sm:text-2xl text-white font-bold shadow-lg">5</motion.div></div>
        </motion.div>
      </div>
    </>
  );

  // Base classes for the modal content box, matching InfoDialog
  const modalBoxBaseClasses = "relative max-w-2xl w-11/12 bg-gradient-to-br from-amber-100 to-yellow-50 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-200 flex flex-col";
  // Class for the scrollable content area within the modal
  const scrollableAreaClass = "overflow-y-auto pr-2 pb-2 flex-grow instructions-scrollable-area"; // Added pb-2 for bottom spacing before button
  // Max height, similar to InfoDialog
  const modalMaxHeightClass = "max-h-[90vh]";

  const modalClassName = `${modalBoxBaseClasses} ${modalMaxHeightClass}`;

  let stageContent = null;

  if (stage === "initialInstructions") {
    stageContent = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center p-4 z-40" // z-index for main flow screen
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div> {/* Backdrop */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 25 }}
          className={modalClassName} // Apply common modal classes
        >
          <div className={scrollableAreaClass}>
            <HowToPlayContent />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="mt-6 w-full shrink-0 px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-yellow-500 text-white rounded-full text-md sm:text-lg font-semibold shadow-lg hover:shadow-xl"
            onClick={onStartPractice}
          >
            {t("startPracticeRound")}
          </motion.button>
        </motion.div>
      </motion.div>
    );
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
          className={modalClassName} // Apply common modal classes
        >
          <div className={scrollableAreaClass}>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 text-center mb-6">
                {t("readyForTest")}
            </h2>
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-amber-100">
                <p className="text-md sm:text-lg text-amber-800 text-center">
                {t("testDescription")}
                </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="mt-6 w-full shrink-0 px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-yellow-500 text-white rounded-full text-md sm:text-lg font-semibold shadow-lg hover:shadow-xl"
            onClick={onStartTest}
          >
            {t("startTest")}
          </motion.button>
        </motion.div>
      </motion.div>
    );
  } else if (stage === "infoOverlay") {
    // For overlay, the outer centering div is provided by WelcomeDialog
    stageContent = (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{y:20, opacity: 0}}
        transition={{ delay: 0, type: "spring", stiffness: 200, damping: 25 }}
        className={modalClassName} // Apply common modal classes
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click from WelcomeDialog
      >
        <div className={scrollableAreaClass}>
            <HowToPlayContent />
        </div>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 w-full shrink-0 px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-500 text-white rounded-full text-md font-semibold shadow-lg hover:shadow-xl"
            onClick={onClose}
        >
            {t("close")}
        </motion.button>
      </motion.div>
    );
  }

  if (!stageContent) return null;

  return (
    <>
      {stageContent}
      {/* Scoped CSS for WebKit scrollbars targeting the specific class */}
      <style jsx global>{`
        .instructions-scrollable-area::-webkit-scrollbar {
          width: 10px;
          height: 10px;
          border-left: 3px solid transparent;
          border-right: 3px solid transparent;
          background-clip: padding-box;
        }
        .instructions-scrollable-area::-webkit-scrollbar-track {
          background: rgba(252, 211, 77, 0.15); /* amber-200 with ~15% opacity */
          border-radius: 10px;
        }
        .instructions-scrollable-area::-webkit-scrollbar-thumb {
          background-color: #F59E0B; /* amber-500 */
          border-radius: 10px;
          border: 2px solid transparent; 
          background-clip: content-box;
        }
        .instructions-scrollable-area::-webkit-scrollbar-thumb:hover {
          background-color: #D97706; /* amber-600 */
        }
        .instructions-scrollable-area::-webkit-scrollbar-corner {
          background: transparent;
        }
        /* Basic Firefox scrollbar styling */
        .instructions-scrollable-area {
           scrollbar-width: thin;
           scrollbar-color: #F59E0B rgba(252, 211, 77, 0.15); /* thumb track */
        }
      `}</style>
    </>
  );
};

export default InstructionsScreen;