// app/(your-main-app-route)/symbol-sequence-test/page.js

'use client'; // This directive is crucial for using client-side React hooks

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

// Import sub-components from the local components folder
import WelcomeScreen from '../../../components/symbol-sequence/WelcomeScreen';
import ShowingScreen from '../../../components/symbol-sequence/ShowingScreen';
import GuessingScreen from '../../../components/symbol-sequence/GuessingScreen';
import ResultsScreen from '../../../components/symbol-sequence/ResultsScreen';
import GameOverScreen from '../../../components/symbol-sequence/GameOverScreen';
import CharacterDialog from '../../../components/symbol-sequence/CharacterDialog'; // Placeholder

// --- Static Data Definitions (You might fetch these from an API in a real app) ---
const symbols = ['\u{1F384}', '\u{1F381}', '\u{1F389}', '\u{1F385}', '\u{1F308}', '\u{1F47B}', '\u{1F33F}', '\u{1F4A5}', '\u{1F4AD}', '\u{1F4AF}']; // Example Unicode symbols

const difficultyLevels = [
  { name: 'easy', cardsToShow: 3, timeToView: 3000 },
  { name: 'medium', cardsToShow: 5, timeToView: 4000 },
  { name: 'hard', cardsToShow: 7, timeToView: 5000 },
];
// --- End Static Data ---

// Placeholder for i18n 't' function (replace with actual i18n setup if needed)
const t = (key) => {
  const translations = {
    symbolSequenceAssessment: 'Symbol Sequence Assessment',
    symbolSequenceDescription: 'Test your memory and perception by recalling sequences of mystical symbols.',
    chooseDifficulty: 'Choose Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    lookCarefully: 'Look Carefully!',
    waitUntilDisappear: 'Memorize the sequence before it disappears...',
    recreateSequence: 'Recreate the Sequence',
    yourSequence: 'YOUR SEQUENCE',
    availableSymbols: 'AVAILABLE SYMBOLS',
    remove: 'REMOVE',
    correct: 'Correct!',
    incorrect: 'Incorrect!',
    correctSequence: 'CORRECT SEQUENCE',
    gameComplete: 'Game Complete!',
    finalScore: 'Final Score',
    excellentMemory: 'Excellent Memory!',
    veryGoodJob: 'Very Good Job!',
    goodEffort: 'Good Effort!',
    keepPracticing: 'Keep Practicing!',
    savingResults: 'Saving Results...',
    playAgain: 'Play Again',
    continue: 'Continue',
  };
  return translations[key] || key;
};

// For background image, you'd typically import it like this in Next.js
// using the /public directory.
// Make sure you have an image at /public/images/fantasy-bg.jpg (or adjust the path)
const backgroundImage = '/images/fantasy-bg.jpg'; // Or import Image from 'next/image' for optimization

