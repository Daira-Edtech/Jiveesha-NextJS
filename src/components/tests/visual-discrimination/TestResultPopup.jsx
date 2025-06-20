import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaRegWindowClose, FaMinusCircle } from 'react-icons/fa'; // Added FaMinusCircle
import { useLanguage } from '../../../contexts/LanguageContext'; 

const TestResultPopup = ({ questions, selectedOptions, onClose }) => {
  const { t } = useLanguage(); 

  const getErrorAnalysis = (correct, selected) => {
    if (selected === null || selected === "Not Answered") {
      return { 
        text: t("resultNotAnswered", "Not Answered"), 
        className: "text-yellow-300",
        icon: <FaMinusCircle />
      };
    }
    if (correct === selected) {
      return { 
        text: t("resultCorrect", "Correct"), 
        className: "text-emerald-400",
        icon: <FaCheckCircle />
      };
    }
    return { 
      text: t("resultIncorrect", "Incorrect"), 
      className: "text-red-400",
      icon: <FaTimesCircle />
    };
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="relative bg-gradient-to-br from-green-800/80 via-green-900/70 to-yellow-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-3xl text-white border-2 border-amber-400/30 max-h-[90vh] flex flex-col"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-lime-300 to-amber-300 opacity-70"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-emerald-400/10 rounded-full filter blur-lg opacity-60"></div>
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-amber-300/10 rounded-full filter blur-lg opacity-60"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-300 drop-shadow-sm">
            {t("resultsTitle", "Detailed Results")}
            </h2>
            <motion.button 
                whileHover={{scale: 1.1, rotate: 15}} 
                whileTap={{scale:0.9}} 
                onClick={onClose} 
                className="text-amber-200 hover:text-white transition-colors"
                aria-label={t("closeResults", "Close Results")}
            >
                <FaRegWindowClose size={30}/>
            </motion.button>
        </div>

        <div className="overflow-y-auto flex-grow relative z-10 custom-scrollbar-light pr-1">
          <table className="min-w-full ">
            <thead className="sticky top-0 bg-black/40 backdrop-blur-sm z-20">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold text-emerald-200 uppercase tracking-wider border-b-2 border-amber-400/40">
                  {t("tableHeaderCorrect", "Correct")}
                </th>
                <th className="px-3 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold text-emerald-200 uppercase tracking-wider border-b-2 border-amber-400/40">
                  {t("tableHeaderSelected", "Your Answer")}
                </th>
                <th className="px-3 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold text-emerald-200 uppercase tracking-wider border-b-2 border-amber-400/40">
                  {t("tableHeaderStatus", "Status")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {questions.map((q, index) => {
                const selected = selectedOptions[index] === null ? t("resultNotAnswered", "Not Answered") : selectedOptions[index];
                const analysis = getErrorAnalysis(q.correct, selectedOptions[index]); 
                return (
                  <tr key={index} className="hover:bg-white/5 transition-colors duration-150 text-sm sm:text-base">
                    <td className="px-3 sm:px-4 py-3 text-center text-yellow-100 font-medium">{q.correct}</td>
                    <td className={`px-3 sm:px-4 py-3 text-center font-medium ${selected === t("resultNotAnswered", "Not Answered") ? "text-gray-400 italic" : "text-yellow-50"}`}>
                        {selected}
                    </td>
                    <td
                      className={`px-3 sm:px-4 py-3 text-center font-semibold ${analysis.className} flex items-center justify-center gap-1.5`}
                    >
                      <span className="text-lg sm:text-xl">{analysis.icon}</span>
                      <span className="hidden md:inline">{analysis.text}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {questions.length === 0 && (
            <p className="text-center py-10 text-gray-300 font-serif">{t("noResultsToShow", "No results to show.")}</p>
          )}
        </div>

        <div className="mt-8 flex justify-center relative z-10">
          <motion.button
            whileHover={{ scale: 1.05, y: -2, boxShadow: "0px 0px 15px rgba(251, 191, 36, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex items-center justify-center gap-2 py-3 px-10 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 hover:shadow-amber-500/50"
          >
            {t("closeButton", "Close")}
          </motion.button>
        </div>
      </motion.div>
      <style jsx global>{`
        .custom-scrollbar-light::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05); 
          border-radius: 10px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.5); 
          border-radius: 10px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.7);
        }
      `}</style>
    </div>
  );
};

export default TestResultPopup;