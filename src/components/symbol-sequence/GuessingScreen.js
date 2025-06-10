// app/(your-main-app-route)/symbol-sequence-test/components/GuessingScreen.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';

const GuessingScreen = ({
  currentSequence,
  userSequence,
  availableSymbols,
  currentRound,
  selectSymbol,
  removeSymbol,
  hoveredCardIndex,
  setHoveredCardIndex,
  t,
}) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-gradient-to-br from-[#1a2a3a]/80 to-[#3b2f1d]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(217,162,75,0.7)] p-12 w-full max-w-4xl text-center border-2 border-[#d9a24b]/30 relative overflow-hidden"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {/* Glow effects */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#d9a24b]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#f3c969]/10 rounded-full filter blur-3xl"></div>

        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f3c969] to-[#d9a24b] mb-10 tracking-wider">
          {t('recreateSequence')}
        </h2>

        {/* Enhanced Progress Bar */}
        <div className="relative pt-1 mb-12 w-3/4 mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#f7f1e3]">
              Round {currentRound} of 10
            </span>
            <span className="text-sm font-semibold text-[#f3c969]">
              {Math.round((currentRound / 10) * 100)}% Complete
            </span>
          </div>
          <div className="overflow-hidden h-3 mb-6 rounded-full bg-[#1a2a3a]/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentRound / 10) * 100}%` }}
              transition={{ duration: 0.7 }}
              className="h-full bg-gradient-to-r from-[#d9a24b] to-[#f3c969] shadow-lg"
            />
          </div>
        </div>

        {/* User Sequence Area - Larger */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-[#f7f1e3] tracking-wider">
            {t('yourSequence').toUpperCase()}
          </h3>
          <div className="flex justify-center flex-wrap gap-8 my-10">
            {userSequence.map((symbol, index) => (
              <motion.div
                key={index}
                className="relative w-28 h-28"
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredCardIndex(index)}
                onHoverEnd={() => setHoveredCardIndex(-1)}
              >
                <motion.div
                  className="w-full h-full flex items-center justify-center text-6xl rounded-2xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(26,42,58,0.8), rgba(59,47,29,0.8))',
                    border: '2px solid rgba(217, 162, 75, 0.7)',
                    boxShadow: '0 0 20px rgba(217, 162, 75, 0.5)',
                    color: '#f7f1e3',
                    textShadow: '0 0 10px rgba(247, 241, 227, 0.7)',
                  }}
                >
                  {symbol}
                </motion.div>
                {hoveredCardIndex === index && (
                  <motion.div
                    className="absolute inset-0 bg-[#3b2f1d]/80 rounded-2xl flex items-center justify-center cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => removeSymbol(index)}
                  >
                    <span className="text-[#f7f1e3] text-lg font-bold tracking-wider">
                      {t('remove')}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            ))}
            {/* Empty slots with pulsing animation */}
            {Array(currentSequence.length - userSequence.length)
              .fill(0)
              .map((_, index) => (
                <motion.div
                  key={index + userSequence.length}
                  className="w-28 h-28 flex items-center justify-center text-6xl rounded-2xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(26,42,58,0.5), rgba(59,47,29,0.5))',
                    border: '2px dashed rgba(217, 162, 75, 0.5)',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 0 rgba(217,162,75,0)',
                      '0 0 20px rgba(217,162,75,0.7)',
                      '0 0 0 rgba(217,162,75,0)',
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              ))}
          </div>
        </div>

        {/* Available Symbols - Enhanced */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-8 text-[#f7f1e3] tracking-wider">
            {t('availableSymbols').toUpperCase()}
          </h3>
          <div className="flex justify-center flex-wrap gap-6 my-8">
            {availableSymbols.map((symbol, index) => (
              <motion.button
                key={index}
                onClick={() => selectSymbol(symbol)}
                className="w-28 h-28 flex items-center justify-center text-6xl rounded-2xl relative group"
                style={{
                  background: 'radial-gradient(circle, rgba(26,42,58,0.8), rgba(59,47,29,0.8))',
                  border: '2px solid rgba(217, 162, 75, 0.5)',
                  color: '#f7f1e3',
                  textShadow: '0 0 10px rgba(247, 241, 227, 0.7)',
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: '0 0 30px rgba(217,162,75,0.8)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                {symbol}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#f7f1e3]/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GuessingScreen;