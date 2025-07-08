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
    name: 'Reading Proficiency Assessment',
    component: 'Test6Controller',
    description: 'Evaluate reading comprehension and fluency skills'
  },
  { 
    id: 2, 
    name: 'Visual Discrimination Assessment',
    component: 'VisualTestContainer',
    description: 'Test visual perception and discrimination abilities'
  },
  { 
    id: 3, 
    name: 'Sound Discrimination Assessment',
    component: 'SoundDiscriminationTestOrchestrator',
    description: 'Assess auditory discrimination and processing skills'
  },
  { 
    id: 4, 
    name: 'Picture Recognition Assessment',
    component: 'PictureRecognitionTestPage',
    description: 'Evaluate visual recognition and identification skills'
  },
  { 
    id: 5, 
    name: 'Grapheme-Phoneme Correspondence',
    component: 'GraphemePhonemeCorrespondencePage',
    description: 'Test letter-sound relationship understanding'
  },
  { 
    id: 6, 
    name: 'Sequence Arrangement Assessment',
    component: 'Test7Page',
    description: 'Evaluate sequential processing and organization skills'
  },
  { 
    id: 7, 
    name: 'Symbol Sequence Assessment',
    component: 'SymbolSequencePage',
    description: 'Test symbol recognition and sequencing abilities'
  },
  { 
    id: 8, 
    name: 'Auditory Sequential Memory',
    component: 'AuditorySequentialPage',
    description: 'Assess auditory memory and sequential processing'
  },
  { 
    id: 9, 
    name: 'Sound Blending Assessment',
    component: 'SoundBlendingPage',
    description: 'Evaluate phonological blending and synthesis skills'
  },
  { 
    id: 10, 
    name: 'Vocabulary Scale Assessment',
    component: 'VocabularyScaleTest',
    description: 'Test vocabulary knowledge and language comprehension'
  }
];

const getTotalTests = () => TEST_SEQUENCE.length;

