// InstructionsComponent.jsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaTimes } from 'react-icons/fa';
// Make sure this path is correct for your project structure
import { useLanguage } from "../../../contexts/LanguageContext"; 

const backgroundImageAsset = "/sound-test/whispering-isle.png"; 

const InstructionsComponent = ({ 
    onComplete, 
    proceedButtonTextKey, // Key for the main action button text
    isOverlay = false
}) => {
    const { t } = useLanguage();

    return (
        <div
            className={`fixed inset-0 overflow-y-auto flex items-center justify-center p-4 md:p-8 ${isOverlay ? 'z-[150]' : 'z-[100]'}`}
            style={!isOverlay ? { backgroundImage: `url(${backgroundImageAsset})` } : {}}
        >
            {isOverlay && <div className="fixed inset-0 bg-black/75 backdrop-blur-lg" onClick={onComplete} />}

            <motion.div
                key={isOverlay ? "instructions-overlay" : "instructions-initial"}
                initial={{ opacity: 0, y: 50, scale: isOverlay ? 0.95 : 1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                className="relative bg-gradient-to-br from-slate-800/90 via-gray-900/90 to-neutral-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl w-full max-w-3xl border-2 border-white/30 text-white"
            >
                {isOverlay && (
                     <motion.button
                        onClick={onComplete}
                        className="absolute top-4 right-5 text-gray-300 hover:text-white transition-colors z-10"
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
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-6 lg:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-teal-300 to-green-400"
                >
                    {t('testInstructionsTitle')}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="space-y-4 text-base sm:text-lg lg:text-xl leading-relaxed text-gray-200 mb-8 lg:mb-10 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar"
                >
                    <p>{t('instructionWelcome')}</p>
                    
                    <h2 className="text-xl sm:text-2xl font-semibold text-teal-300 mt-6 mb-3">{t('instructionHowToPlayTitle')}</h2>
                    <ul className="list-disc list-inside space-y-3 pl-4">
                        <li>{t('instructionListenCarefully')}</li>
                        <li>{t('instructionTwoWords')}</li>
                        <li>{t('instructionSameOrDifferent')}</li>
                        <li>{t('instructionDemoRoundFirst')}</li>
                        <li>{t('instructionDemoRetry')}</li>
                        <li>{t('instructionDemoSuccess')}</li>
                        <li>{t('instructionMainTest')}</li>
                    </ul>
                     
                    <h2 className="text-xl sm:text-2xl font-semibold text-teal-300 mt-6 mb-3">{t('instructionGoodLuckTitle')}</h2>
                    <p>{t('instructionGoodLuckMessage')}</p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, y: -3, boxShadow: "0px 10px 25px rgba(0, 255, 255, 0.35)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onComplete}
                        className="flex items-center gap-3 py-3 px-8 sm:py-4 sm:px-10 rounded-xl font-bold text-lg sm:text-xl shadow-xl transition-all duration-300
                                   bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 text-white
                                   hover:from-teal-600 hover:via-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-cyan-400/50"
                    >
                        <span>{t(proceedButtonTextKey)}</span>
                        {!isOverlay && <FaPlay />} 
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default InstructionsComponent;