"use client";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import Button from "./Button"; // Uses the generic Button

const ResultsScreen = ({ score, totalLetters, onRestartTest }) => {
  const { width, height } = useWindowSize();
  const showConfetti = score > 0 && totalLetters > 0 && (score / totalLetters) >= 0.6; // Confetti for 60%+

  return (
    <>
      {showConfetti && width && height && ( // Ensure width/height before rendering
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={score > 0 ? 200 : 0} // Only if score is positive
          gravity={0.1}
          initialVelocityY={15}
          colors={["#FB923C", "#A855F7", "#3B82F6", "#F59E0B", "#FFFFFF"]}
        />
      )}
      <motion.div
        key="results"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 120, damping: 12 }}
          className="text-8xl mb-6 text-white" // Added text-white
        >
          {/* Dynamically choose emoji based on score */}
          {totalLetters > 0 && score / totalLetters >= 0.8 ? "🏆" : totalLetters > 0 && score / totalLetters >= 0.5 ? "🎉" : "👍"}
        </motion.div>
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white mb-4"
        >
          Results Are In!
        </motion.h2>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-orange-300 mb-6 text-xl"
        >
          You got <strong className="text-white font-semibold">{score}</strong> out of <strong className="text-white font-semibold">{totalLetters}</strong> correct!
        </motion.p>

        {/* Animated Score Bar */}
        <div className="w-full max-w-md bg-purple-900/60 rounded-full h-5 sm:h-6 mb-8 overflow-hidden border border-orange-400/40">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${totalLetters > 0 ? (score / totalLetters) * 100 : 0}%` }}
            transition={{ duration: 1.2, delay: 0.4, ease: "circOut" }}
            className="bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 h-full rounded-full relative flex items-center justify-center"
          >
            {/* Show percentage text if bar is wide enough */}
            { totalLetters > 0 && (score / totalLetters) * 100 >= 10 && (
                 <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }} // Delay until after bar animation
                    className="text-white font-bold text-xs sm:text-sm px-1"
                >
                    {Math.round((score / totalLetters) * 100)}%
                </motion.span>
            )}
          </motion.div>
        </div>

        {/* Using the generic Button component */}
        <Button
          onClick={onRestartTest}
          className="!text-lg !font-semibold !px-8 !py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 border-none shadow-lg !text-white"
        >
          🎵 Try Again
        </Button>
      </motion.div>
    </>
  );
};
ResultsScreen.propTypes = { score: PropTypes.number.isRequired, totalLetters: PropTypes.number.isRequired, onRestartTest: PropTypes.func.isRequired };
export default ResultsScreen;