// InstructionsComponent.jsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    FaPlay, 
    FaTimes, 
    FaGraduationCap,
    FaGamepad,
    FaStar
} from 'react-icons/fa';
import { 
    FiHeadphones,
    FiMessageSquare,
    FiGitPullRequest, // Using this as the replacement for the previous error
    FiPlayCircle,
    FiRepeat,
    FiThumbsUp,
    FiFlag,
    FiInfo
} from 'react-icons/fi';
import { useLanguage } from "../../../contexts/LanguageContext"; 

const backgroundImageAsset = "/sound-test/whispering-isle.png"; 

const InstructionsComponent = ({ 
    onComplete, 
    proceedButtonTextKey, 
    isOverlay = false
}) => {
    const { t } = useLanguage();

    const highlightColor = "text-teal-300"; // Accent color for harmony with background

    // Standard instruction items for a detailed instruction page
    const instructionItems = [
        { key: 'instructionListenCarefully', icon: <FiHeadphones className={`inline mr-3 ${highlightColor}`} size={22} /> },
        { key: 'instructionTwoWords', icon: <FiMessageSquare className={`inline mr-3 ${highlightColor}`} size={22} /> },
        { key: 'instructionSameOrDifferent', icon: <FiGitPullRequest className={`inline mr-3 ${highlightColor}`} size={22} /> },
        { key: 'instructionDemoRoundFirst', icon: <FiPlayCircle className={`inline mr-3 ${highlightColor}`} size={22} /> },
        { key: 'instructionDemoRetry', icon: <FiRepeat className={`inline mr-3 ${highlightColor}`} size={22} /> },
        { key: 'instructionDemoSuccess', icon: <FiThumbsUp className={`inline mr-3 ${highlightColor}`} size={22} /> },
        { key: 'instructionMainTest', icon: <FiFlag className={`inline mr-3 ${highlightColor}`} size={22} /> },
    ];

    return (
        <>
            {!isOverlay && (
                <div className="fixed inset-0 z-30"> 
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url(${backgroundImageAsset})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(8px)",
                        }}
                    />
                    <motion.div
                        className="absolute inset-0 bg-black/60" // Dark overlay for contrast
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            )}

            <div
                className={`fixed inset-0 overflow-y-auto flex items-center justify-center p-4 md:p-8 ${isOverlay ? 'z-[150]' : 'z-[100]'}`}
            >
                {isOverlay && <div className="fixed inset-0 bg-black/75 backdrop-blur-lg" onClick={onComplete} />} 

                <motion.div
                    key={isOverlay ? "instructions-overlay-dark-themed" : "instructions-initial-dark-themed"}
                    initial={{ opacity: 0, y: 50, scale: isOverlay ? 0.95 : 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                    // Panel style: Dark, blurred, with teal accents
                    className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 
                               shadow-2xl w-full max-w-3xl border-2 border-teal-400/50 text-white overflow-hidden"
                >
                    {/* Optional: Subtle top gradient bar for a touch of color */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-500/70 via-teal-500/70 to-emerald-500/70 opacity-90"></div>
                    
                    {isOverlay && (
                         <motion.button
                            onClick={onComplete}
                            className="absolute top-5 right-6 text-gray-400 hover:text-white transition-colors z-20"
                            aria-label={t('closeInstructionsAriaLabel')}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaTimes size={28} />
                        </motion.button>
                    )}

                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 lg:mb-10 
                                   bg-clip-text text-transparent bg-gradient-to-r from-sky-200 via-teal-200 to-emerald-300" 
                    >
                        <FaGraduationCap className={`mr-3 ${highlightColor} filter drop-shadow-md`} /> 
                        {t('testInstructionsTitle')}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="space-y-5 text-base sm:text-lg lg:text-xl leading-relaxed text-slate-200 
                                   mb-8 lg:mb-10 max-h-[50vh] sm:max-h-[55vh] overflow-y-auto pr-3 custom-scrollbar-dark"
                    >
                        <p className="flex items-start">
                            <FiInfo className={`inline-block mr-3 ${highlightColor} flex-shrink-0 mt-1.5`} size={22} />
                            <span>{t('instructionWelcome')}</span>
                        </p>
                        
                        <h2 className={`text-xl sm:text-2xl font-semibold ${highlightColor} mt-6 mb-3 flex items-center`}>
                            <FaGamepad className="mr-3" /> {t('instructionHowToPlayTitle')}
                        </h2>
                        <ul className="space-y-3 pl-2 sm:pl-4">
                            {instructionItems.map(item => (
                                <li key={item.key} className="flex items-start">
                                    {item.icon}
                                    <span>{t(item.key)}</span>
                                </li>
                            ))}
                        </ul>
                         
                        <h2 className={`text-xl sm:text-2xl font-semibold ${highlightColor} mt-6 mb-3 flex items-center`}>
                            <FaStar className="mr-3" /> {t('instructionGoodLuckTitle')}
                        </h2>
                        <p className="text-slate-300">{t('instructionGoodLuckMessage')}</p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex justify-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, y: -3, boxShadow: "0px 8px 20px rgba(20, 184, 166, 0.35)" }} // Teal shadow
                            whileTap={{ scale: 0.95 }}
                            onClick={onComplete}
                            // Button style: Teal/Green gradient, fits the theme
                            className="flex items-center justify-center gap-3 py-3 px-8 sm:py-4 sm:px-10 lg:px-12 
                                       rounded-xl font-bold text-lg sm:text-xl shadow-xl transition-all duration-300
                                       bg-gradient-to-r from-teal-500 via-emerald-500 to-green-600 text-white
                                       hover:from-teal-600 hover:via-emerald-600 hover:to-green-700 
                                       focus:outline-none focus:ring-4 focus:ring-emerald-400/60"
                        >
                            <span>{t(proceedButtonTextKey)}</span>
                            {/* Show FaPlay only if it's the main instruction screen's proceed button */}
                            {!isOverlay && proceedButtonTextKey !== 'gotItButton' && <FaPlay className="mt-0.5" />} 
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
};

export default InstructionsComponent;