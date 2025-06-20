"use client";
<<<<<<< HEAD
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { MdQuiz, MdSchool, MdSearch } from "react-icons/md";
import { useRouter } from "next/navigation";
import TakeTestCard from "@/components/take-tests/TakeTestCard";
import { useLanguage } from "@/contexts/LanguageContext";
import testsData from "@/Data/tests.json"; // Import the new test data
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/take-tests/SearchBar";
import EmptyState from "@/components/take-tests/EmptyState";

const TakeTests = () => {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Transform testsData (from tests.json array) into the tests array format
  const tests = testsData.map((item, index) => {
    // Ensure essential properties are present and correctly typed.
    // 'id' should be a number. Use original 'id' if present and valid, otherwise use index as a fallback.
    // 'testName' is the English name.
    // 'About' is the English description.
    return {
      ...item, // Start with all properties from the JSON item
      id: item.id, // Fallback for id, using 0-based index
      testName: item.testName,
      About: item.About,
    };
  });
=======
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import MapLayout from "@/components/MapLayout";
import testsData from "@/Data/tests.json";
import "@/styles/fullscreen.css";

const TakeTests = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFullScreenDialog, setShowFullScreenDialog] = useState(true);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [hasDeclinedFullScreen, setHasDeclinedFullScreen] = useState(false);
  const [startScreenExiting, setStartScreenExiting] = useState(false);
>>>>>>> 2792444 (all the best guys)

  // Transform testsData from tests.json
  const tests = testsData.map((item) => ({
    ...item,
    id: item.id,
    testName: item.testName,
    About: item.About
  }));

  useEffect(() => {
    // Check if user is coming from a test (skip start screen)
    const skipStart = searchParams.get('skipStart');
    if (skipStart === 'true') {
      setShowStartScreen(false);
      setShowFullScreenDialog(false);
      setIsFullScreen(true); // Skip fullscreen prompt when coming from tests
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

<<<<<<< HEAD
=======
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
      // If fullscreen fails, still proceed to the game
      setIsFullScreen(true);
      setShowFullScreenDialog(false);
    }
  };

  const handleStartGame = () => {
    setStartScreenExiting(true);
    setTimeout(() => {
      setShowStartScreen(false);
      setStartScreenExiting(false);
    }, 1000);
  };

>>>>>>> 2792444 (all the best guys)
  const handleTestClick = (testId) => {
    localStorage.setItem("selectedTestId", testId);
    router.push("/select-student");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // const filteredTests = tests.filter(test => {
  //   const searchLower = searchTerm.toLowerCase();
  //   // Search in both English and Tamil test names and descriptions
  //   return test.testName.toLowerCase().includes(searchLower) ||
  //     (test.About && test.About.toLowerCase().includes(searchLower)) ||
  //     (language === \'\'\'ta\'\'\' && test.testName_ta && test.testName_ta.toLowerCase().includes(searchLower)) ||
  //     (language === \'\'\'ta\'\'\' && test.About_ta && test.About_ta.toLowerCase().includes(searchLower));
  // });

  const supportedLanguages = [
    "ta",
    "hi",
    "gu",
    "pa",
    "te",
    "od",
    "ml",
    "mr",
    "kn",
    "bn",
  ];

  const filteredTests = tests.filter((test) => {
    // Guard against empty search term
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    // Always check English base fields with null/undefined checks
    let match =
      (typeof test.testName === "string" &&
        test.testName.toLowerCase().includes(searchLower)) ||
      (typeof test.About === "string" &&
        test.About.toLowerCase().includes(searchLower));

    // Check localized fields for the current language if it's supported
    if (supportedLanguages.includes(language)) {
      const testNameLocalized = test[`testName_${language}`];
      const aboutLocalized = test[`About_${language}`];

      // Add null/undefined checks before calling toLowerCase
      if (typeof testNameLocalized === "string") {
        match = match || testNameLocalized.toLowerCase().includes(searchLower);
      }

      if (typeof aboutLocalized === "string") {
        match = match || aboutLocalized.toLowerCase().includes(searchLower);
      }
    }

<<<<<<< HEAD
    return match;
  });
=======
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
>>>>>>> 2792444 (all the best guys)

  return (
<<<<<<< HEAD
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header section */}

        <div className="flex justify-end mb-6">
          <Button
            onClick={() => {
              localStorage.setItem("selectedTestId", "all");
              router.push("/select-student");
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-lg font-semibold"
            size="lg"
          >
            <MdQuiz className="w-6 h-6" />
            {t("takeAllTests")}
          </Button>
        </div>
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-blue-800 flex items-center">
                <MdQuiz className="mr-2 text-blue-600" />
                {t("tests")}
              </h1>
              <p className="text-gray-600 mt-1">{t("selectTestForStudent")}</p>
            </div>

            {/* Search bar */}
            <SearchBar
              searchTerm={searchTerm}
              onSearch={handleSearch}
              onClear={clearSearch}
            />
          </div>

          <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-300 mt-4 rounded-full" />
        </div>

        {/* Tests grid */}
        <div
          className={`transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="space-y-6">
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => (
                <div key={test.id}>
                  <TakeTestCard
                    test={test}
                    buttonLabel={t("takeTest")}
                    onClick={() => handleTestClick(test.id)}
                  />
                </div>
              ))
            ) : (
              <EmptyState searchTerm={searchTerm} />
            )}
          </div>
        </div>
=======
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
>>>>>>> 2792444 (all the best guys)
      </div>
    </div>
  );
};

TakeTests.propTypes = {
  tests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      testName: PropTypes.string.isRequired,
      testName_ta: PropTypes.string,
      About: PropTypes.string,
      About_ta: PropTypes.string,
    })
  ),
};

export default TakeTests;
