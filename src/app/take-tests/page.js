"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import FullScreenDialog from "@/components/dialogs/FullScreenDialog";
import MapLayout from "@/components/MapLayout";
import "@/styles/fullscreen.css";

const TakeTests = ({ tests = [] }) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFullScreenDialog, setShowFullScreenDialog] = useState(true);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [hasDeclinedFullScreen, setHasDeclinedFullScreen] = useState(false);
  const [startScreenExiting, setStartScreenExiting] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFS = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullscreenElement ||
        document.msFullscreenElement
      );
      setIsFullScreen(isFS);
      if (!isFS) {
        setShowStartScreen(true);
        setShowFullScreenDialog(false);
        setHasDeclinedFullScreen(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, []);

  const enterFullScreen = async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      setIsFullScreen(true);
      setShowFullScreenDialog(false);
    } catch (err) {
      console.error('Error attempting to enter fullscreen:', err);
    }
  };

  const handleStartGame = () => {
    setStartScreenExiting(true);
    setTimeout(() => {
      setShowStartScreen(false);
      setStartScreenExiting(false);
    }, 1000);
  };

  const handleTestClick = (testId) => {
    localStorage.setItem("selectedTestId", testId);
    router.push("/selectstudent");
  };

  const handleQuit = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.webkitFullscreenElement) {
        await document.webkitExitFullscreen();
      } else if (document.msFullscreenElement) {
        await document.msExitFullscreen();
      }
    } catch (err) {
      console.error('Error exiting fullscreen:', err);
    }
  };

  // Initial clean white screen with fullscreen dialog
  if (!isFullScreen) {
    return (
      <div className="fullscreen-override">
        <div className="fullscreen-content flex items-center justify-center">
          {showFullScreenDialog ? (
            <FullScreenDialog
              isOpen={showFullScreenDialog}
              onClose={() => {
                setShowFullScreenDialog(false);
                setHasDeclinedFullScreen(true);
              }}
              onEnterFullScreen={enterFullScreen}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto px-4"
            >
              {/* Logo and Company Name Side by Side */}
              <motion.div
                className="flex items-center justify-center gap-6 mb-8"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.img
                  src="/daira-logo1.png"
                  alt="Game Logo"
                  className="w-8 h-8 "
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />
                <motion.h1
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-black"
                >
                  Daira Edtech
                </motion.h1>
              </motion.div>
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-blue-800 mb-6"
              >
                {t('enhanceExperience')}
              </motion.h1>
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-lg mb-8"
              >
                {t('fullScreenRecommendation')}
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59,130,246,0.5)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={enterFullScreen}
                className="px-8 py-4 bg-blue-600 text-white text-xl rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
              >
                {t('enterFullscreen')}
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // After entering fullscreen, show the game interface
  return (
    <div className="fullscreen-override">
      <div className="fullscreen-content">
        <AnimatePresence mode="wait">
          {showStartScreen && (
            <motion.div
              key="start-screen"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ 
                opacity: 0,
                transition: { duration: 1 }
              }}
              className="absolute inset-0"
            >
              <video
                autoPlay
                muted
                loop
                className="w-full h-full object-cover absolute inset-0"
                style={{ objectPosition: 'center' }}
                src="/videos/start.mp4"
              />
              <motion.div
                className="absolute inset-0 flex items-end justify-end p-8"
              >
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ 
                    scale: [0.9, 1.1, 1],
                    opacity: 1
                  }}
                  transition={{ 
                    duration: 0.5,
                    delay: 1
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    textShadow: "0 0 8px rgb(255,255,255)",
                    boxShadow: "0 0 8px rgb(59,130,246)"
                  }}
                  onClick={handleStartGame}
                  className="px-12 py-6 bg-blue-600 text-white text-3xl rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
                  disabled={startScreenExiting}
                >
                  {t('startGame')}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
          {!showStartScreen && (
            <motion.div
              key="map-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="w-full h-full"
            >
              <MapLayout
                tests={tests}
                onTestSelect={handleTestClick}
                onQuit={handleQuit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TakeTests;
