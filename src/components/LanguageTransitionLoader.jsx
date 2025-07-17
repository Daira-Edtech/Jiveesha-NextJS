"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const LanguageTransitionLoader = ({ isVisible, onComplete, currentLanguage = "en", targetLanguage = "hi" }) => {
  // Transition messages in different languages
  const transitionMessages = {
    en: {
      switching: "Language Switching...",
      poweredBy: "Translation powered by",
      tagline: "Making India's languages accessible to all"
    },
    hi: {
      switching: "भाषा बदली जा रही है...",
      poweredBy: "अनुवाद की शक्ति",
      tagline: "भारत की भाषाओं को सभी के लिए सुलभ बनाना"
    },
    kn: {
      switching: "ಭಾಷೆ ಬದಲಾಯಿಸಲಾಗುತ್ತಿದೆ...",
      poweredBy: "ಅನುವಾದದ ಶಕ್ತಿ",
      tagline: "ಭಾರತದ ಭಾಷೆಗಳನ್ನು ಎಲ್ಲರಿಗೂ ಪ್ರವೇಶಿಸುವಂತೆ ಮಾಡುವುದು"
    }
  };

  const getMessage = (key) => {
    return transitionMessages[targetLanguage]?.[key] || transitionMessages.en[key];
  };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-white/50 backdrop-blur-xl flex items-center justify-center"
        >
          <div className="text-center max-w-md mx-auto px-6">
            {/* Subtle background glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 bg-gradient-to-r from-blue-50 via-slate-50 to-orange-50 blur-2xl rounded-full"
            />
            
            {/* Main Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.4, type: "spring", stiffness: 300 }}
              className="relative bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200/60 shadow-lg overflow-hidden"
            >
              {/* Logos Container */}
              <motion.div
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center justify-center gap-8 mb-8"
              >
                {/* Daira Logo */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="bg-gray-50/80 rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <Image
                    src="/daira-logo1.png"
                    alt="Daira"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                </motion.div>

                {/* Connection Line with Animation */}
                <motion.div
                  className="flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      delay: 0
                    }}
                    className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                  />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      delay: 0.2
                    }}
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                  />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      delay: 0.4
                    }}
                    className="w-1.5 h-1.5 bg-orange-400 rounded-full"
                  />
                </motion.div>

                {/* Bhashini Logo */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.3
                  }}
                  className="bg-gray-50/80 rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <Image
                    src="/bhashini logo.png"
                    alt="Bhashini"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                </motion.div>
              </motion.div>

              {/* Loading Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6"
              >
                {/* Subtle Spinner */}
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full"
                  />
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-1 mb-4 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.3, duration: 2, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 via-slate-500 to-orange-500 rounded-full relative"
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Text Content */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="space-y-3"
              >
                <motion.h3
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-base font-semibold text-gray-800"
                >
                  {getMessage("switching")}
                </motion.h3>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="space-y-2"
                >
                  <p className="text-xs text-gray-600">
                    {getMessage("poweredBy")}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="font-semibold text-orange-600 text-sm"
                    >
                      Bhashini
                    </motion.span>
                    <span className="text-gray-400 text-xs">×</span>
                    <motion.span
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                      className="font-semibold text-blue-600 text-sm"
                    >
                      India AI
                    </motion.span>
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-xs text-gray-500 mt-2"
                  >
                    {getMessage("tagline")}
                  </motion.p>
                </motion.div>
              </motion.div>

              {/* Subtle floating elements */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gray-300 rounded-full"
                  animate={{
                    x: [0, Math.random() * 60 - 30],
                    y: [0, Math.random() * 60 - 30],
                    opacity: [0, 0.6, 0],
                    scale: [0, 0.8, 0]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut"
                  }}
                  style={{
                    left: `${30 + Math.random() * 40}%`,
                    top: `${30 + Math.random() * 40}%`,
                  }}
                />
              ))}
              
              {/* Corner accent dots */}
              <motion.div
                className="absolute top-6 left-6 w-1 h-1 bg-blue-400 rounded-full"
                animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-6 right-6 w-1 h-1 bg-orange-400 rounded-full"
                animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div
                className="absolute bottom-6 left-6 w-1 h-1 bg-slate-400 rounded-full"
                animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
              <motion.div
                className="absolute bottom-6 right-6 w-1 h-1 bg-gray-400 rounded-full"
                animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LanguageTransitionLoader;
