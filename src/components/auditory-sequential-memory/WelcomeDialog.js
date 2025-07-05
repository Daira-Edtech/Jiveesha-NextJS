// components/auditory-sequential/WelcomeDialog.js
"use client"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { FaArrowLeft, FaCheck, FaChevronRight } from "react-icons/fa"

import InstructionsScreen from "./InstructionsScreen.js"
import PresentingScreen from "./PresentingScreen.js"
import ListeningScreen from "./ListeningScreen.js"
import FinalResultsScreen from "./FinalResultsScreen.js"
import TopBar from "./TopBar.js"

import {
  forwardSequences,
  reverseSequences,
  dialogContent,
  getDigitMap,
  practiceForwardSequence,
  practiceReverseSequence,
  DIGIT_DISPLAY_TIME,
  PAUSE_BETWEEN_DIGITS,
  MAX_ERRORS,
} from "./auditorySequentialConstants.js"

import backgroundImage from "../../../public/auditory-test/backgroundImage.png"
import { useLanguage } from "@/contexts/LanguageContext.jsx"
import characterImage from "../../../public/auditory-test/characterImage.png"

const WelcomeDialog = ({ t, speak, onEntireTestComplete, initialChildId }) => {
  const { language } = useLanguage();
  const router = useRouter()

  const [gameState, setGameState] = useState("welcome")
  const [mode, setMode] = useState("forward")
  const [sequences, setSequences] = useState(forwardSequences)
  const [sequenceIndex, setSequenceIndex] = useState(0)
  const [currentSequence, setCurrentSequence] = useState([])
  const [displayedDigit, setDisplayedDigit] = useState(null)
  const [digitIndex, setDigitIndex] = useState(0)

  const [forwardScore, setForwardScore] = useState(0)
  const [reverseScore, setReverseScore] = useState(0)
  const [forwardErrors, setForwardErrors] = useState(0)
  const [reverseErrors, setReverseErrors] = useState(0)

  const [currentDialogIndex, setCurrentDialogIndex] = useState(0)

  const [isPracticeMode, setIsPracticeMode] = useState(false)

  const timeoutRef = useRef(null)
  const presentNextDigitLogicRef = useRef()

  useEffect(() => {
    if (gameState === "welcome" && dialogContent && dialogContent.length > 0) {
      speak(dialogContent[0])
    }
  }, [gameState, speak])

  const handleNextDialog = () => {
    if (currentDialogIndex < dialogContent.length - 1) {
      speak(dialogContent[currentDialogIndex + 1])
      setCurrentDialogIndex(currentDialogIndex + 1)
    } else {
      setGameState("forwardInstructions")
    }
  }

  const parseTranscript = useCallback((transcriptInput) => {
    if (!transcriptInput || transcriptInput.trim() === "") {
      return []
    }

    let processedTranscript = transcriptInput
      .toLowerCase()
      // Handle newlines and multiple artifacts
      .replace(/\n/g, " ")
      .replace(/\r/g, " ")
      // Remove common speech recognition artifacts and prefixes (more comprehensive)
      .replace(/you\s*said\s*:?\s*/gi, "")
      .replace(/user\s*said\s*:?\s*/gi, "")
      .replace(/transcript\s*:?\s*/gi, "")
      .replace(/result\s*:?\s*/gi, "")
      .replace(/speech\s*:?\s*/gi, "")
      .replace(/recognized\s*:?\s*/gi, "")
      .replace(/output\s*:?\s*/gi, "")
      .replace(/text\s*:?\s*/gi, "")
      .replace(/listening\s*:?\s*/gi, "")
      .replace(/heard\s*:?\s*/gi, "")
      // Remove quotes and speech marks
      .replace(/["'"`''""]/g, "")
      // Remove punctuation but keep spaces
      .replace(/[.,!?:;()[\]{}]/g, " ")
      // Remove common Hindi diacritics that might confuse matching
      .replace(/[ंँः]/g, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()

    console.log("Original transcript:", transcriptInput)
    console.log("Processed transcript:", processedTranscript)

    // Replace word numbers with digits based on current language
    const currentDigitMap = getDigitMap(language);
    
    // Sort by length (longest first) to avoid partial matches
    const sortedWords = Object.keys(currentDigitMap).sort((a, b) => b.length - a.length);

    for (const word of sortedWords) {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // Use word boundaries for exact matching, but also try without for partial words
      const regexWithBoundary = new RegExp(`\\b${escapedWord}\\b`, "gi");
      const regexWithoutBoundary = new RegExp(escapedWord, "gi");
      
      if (processedTranscript.match(regexWithBoundary)) {
        processedTranscript = processedTranscript.replace(regexWithBoundary, ` ${currentDigitMap[word]} `);
      } else if (processedTranscript.match(regexWithoutBoundary)) {
        processedTranscript = processedTranscript.replace(regexWithoutBoundary, ` ${currentDigitMap[word]} `);
      }
    }

    console.log("After word replacement:", processedTranscript)

    // Special handling for concatenated Hindi/Kannada number sequences
    // Try to split common patterns like "चारनौ" to "चार नौ"
    if (language === "hi" || language === "kn") {
      // Add spaces before known number words that might be concatenated
      const numberWords = Object.keys(currentDigitMap).filter(word => word.length > 1);
      for (const word of numberWords.sort((a, b) => b.length - a.length)) {
        const regex = new RegExp(`(\\w)(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
        processedTranscript = processedTranscript.replace(regex, "$1 $2");
      }
      
      // Re-apply digit mapping after splitting
      for (const word of sortedWords) {
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regexWithBoundary = new RegExp(`\\b${escapedWord}\\b`, "gi");
        processedTranscript = processedTranscript.replace(regexWithBoundary, ` ${currentDigitMap[word]} `);
      }
    }

    // Extract digits and clean up - now supporting multi-digit mappings
    let finalResult = processedTranscript
      .split(/\s+/) // Split by spaces
      .filter(token => token.trim() !== "") // Remove empty tokens
      .map(token => {
        // Check if token is already a digit sequence (like "5 7")
        if (/^[\d\s]+$/.test(token)) {
          return token.split(/\s+/).filter(d => /^\d$/.test(d)).map(Number);
        }
        // Check if token is a single digit
        if (/^\d$/.test(token)) {
          return [Number(token)];
        }
        return [];
      })
      .flat() // Flatten the array
      .filter(num => !isNaN(num)); // Remove any NaN values

    console.log("After concatenation splitting:", processedTranscript)
    console.log("Final result:", finalResult)

    if (finalResult.length > 0) {
      console.log("Final parsed result:", finalResult);
      return finalResult;
    }

    // Fallback: try to extract just digits
    const numbersAndSpaces = processedTranscript.replace(/[^\d\s]/g, " ")
    const cleaned = numbersAndSpaces.trim().replace(/\s+/g, " ")

    console.log("Fallback cleaned numbers:", cleaned)

    if (cleaned === "") {
      console.log("No digits found")
      return []
    }

    // Try space-separated first
    const spaceSplit = cleaned.split(" ").filter((s) => s !== "" && /^\d$/.test(s))
    if (spaceSplit.length > 0) {
      const result = spaceSplit.map(Number)
      console.log("Space-separated result:", result)
      return result
    }

    // Try concatenated digits
    const concatenated = cleaned.replace(/\s+/g, "")
    if (concatenated.length > 0 && /^\d+$/.test(concatenated)) {
      const result = concatenated.split("").map(Number)
      console.log("Concatenated result:", result)
      return result
    }

    console.log("No valid digits found")
    return []
  }, [language])

  const stablePresentNextDigit = useCallback((sequence, index) => {
    if (presentNextDigitLogicRef.current) {
      presentNextDigitLogicRef.current(sequence, index)
    }
  }, [])

  // Present next digit logic
  useEffect(() => {
    presentNextDigitLogicRef.current = (sequence, index) => {
      if (index >= sequence.length) {
        setDisplayedDigit(null)
        timeoutRef.current = setTimeout(() => {
          setGameState("listening")
        }, 500)
        return
      }

      const digit = sequence[index]
      setDisplayedDigit(digit)
      setDigitIndex(index)
      speak(String(digit), 1, 1.2)

      timeoutRef.current = setTimeout(() => {
        setDisplayedDigit(null)
        timeoutRef.current = setTimeout(() => {
          if (presentNextDigitLogicRef.current) {
            presentNextDigitLogicRef.current(sequence, index + 1)
          }
        }, PAUSE_BETWEEN_DIGITS)
      }, DIGIT_DISPLAY_TIME)
    }
  }, [speak])

  const startForward = () => {
    setMode("forward")
    setIsPracticeMode(true)
    setSequences([practiceForwardSequence]) // Start with practice
    setSequenceIndex(0)
    setGameState("presenting")
  }

  const startReverse = () => {
    setMode("reverse")
    setIsPracticeMode(true)
    setSequences([practiceReverseSequence]) // Start with practice
    setSequenceIndex(0)
    setGameState("presenting")
  }

  const moveToNextSequence = useCallback(() => {
    console.log("moveToNextSequence called - sequenceIndex:", sequenceIndex, "sequences.length:", sequences.length, "isPracticeMode:", isPracticeMode, "mode:", mode)
    
    if (sequenceIndex + 1 < sequences.length) {
      setSequenceIndex((prev) => prev + 1)
      setGameState("presenting")
    } else {
      // Check if we just completed practice
      if (isPracticeMode) {
        console.log("Transitioning from practice to real test for mode:", mode)
        setIsPracticeMode(false)
        if (mode === "forward") {
          // Move to real forward test
          setSequences(forwardSequences)
          setSequenceIndex(0)
          setGameState("presenting")
        } else {
          // Move to real reverse test
          setSequences(reverseSequences)
          setSequenceIndex(0)
          setGameState("presenting")
        }
      } else {
        // Real test completed
        console.log("Real test completed for mode:", mode)
        if (mode === "forward") {
          setGameState("reverseInstructions")
        } else {
          // Show results screen instead of immediately completing
          setGameState("results")
        }
      }
    }
  }, [sequenceIndex, sequences.length, mode, isPracticeMode])

  const handleResponseComplete = useCallback(
    (transcript) => {
      console.log("Response received:", transcript)
      const userAnswer = parseTranscript(transcript)
      const correctAnswer = mode === "forward" ? currentSequence : [...currentSequence].reverse()

      console.log("User answer:", userAnswer)
      console.log("Correct answer:", correctAnswer)
      console.log("Current sequence being tested:", currentSequence)
      console.log("Mode:", mode, "Practice mode:", isPracticeMode)

      // More flexible matching - check if user answer matches the expected sequence
      // Allow for partial matches if the beginning matches perfectly
      let isCorrect = false;
      
      if (userAnswer.length === correctAnswer.length) {
        // Perfect length match
        isCorrect = userAnswer.every((digit, i) => digit === correctAnswer[i]);
      } else if (userAnswer.length > correctAnswer.length) {
        // User said more digits - check if the first part matches
        const userPrefix = userAnswer.slice(0, correctAnswer.length);
        isCorrect = userPrefix.every((digit, i) => digit === correctAnswer[i]);
        console.log("User said more digits, checking prefix:", userPrefix);
      } else if (userAnswer.length > 0 && userAnswer.length < correctAnswer.length) {
        // User said fewer digits - check if what they said matches the beginning
        isCorrect = userAnswer.every((digit, i) => digit === correctAnswer[i]);
        console.log("User said fewer digits, checking partial match");
      }

      console.log("Is correct:", isCorrect)

      if (isCorrect) {
        if (isPracticeMode) {
          speak(t("practice_correct_message"), 0.9, 1.3)
          // Move to next sequence after a delay
          setTimeout(() => {
            moveToNextSequence()
          }, 2000)
        } else {
          speak(t("correct"), 0.9, 1.3)
          // Only increment score in real test mode
          if (mode === "forward") {
            setForwardScore((prev) => {
              const newScore = prev + 1;
              console.log("Incrementing forward score from", prev, "to", newScore)
              return newScore
            })
          } else {
            setReverseScore((prev) => {
              const newScore = prev + 1;
              console.log("Incrementing reverse score from", prev, "to", newScore)
              return newScore
            })
          }
          // Move to next sequence after a delay
          setTimeout(() => {
            moveToNextSequence()
          }, 2000)
        }
      } else {
        if (isPracticeMode) {
          speak(t("practice_incorrect_message"), 0.9, 1.0)
        } else {
          speak(t("lets_try_next_one"), 0.9, 1.0)
          let newErrorCount = 0;
          if (mode === "forward") {
            setForwardErrors((prev) => {
              newErrorCount = prev + 1;
              console.log("Incrementing forward errors from", prev, "to", newErrorCount)
              return newErrorCount
            })
          } else {
            setReverseErrors((prev) => {
              newErrorCount = prev + 1;
              console.log("Incrementing reverse errors from", prev, "to", newErrorCount)
              return newErrorCount
            })
          }

          // Check if max errors reached and handle appropriately
          setTimeout(() => {
            console.log("Current errors:", newErrorCount, "Max errors:", MAX_ERRORS)
            if (newErrorCount >= MAX_ERRORS) {
              if (mode === "forward") {
                console.log("Max errors reached in forward mode, moving to reverse")
                setGameState("reverseInstructions")
              } else {
                console.log("Max errors reached in reverse mode, showing results")
                setGameState("results")
              }
            } else {
              // Move to next sequence if we haven't hit max errors
              moveToNextSequence()
            }
          }, 2000)
        }
      }
    },
    [
      parseTranscript,
      mode,
      currentSequence,
      isPracticeMode,
      moveToNextSequence,
      speak,
      t,
    ],
  )

  const handleSkipTest = () => {
    if (onEntireTestComplete) {
      onEntireTestComplete({
        final: 0,
        forward: 0,
        reverse: 0,
      })
    }
  }

  const handleShowInfo = () => {
    console.log("Show info dialog")
  }

  // Start presenting when gameState changes to presenting
  useEffect(() => {
    if (gameState === "presenting" && sequenceIndex < sequences.length) {
      setCurrentSequence(sequences[sequenceIndex])
      setDigitIndex(0)
      timeoutRef.current = setTimeout(() => stablePresentNextDigit(sequences[sequenceIndex], 0), 500)
    }
    return () => clearTimeout(timeoutRef.current)
  }, [gameState, sequenceIndex, sequences, stablePresentNextDigit])

  // Cleanup
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const renderContent = () => {
    switch (gameState) {
      case "welcome":
        return (
          <>
            <div className="fixed inset-0 z-40">
              <div className="absolute inset-0" style={{ filter: "blur(8px) brightness(0.7)" }} />
              <motion.div
                className="absolute inset-0 bg-black/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Back to Map Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => router.push("/take-tests?skipStart=true")}
              className="fixed top-4 left-4 z-[70] flex items-center gap-2.5 bg-gradient-to-r from-white/90 to-amber-100/90 hover:from-white hover:to-amber-50 text-amber-900 font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all backdrop-blur-sm border border-white/50"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft className="text-amber-700" />
              {t("back_to_map")}
            </motion.button>

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative max-w-7xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-12"
              >
                <motion.div
                  initial={{ y: -40, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: [1, 1.03, 1],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    y: { duration: 0.6, ease: "backOut" },
                    opacity: { duration: 0.8 },
                    scale: {
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    },
                    rotate: {
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                  }}
                  className="flex-shrink-0 order-2 lg:order-1"
                >
                  <Image
                    src={characterImage || "/placeholder.svg"}
                    alt={t("alt_svarini_guardian")}
                    width={384}
                    height={448}
                    className="h-64 sm:h-80 lg:h-96 xl:h-112 object-contain"
                  />
                </motion.div>

                <motion.div
                  className="bg-gradient-to-br from-black/20 via-black/40 to-black/60 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border-2 border-amber-400/20 shadow-2xl flex-1 relative overflow-hidden w-full max-w-none lg:max-w-4xl order-1 lg:order-2"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600"></div>

                  <motion.div
                    key={currentDialogIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white mb-8 lg:mb-12 min-h-48 sm:min-h-56 lg:min-h-64 xl:min-h-72 flex items-center justify-center font-serif font-medium leading-relaxed text-center px-4"
                  >
                    <span className="drop-shadow-lg">{dialogContent[currentDialogIndex]}</span>
                  </motion.div>

                  <div className="flex justify-center gap-3 mb-8 lg:mb-10">
                    {dialogContent.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                          index <= currentDialogIndex
                            ? "bg-gradient-to-r from-white to-amber-200 shadow-lg"
                            : "bg-white/30"
                        }`}
                        initial={{ scale: 0.8 }}
                        animate={{
                          scale: index === currentDialogIndex ? 1.3 : 1,
                          y: index === currentDialogIndex ? -4 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextDialog}
                      className={`flex items-center justify-center gap-3 py-4 px-8 lg:px-12 rounded-xl font-bold text-lg lg:text-xl shadow-2xl transition-all duration-300 ${
                        currentDialogIndex < dialogContent.length - 1
                          ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 hover:from-amber-300 hover:to-yellow-400"
                          : "bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-700"
                      }`}
                    >
                      {currentDialogIndex < dialogContent.length - 1 ? (
                        <>
                          <span className="drop-shadow-sm">{t("continue")}</span>
                          <span className="text-xl">⏳</span>
                        </>
                      ) : (
                        <>
                          <span className="drop-shadow-sm">{t("im_ready")}</span>
                          <span className="text-xl">🎶</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </>
        )

      case "forwardInstructions":
        return (
          <motion.div key="forwardInstructions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InstructionsScreen stage="forward" onStartForward={startForward} t={t} />
          </motion.div>
        )

      case "reverseInstructions":
        return (
          <motion.div key="reverseInstructions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InstructionsScreen stage="reverse" onStartReverse={startReverse} t={t} />
          </motion.div>
        )

      case "presenting":
        return (
          <motion.div
            key={`presenting-${sequenceIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <TopBar
              currentSequence={sequenceIndex + 1}
              totalSequences={sequences.length}
              score={mode === "forward" ? forwardScore : reverseScore}
              mode={mode}
              onShowInfo={handleShowInfo}
              onSkipTest={handleSkipTest}
              t={t}
            />
            {/* Debug info - remove this in production */}
            <div className="fixed top-20 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
              <div>Forward Score: {forwardScore}</div>
              <div>Reverse Score: {reverseScore}</div>
              <div>Forward Errors: {forwardErrors}</div>
              <div>Reverse Errors: {reverseErrors}</div>
              <div>Mode: {mode}</div>
              <div>Practice: {isPracticeMode ? 'Yes' : 'No'}</div>
              <div>Seq Index: {sequenceIndex}</div>
            </div>
            <div className="flex flex-col items-center justify-center min-h-screen relative px-2 sm:px-4 py-10 pt-20">
              <PresentingScreen displayedDigit={displayedDigit} digitIndex={digitIndex} t={t} />
            </div>
          </motion.div>
        )

      case "listening":
        return (
          <motion.div
            key={`listening-${sequenceIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <TopBar
              currentSequence={sequenceIndex + 1}
              totalSequences={sequences.length}
              score={mode === "forward" ? forwardScore : reverseScore}
              mode={mode}
              onShowInfo={handleShowInfo}
              onSkipTest={handleSkipTest}
              t={t}
            />
            {/* Debug info - remove this in production */}
            {/* <div className="fixed top-20 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
              <div>Forward Score: {forwardScore}</div>
              <div>Reverse Score: {reverseScore}</div>
              <div>Forward Errors: {forwardErrors}</div>
              <div>Reverse Errors: {reverseErrors}</div>
              <div>Mode: {mode}</div>
              <div>Practice: {isPracticeMode ? 'Yes' : 'No'}</div>
              <div>Seq Index: {sequenceIndex}</div>
            </div> */}
            <div className="flex flex-col items-center justify-center min-h-screen relative px-2 sm:px-4 py-10 pt-20">
              <ListeningScreen mode={mode} onResponseComplete={handleResponseComplete} t={t} />
            </div>
          </motion.div>
        )

      case "results":
        return (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <FinalResultsScreen
              score={{
                forward: forwardScore,
                reverse: reverseScore,
                forwardTotal: forwardSequences.length,
                reverseTotal: reverseSequences.length,
              }}
              onFinishTest={() => {
                const finalScore = Math.round((forwardScore + reverseScore) / 2)
                if (onEntireTestComplete) {
                  onEntireTestComplete({
                    final: finalScore,
                    forward: forwardScore,
                    reverse: reverseScore,
                    forwardTotal: forwardSequences.length,
                    reverseTotal: reverseSequences.length,
                  })
                }
              }}
              onViewRewards={() => {
                // Can add reward viewing logic here if needed
                const finalScore = Math.round((forwardScore + reverseScore) / 2)
                if (onEntireTestComplete) {
                  onEntireTestComplete({
                    final: finalScore,
                    forward: forwardScore,
                    reverse: reverseScore,
                    forwardTotal: forwardSequences.length,
                    reverseTotal: reverseSequences.length,
                  })
                }
              }}
              t={t}
            />
          </motion.div>
        )

      default:
        return <div className="text-white p-10">{t("error_unknown_game_state", {gameState})}</div>
    }
  }

  return (
    <div
      className="fixed inset-0 overflow-y-auto bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
    </div>
  )
}

export default WelcomeDialog