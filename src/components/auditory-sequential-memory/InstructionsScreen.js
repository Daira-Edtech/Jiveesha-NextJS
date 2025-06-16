"use client"; // This component uses client-side hooks like useState, useEffect, and browser APIs.

import { motion } from "framer-motion";
import { HelpCircle, Volume2 } from "lucide-react"; // Importing icons

/**
 * InstructionsScreen component displays the game instructions for both forward and reverse modes.
 * It takes 'mode' to determine which set of instructions to show.
 */
export default function InstructionsScreen({ mode, onStartForward, onStartReverse, t }) {
  const isForwardMode = mode === "forward";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center p-6 sm:p-10 bg-white rounded-2xl shadow-lg max-w-sm sm:max-w-md md:max-w-3xl mx-auto border border-gray-100 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]"
    >
      <div className="mb-8">
        {isForwardMode ? (
          <Volume2 size={64} className="mx-auto text-blue-600" />
        ) : (
          <HelpCircle size={64} className="mx-auto text-blue-600" />
        )}
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
        {isForwardMode ? t("memory_test") : t("level_up_reverse_challenge")}
      </h2>
      <div className="space-y-6 mb-10 w-full max-w-xl">
        {isForwardMode ? (
          <>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              {t("welcome_memory_game")}
            </p>
            <ul className="grid grid-cols-1 gap-4 sm:gap-6">
              <li className="flex items-center gap-4 bg-blue-50 p-4 sm:p-6 rounded-xl">
                <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-base sm:text-lg">
                  1
                </span>
                <span className="text-base sm:text-lg text-gray-700">
                  {t("listen_carefully_numbers")}
                </span>
              </li>
              <li className="flex items-center gap-4 bg-blue-50 p-4 sm:p-6 rounded-xl">
                <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-base sm:text-lg">
                  2
                </span>
                <span className="text-base sm:text-lg text-gray-700">
                  {t("repeat_back_exactly")}
                </span>
              </li>
              <li className="flex items-center gap-4 bg-blue-50 p-4 sm:p-6 rounded-xl">
                <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-base sm:text-lg">
                  3
                </span>
                <span className="text-base sm:text-lg text-gray-700">
                  {t("start_easy_get_harder")}
                </span>
              </li>
            </ul>
          </>
        ) : (
          <>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              {t("now_exciting_twist")}
            </p>
            <div className="bg-blue-50 p-6 sm:p-8 rounded-xl">
              <p className="text-lg sm:text-xl text-gray-700">
                {t("if_i_say")}{" "}
                <span className="font-bold text-blue-600">1 - 3 - 5</span>
                <br />
                {t("you_say")}{" "}
                <span className="font-bold text-blue-600">5 - 3 - 1</span>
              </p>
            </div>
          </>
        )}
      </div>
      <button
        onClick={isForwardMode ? onStartForward : onStartReverse}
        className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white text-lg sm:text-xl font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300 hover:shadow-lg"
      >
        {isForwardMode ? t("start_test") : t("start_reverse_challenge")}
      </button>
    </motion.div>
  );
}
