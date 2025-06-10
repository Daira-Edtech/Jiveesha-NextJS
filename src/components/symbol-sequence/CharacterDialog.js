// app/(your-main-app-route)/symbol-sequence-test/components/CharacterDialog.js
'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CharacterDialog = ({ onComplete, t }) => {
  const [text, setText] = useState('');
  const fullText = "Welcome, brave adventurer! Prepare to test your wisdom and memory in the ancient halls of symbols. The challenge awaits!"; // Example intro text

  useEffect(() => {
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setText(fullText.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(onComplete, 2000); // Auto-complete after text is shown for a bit
      }
    }, 50); // Typing speed

    return () => clearInterval(typingInterval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 text-white rounded-xl shadow-xl p-8 max-w-2xl text-center border border-blue-500/50"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-yellow-300">Wise Elder</h2>
        <p className="text-xl leading-relaxed mb-6 font-serif italic">
          {text}
        </p>
        {/* You could add a 'Skip' button here if desired */}
        {text === fullText && (
          <motion.button
            onClick={onComplete}
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {t("continue")}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CharacterDialog;