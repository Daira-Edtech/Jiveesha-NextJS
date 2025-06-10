// app/(your-main-app-route)/symbol-sequence-test/components/WelcomeScreen.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';

const WelcomeScreen = ({ difficultyLevels, symbols, startGame, t }) => {
  return (
    <motion.div className="fixed inset-0 flex items-center justify-center p-4 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}>
      <motion.div
        className="bg-gradient-to-br from-[#1a2a3a]/70 to-[#3b2f1d]/70 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(217,162,75,0.5)] p-10 w-full max-w-5xl min-h-[600px] text-center border-2 border-[#d9a24b]/30 relative overflow-hidden text-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {/* Add magical glow elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#d9a24b]/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#f3c969]/20 rounded-full filter blur-3xl"></div>

        {/* Header with animated rune */}
        <motion.div className="relative">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f3c969] to-[#d9a24b] mb-6 pt-8">
            {t('symbolSequenceAssessment')}
          </h2>

          <p className="text-[#f7f1e3]/90 mb-8 leading-relaxed text-2xl">
            {t('symbolSequenceDescription')}
          </p>
        </motion.div>

        {/* Difficulty buttons with enhanced styling */}
        <motion.div className="mt-12">
          <h3 className="text-xl font-semibold mb-8 text-[#f7f1e3]/90 tracking-wider">
            {t('chooseDifficulty').toUpperCase()}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {difficultyLevels.map((level, index) => (
              <motion.button
                key={index}
                onClick={() => startGame(index)}
                className="relative overflow-hidden group px-12 py-10 rounded-xl font-bold text-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(26,42,58,0.7), rgba(59,47,29,0.7))',
                  border: '1px solid rgba(217, 162, 75, 0.5)',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 30px rgba(217, 162, 75, 0.8)',
                  y: -5,
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#d9a24b]/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                <span className="relative z-10 text-[#f7f1e3] tracking-wider flex flex-col items-center">
                  <span className="text-3xl mb-1">
                    {symbols[index + 5]}
                  </span>{' '}
                  {/* Decorative symbol */}
                  <span>{t(level.name)}</span>
                </span>

                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#f3c969]/10 to-[#d9a24b]/10 opacity-0 group-hover:opacity-100 rounded-xl"
                  transition={{ duration: 0.4 }}
                />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;