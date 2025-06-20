// app/(tests)/sequence-arrangement/InfoDialog.js
"use client";

import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

const InfoDialog = ({ show, onClose, t }) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <motion.div
        key="infoDialogBackdrop"
        // ... (backdrop props as before)
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          // ... (modal box props as before)
          className="bg-amber-50 rounded-3xl p-6 sm:p-8 max-w-2xl w-11/12 mx-auto shadow-2xl relative border-4 border-amber-200 max-h-[90vh] overflow-y-auto info-dialog-scrollable-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ... (Close button, title, content sections as before) ... */}
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 text-amber-700 hover:text-amber-900 z-10"
            aria-label="Close information"
          >
            <IoClose className="text-3xl sm:text-4xl" />
          </motion.button>

          <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 mb-6 text-center pt-4">
            {t("aboutTheGame")}
          </h2>

          <div className="space-y-4 sm:space-y-6">
            {/* How to Play Section */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-amber-100">
              <h3 className="text-lg sm:text-xl font-semibold text-amber-700 mb-3 sm:mb-4">
                {t("howToPlay")}
              </h3>
              <p className="text-sm sm:text-base text-amber-800 mb-3 sm:mb-4">
                {t("memoryGameDescription")}
              </p>
              <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-amber-800">
                <li>{t("watchSequence")}</li>
                <li>{t("rememberOrder")}</li>
                <li>{t("recreateSequence")}</li>
                <li>{t("fiveSecondsToMemorize")}</li>
              </ol>
            </div>

            {/* Game Structure Section */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-amber-100">
              <h3 className="text-lg sm:text-xl font-semibold text-amber-700 mb-3 sm:mb-4">
                {t("gameStructure")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                <div>
                  <h4 className="font-semibold text-amber-800">{t("practiceRound")}</h4>
                  <p className="text-amber-800">{t("practiceRoundDescription")}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800">{t("mainTest")}</h4>
                  <p className="text-amber-800">{t("mainTestDescription")}</p>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-amber-100">
              <h3 className="text-lg sm:text-xl font-semibold text-amber-700 mb-3 sm:mb-4">
                {t("tips")}
              </h3>
              <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-amber-800">
                <li>{t("focusOnOrder")}</li>
                <li>{t("lookForPatterns")}</li>
                <li>{t("takeYourTime")}</li>
                <li>{t("removeRearrange")}</li>
              </ul>
            </div>
          </div>

          <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-500 text-white rounded-full text-md font-semibold shadow-lg hover:shadow-xl"
              onClick={onClose}
          >
              {t("close")}
          </motion.button>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        .info-dialog-scrollable-content::-webkit-scrollbar {
          width: 12px; /* Slightly wider to accommodate inset effect */
          height: 12px;
          /* Add transparent borders to the scrollbar itself to create padding */
          border-left: 4px solid transparent; /* Pushes track and thumb from left edge */
          border-right: 4px solid transparent; /* Pushes track and thumb from right edge (for vertical scrollbar) */
          /* For horizontal scrollbar, you might use border-top and border-bottom if needed */
          background-clip: padding-box; /* Important for borders to create space */
        }

        .info-dialog-scrollable-content::-webkit-scrollbar-track {
          background: rgba(245, 158, 11, 0.1); /* amber-500 with 10% opacity for track */
          border-radius: 10px;
          /* The track itself now sits within the padded area of ::-webkit-scrollbar */
        }

        .info-dialog-scrollable-content::-webkit-scrollbar-thumb {
          background-color: #D97706; /* Tailwind's amber-600 */
          border-radius: 10px;
          /* Make the thumb seem inset by having its border match the track or be transparent,
             and using background-clip to ensure the background color is only within the content area.
             The actual "padding" comes from the ::-webkit-scrollbar borders. */
          border: 2px solid rgba(245, 158, 11, 0.1); /* Match track background or make fully transparent */
          background-clip: padding-box; /* Clips background to padding box, border provides the "spacing" */
        }
        
        /* If you want the thumb to be thinner than the track created by ::-webkit-scrollbar's borders */
        /* You can add borders to the thumb itself which are transparent, pushing its background color inward */
        .info-dialog-scrollable-content::-webkit-scrollbar-thumb {
            /* ... previous thumb styles ... */
            border: 3px solid transparent; /* Increase this border to make the colored part of thumb thinner */
            background-clip: content-box; /* Clips background to area inside this border */
        }


        .info-dialog-scrollable-content::-webkit-scrollbar-thumb:hover {
          background-color: #B45309; /* Tailwind's amber-700 for hover */
        }

        .info-dialog-scrollable-content::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
    </>
  );
};

export default InfoDialog;