// Test Intro Page Component
const TestIntroPage = ({ testName, testNumber, totalTests, description, onStart, onSkip }) => {
  return (
    <div className="w-full h-full bg-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-4xl mx-auto p-8"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{testName}</h1>
          <div className="text-lg text-gray-600 mb-4">
            Assessment {testNumber} of {totalTests}
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(59,130,246,0.15)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-lg shadow-lg transition-all duration-300 mr-4"
          >
            Begin Assessment
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSkip}
            className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 text-lg font-medium rounded-lg shadow-sm transition-all duration-300"
          >
            Skip This Assessment
          </motion.button>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600">Overall Progress</span>
            <span className="text-sm font-semibold text-gray-800">{testNumber}/{totalTests}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(testNumber / totalTests) * 100}%` }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
            />
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            {Math.round((testNumber / totalTests) * 100)}% Complete
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Test Completion Page Component
const TestCompletionPage = ({ submissionStatus, submissionError, onRetry }) => {
  const router = useRouter();

  const handleGoToAnalytics = () => {
    router.push('/analytics');
  };

  if (submissionStatus === 'submitting') {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-4xl mx-auto p-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Submitting results...</h1>
          <p className="text-lg text-gray-600">Please wait while we save your progress.</p>
        </motion.div>
      </div>
    );
  }

  if (submissionStatus === 'error') {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-4xl mx-auto p-8"
        >
          <h1 className="text-4xl font-bold text-red-600 mb-4">Submission Failed</h1>
          <p className="text-lg text-gray-600 mb-4">We couldn't save your results. Please try again.</p>
          {submissionError && <p className="text-md text-gray-500 mb-6">Error: {submissionError}</p>}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-lg shadow-lg transition-all duration-300"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white flex items-center justify-center" style={{ marginTop: '80px', height: 'calc(100vh - 80px)' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-4xl mx-auto p-8"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>

        {/* Completion Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Assessment Complete
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Congratulations! You have successfully completed all 10 assessments.
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Your responses have been recorded and analyzed. You can now view your comprehensive performance report.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <motion.button
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 8px 25px rgba(34,197,94,0.15)" 
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoToAnalytics}
            className="px-12 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-semibold rounded-lg shadow-lg transition-all duration-300"
          >
            View Performance Report
          </motion.button>
        </motion.div>

        {/* Completion Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600">Assessments Completed</span>
            <span className="text-sm font-semibold text-gray-800">10/10</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
            />
          </div>
          
          <div className="flex items-center justify-center mt-3">
            <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-600">100% Complete</span>
          </div>
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
  const [testResults, setTestResults] = useState([]);
  const [childId, setChildId] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // idle, submitting, success, error
  const [submissionError, setSubmissionError] = useState(null);


  useEffect(() => {
    const storedChildId = localStorage.getItem("childId");
    if (storedChildId) {
      setChildId(storedChildId);
    }
  }, []);

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
    const result = {
      testId: currentTest.id,
      testName: currentTest.name,
      status: 'skipped',
      data: null,
    };
    setTestResults(prevResults => [...prevResults, result]);
    moveToNextTest();
  };

  const handleTestComplete = async (data) => {
    let resultData = data;
    let status = "completed";

    // Special handling for reading proficiency test, which needs backend scoring
    if (data && data.testType === "reading-proficiency") {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("/api/reading-test/submitResult", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            childId: childId,
            spokenWords: data.transcript,
            language: data.language,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to get score for reading test"
          );
        }

        const readingScoreData = await response.json();
        // Combine original data (transcript, lang) with new data (score, etc.)
        resultData = { ...data, ...readingScoreData };
      } catch (error) {
        console.error("Error processing reading proficiency result:", error);
        status = "error";
        resultData = { ...data, error: error.message };
      }
    }

    const result = {
      testId: currentTest.id,
      testName: currentTest.name,
      status: status,
      data: resultData,
    };
    setTestResults((prevResults) => [...prevResults, result]);
    moveToNextTest();
  };

  const moveToNextTest = () => {
    if (currentTestIndex < totalTests - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
      setShowIntro(true);
      setShowTest(false);
    } else {
      setAllTestsCompleted(true);
      setShowTest(false);
      // No longer call submit here, useEffect will handle it
    }
  };

  // Use useEffect to submit results when all tests are completed
  useEffect(() => {
    if (allTestsCompleted) {
      submitCombinedResults();
    }
  }, [allTestsCompleted, testResults]); // Depend on testResults to ensure it's updated

  const submitCombinedResults = async () => {
    if (!childId) {
      console.error("Child ID not found. Cannot submit results.");
      setSubmissionError("Child ID not found. Cannot submit results.");
      setSubmissionStatus("error");
      return;
    }

    setSubmissionStatus("submitting");
    setSubmissionError(null);

    // Create a deep copy to avoid modifying the state directly
    const processedResults = JSON.parse(JSON.stringify(testResults));

    // Calculate total score from all test results
    const totalScore = processedResults.reduce((acc, result) => {
      const score =
        result.status === "completed" &&
        result.data &&
        typeof result.data.score === "number"
          ? result.data.score
          : 0;
      return acc + score;
    }, 0);

    const payload = {
      childId: childId,
      score: totalScore,
      options: processedResults, // Send the processed results array
    };

    try {
      console.log("Submitting combined results:", payload);
      const response = await fetch('/api/continuous-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit results');
      }

      const responseData = await response.json();
      console.log('Submission successful', responseData);
      setSubmissionStatus('success');
    } catch (error) {
      console.error('Error submitting combined results:', error);
      setSubmissionError(error.message);
      setSubmissionStatus('error');
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
      <div className="fixed inset-0 bg-white">
        {/* Fixed Header - Professional Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-gray-200 shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-800">Continuous Assessment</h1>
                <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  Completed: {totalTests}/{totalTests}
                </div>
              </div>
              
              {/* Quit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleQuit}
                className="px-4 py-2 cursor-pointer bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-sm transition-all duration-300 text-sm font-medium"
              >
                Exit to Analytics
              </motion.button>
            </div>
          </div>
        </motion.div>

        <TestCompletionPage 
          submissionStatus={submissionStatus}
          submissionError={submissionError}
          onRetry={submitCombinedResults}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white">
      {/* Fixed Header - Professional Style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">Continuous Assessment</h1>
              <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                Assessment {currentTestIndex + 1} of {totalTests}
              </div>
            </div>
            
            {/* Progress Bar and Quit Button */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 font-medium">Progress:</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentTestIndex + 1) / totalTests) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {Math.round(((currentTestIndex + 1) / totalTests) * 100)}%
                </span>
              </div>
              
              {/* Quit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleQuit}
                className="px-4 py-2 cursor-pointer bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-sm transition-all duration-300 text-sm font-medium"
              >
                Exit to Analytics
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skip Test Button - Professional Style */}
      {showTest && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSkipTest}
          className="fixed bottom-6 right-6 z-[9998] px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-lg transition-all duration-300 font-medium"
        >
          Skip Assessment →
        </motion.button>
      )}

      {/* Main Content */}
      <div className="w-full" style={{ marginTop: '80px', height: 'calc(100vh - 80px)' }}>
        {showIntro && (
          <TestIntroPage
            testName={currentTest.name}
            testNumber={currentTestIndex + 1}
            totalTests={totalTests}
            description={currentTest.description}
            onStart={handleStartTest}
            onSkip={handleSkipTest}
          />
        )}

        {showTest && CurrentTestComponent && (
          <div className="w-full h-full">
            <CurrentTestComponent 
              onTestComplete={handleTestComplete} 
              isContinuous={true} 
              studentId={childId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
