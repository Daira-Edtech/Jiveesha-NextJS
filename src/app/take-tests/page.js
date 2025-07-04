"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import MapLayout from "@/components/MapLayout";
import testsData from "@/Data/tests.json";
import "@/styles/fullscreen.css";


const TakeTestsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFullScreenDialog, setShowFullScreenDialog] = useState(true);
  const [showTestModeSelection, setShowTestModeSelection] = useState(true);
  const [showStartScreen, setShowStartScreen] = useState(false);
  const [hasDeclinedFullScreen, setHasDeclinedFullScreen] = useState(false);
  const [startScreenExiting, setStartScreenExiting] = useState(false);
  const [testModeExiting, setTestModeExiting] = useState(false);


  // Transform testsData from tests.json
  const tests = testsData.map((item) => ({
    ...item,
    id: item.id,
    testName: item.testName,
    About: item.About
  }));


  useEffect(() => {
    // Check if user is coming from a test (skip all screens)
    const skipStart = searchParams.get('skipStart');
    if (skipStart === 'true') {
      setShowTestModeSelection(false);
      setShowStartScreen(false);
      setShowFullScreenDialog(false);
      setIsFullScreen(true);
    }
  }, [searchParams]);


  useEffect(() => {
    const timer = setTimeout(() => {
    }, 100);
    return () => clearTimeout(timer);
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
      setIsFullScreen(true);
      setShowFullScreenDialog(false);
    }
  };


  const handleTestModeSelection = (mode) => {
    if (mode === 'continuous') {
      router.push('/dummy');
    } else {
      setTestModeExiting(true);
      setTimeout(() => {
        setShowTestModeSelection(false);
        setShowStartScreen(true);
        setTestModeExiting(false);
      }, 1000);
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
    router.push("/select-student");
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


  // Initial clean white screen with fullscreen option
  if (!isFullScreen) {
    return (
      <div className="fullscreen-override">
        <div className="fullscreen-content flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                className="w-12 h-12"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-gray-800"
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
              className="text-gray-600 text-lg mb-8 max-w-lg mx-auto"
            >
              {t('fullScreenRecommendation')}
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59,130,246,0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={enterFullScreen}
                className="px-8 py-4 bg-blue-600 text-white text-xl rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 font-semibold"
              >
                {t('enterFullscreen') || 'Enter Fullscreen'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsFullScreen(true);
                  setShowFullScreenDialog(false);
                }}
                className="px-8 py-4 bg-gray-200 text-gray-800 text-xl rounded-lg shadow-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
              >
                Continue without Fullscreen
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }


  // After entering fullscreen, show the game interface
  return (
    <div className="fullscreen-override">
      <div className="fullscreen-content">
        <AnimatePresence mode="wait">
          {showTestModeSelection && (
            <motion.div
              key="test-mode-selection"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ 
                opacity: 0,
                transition: { duration: 1 }
              }}
              className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto px-4"
              >
                {/* Logo and Company Name */}
                <motion.div
                  className="flex items-center justify-center gap-4 mb-8"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.img
                    src="/daira-logo1.png"
                    alt="Daira Logo"
                    className="w-10 h-10"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                  <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-semibold text-gray-700"
                  >
                    Daira Edtech
                  </motion.h2>
                </motion.div>
             
                <motion.h1
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-bold text-gray-800 mb-4"
                >
                  Assessment Configuration
                </motion.h1>
                
                <motion.p
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto"
                >
                  Please select your preferred assessment mode to proceed with the evaluation process.
                </motion.p>
                
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col lg:flex-row gap-6 justify-center items-center"
                >
                  {/* Individual Tests Button */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                      y: -2
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTestModeSelection('individual')}
                    className="group relative px-8 py-6 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-gray-300 rounded-xl shadow-lg transition-all duration-300 min-w-[280px]"
                    disabled={testModeExiting}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">Individual Assessment</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Take assessments individually with personalized pacing and detailed feedback for each test.
                      </p>
                    </div>
                  </motion.button>


                  {/* Continuous Tests Button */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                      y: -2
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTestModeSelection('continuous')}
                    className="group relative px-8 py-6 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-gray-300 rounded-xl shadow-lg transition-all duration-300 min-w-[280px]"
                    disabled={testModeExiting}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">Continuous Assessment</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Complete multiple assessments in sequence with streamlined workflow and comprehensive reporting.
                      </p>
                    </div>
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}


          {showStartScreen && (
            <motion.div
              key="start-screen"
              initial={{ opacity: 0 }}
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
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(139,92,246,0.7)",
                  }}
                  onClick={handleStartGame}
                  className="relative inline-block px-14 py-6 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white text-3xl font-extrabold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
                  disabled={startScreenExiting}
                >
                  {t('startGame')}
                </motion.button>
              </motion.div>
            </motion.div>
          )}


          {!showStartScreen && !showTestModeSelection && (
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


const TakeTests = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TakeTestsContent />
    </Suspense>
  );
};


export default TakeTests;