const SymbolSequenceGamePage = () => {
  const router = useRouter(); // Initialize Next.js router for navigation

  const [gameState, setGameState] = useState('welcome'); // welcome, showing, guessing, results, gameOver
  const [level, setLevel] = useState(0); // Index for difficultyLevels
  const [currentSequence, setCurrentSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [availableSymbols, setAvailableSymbols] = useState([]);
  const [showingIndex, setShowingIndex] = useState(-1);
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(-1);
  const [showIntro, setShowIntro] = useState(true); // Control character dialog
  const [isSubmitting, setIsSubmitting] = useState(false); // For game over screen
  const [submitError, setSubmitError] = useState(null); // For game over screen


  // Helper to shuffle an array
  const shuffleArray = useCallback((array) => {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Function to generate the sequence
  const generateSequence = useCallback(() => {
    const numCards = difficultyLevels[level].cardsToShow;
    const shuffledSymbols = shuffleArray(symbols);
    const newSequence = shuffledSymbols.slice(0, numCards);
    setCurrentSequence(newSequence);
    setUserSequence([]); // Reset user sequence for new round
  }, [level, shuffleArray]);

  // Function to get symbols for guessing phase
  const getAvailableSymbols = useCallback(() => {
    const requiredSymbols = [...currentSequence];
    const remainingSymbols = symbols.filter(
      (s) => !requiredSymbols.includes(s)
    );
    const shuffledRemaining = shuffleArray(remainingSymbols);

    const totalDesiredSymbols = Math.max(
      6,
      difficultyLevels[level].cardsToShow + Math.floor(difficultyLevels[level].cardsToShow / 2)
    );
    const additionalCount = totalDesiredSymbols - requiredSymbols.length;

    const additionalSymbols = shuffledRemaining.slice(0, additionalCount);
    const result = [...requiredSymbols, ...additionalSymbols];

    setAvailableSymbols(shuffleArray(result));
  }, [currentSequence, difficultyLevels, level, shuffleArray]);


  // Game flow functions
  const startGame = useCallback((difficultyIndex) => {
    setLevel(difficultyIndex);
    setCurrentRound(1);
    setScore(0);
    setConfetti(false); // Reset confetti
    setSubmitError(null); // Reset submit error
    setGameState('showing');
  }, []);

  useEffect(() => {
    if (gameState === 'showing') {
      generateSequence(); // Generate sequence when entering 'showing' state
    }
  }, [gameState, generateSequence]);


  useEffect(() => {
    let showTimer;
    let symbolTimer;

    if (gameState === 'showing' && currentSequence.length > 0) {
      setShowingIndex(0); // Start showing the first symbol

      symbolTimer = setInterval(() => {
        setShowingIndex(prevIndex => {
          if (prevIndex < currentSequence.length - 1) {
            return prevIndex + 1;
          } else {
            clearInterval(symbolTimer);
            return -1; // No symbol highlighted
          }
        });
      }, difficultyLevels[level].timeToView / currentSequence.length); // Divide total time by number of symbols

      showTimer = setTimeout(() => {
        clearInterval(symbolTimer); // Ensure interval is cleared
        setGameState('guessing');
        setShowingIndex(-1); // Reset showing index
        getAvailableSymbols(); // Prepare symbols for guessing
      }, difficultyLevels[level].timeToView + 500); // Add a small delay for animation to finish
    }

    return () => {
      clearTimeout(showTimer);
      clearInterval(symbolTimer);
      setShowingIndex(-1); // Clear any highlight on unmount or state change
    };
  }, [gameState, currentSequence, level, difficultyLevels, getAvailableSymbols]);


  const selectSymbol = useCallback((symbol) => {
    if (userSequence.length < currentSequence.length) {
      const newSequence = [...userSequence, symbol];
      setUserSequence(newSequence);

      if (newSequence.length === currentSequence.length) {
        // All symbols selected, check result
        const isCorrect = newSequence.every(
          (s, i) => s === currentSequence[i]
        );

        if (isCorrect) {
          setScore((prev) => prev + 1);
          setFeedback(t('correct'));
          setConfetti(true);
          setTimeout(() => setConfetti(false), 2000); // Hide confetti after 2 seconds
        } else {
          setFeedback(t('incorrect'));
        }

        setTimeout(() => {
          if (currentRound < 10) {
            setCurrentRound((prev) => prev + 1);
            setGameState('showing'); // Go to next round
          } else {
            // Game over
            setGameState('results'); // Show final comparison results
          }
        }, 2500); // Display feedback for a moment
      }
    }
  }, [userSequence, currentSequence, currentRound, t]);

  const removeSymbol = useCallback((indexToRemove) => {
    setUserSequence((prev) => prev.filter((_, i) => i !== indexToRemove));
  }, []);

  const handleGameEnd = useCallback((finalScore) => {
    // Here you would typically save the score to a database,
    // or perform other actions after game completion.
    console.log('Game completed with score:', finalScore);
    setGameState('gameOver');
  }, []);


  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {showIntro && (
        <CharacterDialog
          onComplete={() => {
            setShowIntro(false);
            setGameState('welcome');
          }}
          t={t}
        />
      )}

      {/* Back button */}
      <motion.button
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/taketests')} // Adjust this route based on your actual tests page
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-600/90 to-yellow-800/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-400/50 ml-4 mt-4"
      >
        <motion.span
          animate={{ x: [-2, 0, -2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="w-6 h-6 text-white-400 drop-shadow-lg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.span>
        <span className="font-semibold">Back to Tests</span>
      </motion.button>

      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              initial={{
                top: '0%',
                left: `${Math.random() * 100}%`,
                backgroundColor: [
                  '#1E40AF',
                  '#3B82F6',
                  '#60A5FA',
                  '#93C5FD',
                  '#BFDBFE',
                  '#DBEAFE',
                ][Math.floor(Math.random() * 6)],
              }}
              animate={{
                top: '100%',
                left: [
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`,
                  `${Math.random() * 100}%`,
                ],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center ">
        <AnimatePresence mode="wait">
          {gameState === 'welcome' && (
            <WelcomeScreen
              key="welcome-screen"
              difficultyLevels={difficultyLevels}
              symbols={symbols}
              startGame={startGame}
              t={t}
            />
          )}

          {gameState === 'showing' && (
            <ShowingScreen
              key="showing-screen"
              currentSequence={currentSequence}
              showingIndex={showingIndex}
              currentRound={currentRound}
              difficultyLevel={difficultyLevels[level]}
              t={t}
              symbols={symbols}
            />
          )}

          {gameState === 'guessing' && (
            <GuessingScreen
              key="guessing-screen"
              currentSequence={currentSequence}
              userSequence={userSequence}
              availableSymbols={availableSymbols}
              currentRound={currentRound}
              selectSymbol={selectSymbol}
              removeSymbol={removeSymbol}
              hoveredCardIndex={hoveredCardIndex}
              setHoveredCardIndex={setHoveredCardIndex}
              t={t}
            />
          )}

          {gameState === 'results' && (
            <ResultsScreen
              key="results-screen"
              feedback={feedback}
              userSequence={userSequence}
              currentSequence={currentSequence}
              currentRound={currentRound}
              onContinue={() => handleGameEnd(score)} // Pass score to handleGameEnd
              t={t}
            />
          )}

          {gameState === 'gameOver' && (
            <GameOverScreen
              key="gameover-screen"
              score={score}
              onPlayAgain={() => {
                setIsSubmitting(false); // Reset submitting state
                setSubmitError(null);   // Reset error
                setGameState('welcome');
              }}
              isSubmitting={isSubmitting}
              submitError={submitError}
              t={t}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SymbolSequenceGamePage;