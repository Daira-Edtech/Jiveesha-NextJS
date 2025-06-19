// components/grapheme-test/InfoDialog.jsx
"use client";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FaAssistiveListeningSystems, FaMousePointer, FaRegLightbulb, FaTimes } from "react-icons/fa";

const InfoDialog = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  const instructions = [
    {
      icon: <FaRegLightbulb className="text-yellow-400 text-2xl sm:text-3xl flex-shrink-0" />,
      text: t("graphemeInfoStep1", "You will be shown a letter (grapheme)."),
    },
    {
      icon: <FaAssistiveListeningSystems className="text-sky-400 text-2xl sm:text-3xl flex-shrink-0" />,
      text: t("graphemeInfoStep2", "Recall its sound (phoneme). Then, type or record the sound the letter makes."),
    },
    {
      icon: <FaMousePointer className="text-green-400 text-2xl sm:text-3xl flex-shrink-0" />,
      text: t("graphemeInfoStep3", "You'll have a few seconds for each letter. Try your best to match them!"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-[150] p-4"
      onClick={onClose} // Close when clicking on the overlay
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg border border-slate-600 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dialog
      >
        {/* Optional Background Image for Dialog Content
        {DIALOG_BACKGROUND_IMG_PATH && (
          <Image
            src={DIALOG_BACKGROUND_IMG_PATH}
            alt={t("infoDialogBackgroundAlt", "Informative background")}
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 -z-10 opacity-5 blur-sm rounded-xl"
            priority
          />
        )}
        */}
        <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-200 transition-colors z-20 p-1.5 rounded-full hover:bg-slate-700/80"
            aria-label={t("closeDialog", "Close dialog")}
        >
            <FaTimes size={20} />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-orange-400 mb-6 sm:mb-8 text-center">
          {t("howToPlayGraphemeTest", "How to Play: Letter Sounds")}
        </h2>

        <div className="space-y-4 sm:space-y-5 mb-8">
          {instructions.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3 sm:gap-4 p-3.5 bg-slate-700/60 rounded-lg border border-slate-600/70 shadow"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
            >
              <div className="pt-0.5">{item.icon}</div>
              <p className="text-sm sm:text-base leading-relaxed text-slate-200">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full sm:w-auto mx-auto flex items-center justify-center gap-2 py-2.5 px-8 rounded-lg font-semibold text-sm sm:text-base shadow-md transition-all duration-300 bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-95"
        >
          {t("gotItButton", "Got It!")}
        </button>
      </motion.div>
    </motion.div>
  );
};

InfoDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default InfoDialog;