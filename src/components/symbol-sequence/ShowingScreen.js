// app/(your-main-app-route)/symbol-sequence-test/components/ShowingScreen.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';

const ShowingScreen = ({ currentSequence, showingIndex, currentRound, difficultyLevel, t, symbols }) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-gradient-to-br from-[#1a2a3a]/80 to-[#3b2f1d]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_rgba(217,162,75,0.8)] px-16 py-20 w-full max-w-6xl text-center border-2 border-[#d9a24b]/30 relative overflow-hidden h-[700px] max-h-[90vh]"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-[#d9a24b]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-[#f3c969]/10 rounded-full filter blur-3xl"></div>

        <h2 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f3c969] to-[#d9a24b] mb-12 tracking-wider">
          {t('lookCarefully')}
        </h2>

        {/* Progress Bar */}
        <div className="relative pt-1 mb-14 w-4/5 mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base sm:text-lg font-semibold text-[#f7f1e3]">
              Round {currentRound} of 10
            </span>
            <span className="text-base sm:text-lg font-semibold text-[#f3c969]">
              {Math.round((currentRound / 10) * 100)}% Complete
            </span>
          </div>
          <div className="overflow-hidden h-4 rounded-full bg-[#1a2a3a]/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentRound / 10) * 100}%` }}
              transition={{ duration: 0.7 }}
              className="h-full bg-gradient-to-r from-[#d9a24b] to-[#f3c969] shadow-lg"
            />
          </div>
        </div>

        {/* Symbol Grid */}
        <div className="flex justify-center flex-wrap gap-10 my-12">
          {currentSequence.map((symbol, index) => (
            <motion.div
              key={index}
              className="w-40 h-40 flex items-center justify-center relative"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-full h-full flex items-center justify-center text-6xl sm:text-7xl lg:text-8xl rounded-2xl relative overflow-hidden"
                style={{
                  background: 'radial-gradient(circle, rgba(26,42,58,0.8), rgba(59,47,29,0.8))',
                  border: '2px solid rgba(217, 162, 75, 0.7)',
                  boxShadow:
                    showingIndex === index
                      ? '0 0 30px rgba(217,162,75,0.9)'
                      : '0 0 15px rgba(217,162,75,0.5)',
                  color: '#f7f1e3',
                  textShadow:
                    showingIndex === index
                      ? '0 0 20px rgba(247, 241, 227, 0.9)'
                      : '0 0 10px rgba(247, 241, 227, 0.7)',
                }}
                animate={{
                  scale: showingIndex === index ? [1, 1.2, 1] : 1,
                  rotate: showingIndex === index ? [0, 10, -10, 0] : 0,
                }}
                transition={{
                  duration: 0.6,
                  ease: 'easeInOut',
                }}
              >
                {symbol}
                {showingIndex === index && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#f3c969]/30 to-[#d9a24b]/30 rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.4, 0] }}
                    transition={{ duration: 1 }}
                  />
                )}
              </motion.div>

              {/* Floating Particles */}
              {showingIndex === index && (
                <motion.div
                  className="absolute -inset-4 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0] }}
                  transition={{ duration: 1.5 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-[#f3c969] text-xl sm:text-2xl"
                      initial={{ x: 0, y: 0, opacity: 0.8 }}
                      animate={{
                        x: Math.random() * 60 - 30,
                        y: Math.random() * 60 - 30,
                        opacity: 0,
                      }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    >
                      {symbols[Math.floor(Math.random() * symbols.length)]}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Timer Bar */}
        <div className="w-4/5 mx-auto bg-[#1a2a3a]/30 rounded-full h-5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#f3c969] to-[#d9a24b] shadow-lg"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{
              duration: difficultyLevel.timeToView / 1000,
              ease: 'linear',
            }}
          />
        </div>

        <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-[#f7f1e3] font-medium tracking-wider">
          {t('waitUntilDisappear')}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ShowingScreen;