// app/(your-main-app-route)/symbol-sequence-test/components/GameOverScreen.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';

const GameOverScreen = ({ score, onPlayAgain, isSubmitting, submitError, t }) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div className="bg-black/50 backdrop-blur-lg rounded-2xl shadow-2xl p-10 w-full max-w-3xl text-center border border-purple-500/30">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">
          {t('gameComplete')}
        </h2>

        <div className="w-40 h-40 mx-auto my-6 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
          <span className="text-6xl font-bold text-blue-700">
            {score}/10
          </span>
        </div>

        <p className="text-xl mb-8 text-blue-700">{t('finalScore')}</p>

        <div className="my-8 text-2xl">
          {score >= 9 && (
            <p className="text-yellow-500 font-bold">
              {t('excellentMemory')}
            </p>
          )}
          {score >= 7 && score < 9 && (
            <p className="text-green-600 font-bold">{t('veryGoodJob')}</p>
          )}
          {score >= 5 && score < 7 && (
            <p className="text-blue-600">{t('goodEffort')}</p>
          )}
          {score < 5 && (
            <p className="text-blue-600">{t('keepPracticing')}</p>
          )}
        </div>

        {submitError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
            <p>{submitError}</p>
          </div>
        )}

        <button
          onClick={onPlayAgain}
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-3 px-8 rounded-lg shadow-lg hover:shadow-purple-500/40 transition-all"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {t('savingResults')}
            </div>
          ) : (
            t('playAgain')
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default GameOverScreen;