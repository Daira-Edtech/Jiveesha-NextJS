"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Monitor, Zap } from "lucide-react";
import FullscreenModal from "@/components/FullscreenModal";

const EnhanceExperience = ({ 
  onStartGame, 
  translations,
  showButton = true,
  autoTrigger = false,
  children 
}) => {
  const [showFullscreenModal, setShowFullscreenModal] = useState(autoTrigger);

  const handleEnhanceClick = () => {
    setShowFullscreenModal(true);
  };

  const handleCloseModal = () => {
    setShowFullscreenModal(false);
  };

  const handleStartGame = () => {
    setShowFullscreenModal(false);
    if (onStartGame) {
      onStartGame();
    }
  };

  return (
    <>
      {showButton && (
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEnhanceClick}
          className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          {/* Animated background effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          />
          
          {/* Content */}
          <div className="relative flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-5 h-5" />
            </motion.div>
            <span>{translations?.enhanceExperience || "Enhance Experience"}</span>
            <Maximize2 className="w-4 h-4 opacity-70" />
          </div>

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          />
        </motion.button>
      )}

      {/* Render children if provided */}
      {children}

      {/* Fullscreen Modal */}
      <FullscreenModal
        isOpen={showFullscreenModal}
        onClose={handleCloseModal}
        onStartGame={handleStartGame}
        translations={translations}
      />
    </>
  );
};

// Alternative component for inline embedding
export const EnhanceExperienceCard = ({ 
  onStartGame, 
  translations,
  className = "" 
}) => {
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);

  const handleEnhanceClick = () => {
    setShowFullscreenModal(true);
  };

  const handleCloseModal = () => {
    setShowFullscreenModal(false);
  };

  const handleStartGame = () => {
    setShowFullscreenModal(false);
    if (onStartGame) {
      onStartGame();
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={`bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {translations?.enhanceExperience || "Enhance Experience"}
            </h3>
            <p className="text-sm text-gray-600">
              Optimize your learning environment
            </p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">
          {translations?.fullScreenRecommendation || "For the best experience, we recommend using fullscreen mode."}
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEnhanceClick}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Maximize2 className="w-5 h-5" />
          {translations?.enterFullscreen || "Enter Fullscreen"}
        </motion.button>
      </motion.div>

      {/* Fullscreen Modal */}
      <FullscreenModal
        isOpen={showFullscreenModal}
        onClose={handleCloseModal}
        onStartGame={handleStartGame}
        translations={translations}
      />
    </>
  );
};

export default EnhanceExperience;
