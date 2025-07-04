// app/dummy/page.js
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Test6Controller from "../../components/tests/reading-proficiency/index";
import VisualTestContainer from '../../components/tests/visual-discrimination/VisualTestContainer';
import SoundDiscriminationTestOrchestrator from '../../components/tests/sound-discrimination/SoundDiscriminationTestOrchestrator';

import PictureRecognitionTestPage from '../(tests)/picture-recognition/page.js';
import GraphemePhonemeCorrespondencePage from '../(tests)/grapheme-phoneme-correspondence/page.js';
import Test7Page from '../(tests)/sequence-arrangement/page.js';
import SymbolSequencePage from '../(tests)/symbol-sequence/page.js';
import AuditorySequentialPage from '../(tests)/auditory-sequential-memory/page.js';
import SoundBlendingPage from '../(tests)/sound-blending/page.js';
import VocabularyScaleTest from '../(tests)/vocabulary-scale/page.js';

// Test Sequence Configuration
const TEST_SEQUENCE = [
  { 
    id: 1, 
    name: 'Reading Proficiency Test',
    component: 'Test6Controller'
  },
  { 
    id: 2, 
    name: 'Visual Discrimination Test',
    component: 'VisualTestContainer'
  },
  { 
    id: 3, 
    name: 'Sound Discrimination Test',
    component: 'SoundDiscriminationTestOrchestrator'
  },
  { 
    id: 4, 
    name: 'Picture Recognition Test',
    component: 'PictureRecognitionTestPage'
  },
  { 
    id: 5, 
    name: 'Grapheme Phoneme Correspondence Test',
    component: 'GraphemePhonemeCorrespondencePage'
  },
  { 
    id: 6, 
    name: 'Test 7',
    component: 'Test7Page'
  },
  { 
    id: 7, 
    name: 'Symbol Sequence Test',
    component: 'SymbolSequencePage'
  },
  { 
    id: 8, 
    name: 'Auditory Sequential Test',
    component: 'AuditorySequentialPage'
  },
  { 
    id: 9, 
    name: 'Sound Blending Test',
    component: 'SoundBlendingPage'
  },
  { 
    id: 10, 
    name: 'Vocabulary Scale Test',
    component: 'VocabularyScaleTest'
  }
];

const getTotalTests = () => TEST_SEQUENCE.length;

// Test Intro Page Component
const TestIntroPage = ({ testName, testNumber, totalTests, onStart, onSkip }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center z-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center text-white max-w-2xl mx-auto p-8"
      >
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-5xl font-bold mb-4">{testName}</h1>
          <div className="text-xl text-blue-200">
            Test {testNumber} of {totalTests}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59,130,246,0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-full shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 mr-4"
          >
            Start Test
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSkip}
            className="px-8 py-3 bg-gray-600 text-white text-lg rounded-full shadow-lg hover:bg-gray-500 transition-all duration-300"
          >
            Skip This Test
          </motion.button>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8"
        >
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(testNumber / totalTests) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-300 mt-2">
            Progress: {testNumber}/{totalTests} tests
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Test Completion Page Component
const TestCompletionPage = () => {
  const router = useRouter();

  const handleGoToAnalytics = () => {
    router.push('/analytics');
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center z-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center text-white max-w-3xl mx-auto p-8"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          className="text-8xl mb-8"
        >
          🎉
        </motion.div>

        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
        >
          Congratulations!
        </motion.h1>

        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl text-green-200 mb-8"
        >
          You have successfully completed all 10 tests!
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 30px rgba(34,197,94,0.6)" 
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoToAnalytics}
            className="px-12 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white text-xl font-bold rounded-full shadow-lg hover:from-green-500 hover:to-blue-500 transition-all duration-300"
          >
            Go to Analytics - View Full Report
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 1.2, duration: 1.5 }}
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
            />
          </div>
          <p className="text-lg text-gray-300 mt-3 font-semibold">
            All Tests Completed: 10/10 ✅
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Main Component
export default function Dummy() {
  const router = useRouter();
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showTest, setShowTest] = useState(false);
  const [allTestsCompleted, setAllTestsCompleted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const totalTests = getTotalTests();
  const currentTest = TEST_SEQUENCE[currentTestIndex];

  // Component mapping
  const testComponents = {
    'Test6Controller': Test6Controller,
    'VisualTestContainer': VisualTestContainer,
    'SoundDiscriminationTestOrchestrator': SoundDiscriminationTestOrchestrator,
    'PictureRecognitionTestPage': PictureRecognitionTestPage,
    'GraphemePhonemeCorrespondencePage': GraphemePhonemeCorrespondencePage,
    'Test7Page': Test7Page,
    'SymbolSequencePage': SymbolSequencePage,
    'AuditorySequentialPage': AuditorySequentialPage,
    'SoundBlendingPage': SoundBlendingPage,
    'VocabularyScaleTest': VocabularyScaleTest
  };

  // Enter fullscreen on component mount
  useEffect(() => {
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
      } catch (err) {
        console.error('Error entering fullscreen:', err);
        setIsFullScreen(true); // Continue even if fullscreen fails
      }
    };

    enterFullScreen();

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleStartTest = () => {
    setShowIntro(false);
    setShowTest(true);
  };

  const handleSkipTest = () => {
    moveToNextTest();
  };

  const handleTestComplete = () => {
    moveToNextTest();
  };

  const moveToNextTest = () => {
    if (currentTestIndex < totalTests - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
      setShowIntro(true);
      setShowTest(false);
    } else {
      setAllTestsCompleted(true);
    }
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
    router.push('/analytics');
  };

  const CurrentTestComponent = testComponents[currentTest?.component];

  if (allTestsCompleted) {
    return (
      <div className="fixed inset-0 bg-black">
        {/* Fixed Header - Always on top */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold">Continuous Tests</h1>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  Completed: {totalTests}/{totalTests}
                </div>
              </div>
              
              {/* Quit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleQuit}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-lg transition-all duration-300 text-sm font-semibold"
              >
                Quit & Go to Analytics
              </motion.button>
            </div>
          </div>
        </motion.div>

        <TestCompletionPage />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Fixed Header - Always on top */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">Continuous Tests</h1>
              <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                Test {currentTestIndex + 1} of {totalTests}
              </div>
            </div>
            
            {/* Progress Bar and Quit Button */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm">Progress:</span>
                <div className="w-32 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentTestIndex + 1) / totalTests) * 100}%` }}
                  />
                </div>
                <span className="text-sm">{Math.round(((currentTestIndex + 1) / totalTests) * 100)}%</span>
              </div>
              
              {/* Quit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleQuit}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-lg transition-all duration-300 text-sm font-semibold"
              >
                Quit & Go to Analytics
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skip Test Button - Fixed Bottom Right */}
      {showTest && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSkipTest}
          className="fixed bottom-6 right-6 z-[9998] px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-full shadow-lg transition-all duration-300 font-semibold"
        >
          Skip This Test →
        </motion.button>
      )}

      {/* Main Content */}
      <div className="fixed inset-0 pt-16">
        <AnimatePresence mode="wait">
          {showIntro && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <TestIntroPage
                testName={currentTest.name}
                testNumber={currentTestIndex + 1}
                totalTests={totalTests}
                onStart={handleStartTest}
                onSkip={handleSkipTest}
              />
            </motion.div>
          )}

          {showTest && CurrentTestComponent && (
            <motion.div
              key="test"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full relative"
            >
              <CurrentTestComponent onTestComplete={handleTestComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
