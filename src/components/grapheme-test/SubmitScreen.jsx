"use client";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import Button from "./Button"; // Uses the generic Button

const SubmitScreen = ({ onSubmit, isProcessingSubmit }) => {
  return (
    <motion.div
      key="submit"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-8xl mb-6 text-white" // Added text-white for emoji visibility
      >
        🏔️
      </motion.div>
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-white mb-4"
      >
        Ready to Submit?
      </motion.h2>
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-orange-300 mb-8 text-lg"
      >
        You've completed all the letters!
      </motion.p>
      {/* Using the generic Button component and overriding styles via className */}
      <Button
        onClick={onSubmit}
        isLoading={isProcessingSubmit}
        disabled={isProcessingSubmit}
        className="!text-lg !font-semibold !px-8 !py-3 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 border-none shadow-lg !text-white"
        // Base Button styles are for text-sm, so we use ! to ensure these larger styles apply
      >
        🎼 Submit Your Answers
      </Button>
    </motion.div>
  );
};

SubmitScreen.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isProcessingSubmit: PropTypes.bool.isRequired,
};

export default SubmitScreen;