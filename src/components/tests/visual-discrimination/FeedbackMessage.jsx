import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaRegGrinStars, FaRegSmileBeam, FaRegMeh } from 'react-icons/fa';
import { useLanguage } from '../../../contexts/LanguageContext';


const FeedbackMessage = ({ score, total }) => {
  const { t } = useLanguage();
  const percentage = total > 0 ? (score / total) * 100 : 0;

  let message = "";
  let icon = null;
  let color = "text-yellow-300";

  if (percentage >= 90) {
    message = t("feedbackExcellent");
    icon = <FaRegGrinStars size={30} className="animate-pulse" />;
    color = "text-emerald-300";
  } else if (percentage >= 70) {
    message = t("feedbackGreatJob");
    icon = <FaStar size={30} />;
    color = "text-lime-300";
  } else if (percentage >= 50) {
    message = t("feedbackGoodEffort");
    icon = <FaRegSmileBeam size={30} />;
    color = "text-amber-300";
  } else {
    message = t("feedbackKeepPracticing");
    icon = <FaRegMeh size={30} />; // Or a more encouraging icon
    color = "text-orange-400";
  }

  return (
    <motion.div 
      className={`flex flex-col items-center justify-center p-4 rounded-lg mt-6 ${color}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      <div className="mb-2 text-4xl">{icon}</div>
      <p className="text-xl sm:text-2xl font-semibold text-center font-serif">{message}</p>
    </motion.div>
  );
};

export default FeedbackMessage;