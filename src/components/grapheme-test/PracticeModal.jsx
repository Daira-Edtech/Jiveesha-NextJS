"use client";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import Button from "./Button"; // Assuming Button.jsx is in the same components folder

const PracticeModal = ({ isOpen, onClose, onStartFullTest, message }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4"
      onClick={onClose} 
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-sky-400 mb-4 text-center">Practice Done!</h2>
        <p className="text-slate-300 mb-6 text-center text-sm sm:text-base">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onStartFullTest}
            className="!w-full sm:!w-auto !bg-sky-500 hover:!bg-sky-600 !text-white !font-semibold !py-2.5 !px-5"
          >
            Start Full Test
          </Button>
          <Button
            onClick={onClose} // e.g., to retry practice or just close
            variant="secondary"
            className="!w-full sm:!w-auto !bg-slate-700 hover:!bg-slate-600 !text-slate-200 !font-semibold !py-2.5 !px-5"
          >
            Review Practice
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

PracticeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onStartFullTest: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default PracticeModal;