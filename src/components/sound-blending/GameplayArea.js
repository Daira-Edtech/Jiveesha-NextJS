"use client"

// components/sound-blending/GameplayArea.js

import { motion } from "framer-motion"
import { useState, useRef, useCallback, useEffect } from "react"
import { Volume2, Mic, MicOff, Check, SkipForward, Loader2, X } from "lucide-react"

const GameplayArea = ({
  currentWord,
  wordIndex,
  totalWords,
  onWordComplete,
  onSkipWord,
  t,
  isPracticeMode = false,
}) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false)
  const [showResponseArea, setShowResponseArea] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionStatus, setTranscriptionStatus] = useState("idle")
  const [error, setError] = useState(null)

  const audioRef = useRef(null)
  const inputRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)

  const playSound = (src) => {
    return new Promise((resolve, reject) => {
      if (!src) {
        console.warn("Empty sound source provided, skipping.")
        resolve()
        return
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
      const audio = new Audio(src)
      audioRef.current = audio
      audio
        .play()
        .then(() => {
          audio.onended = resolve
        })
        .catch((e) => {
          console.error("Audio playback failed:", src, e)
          setError(t("errorPlayingSound"))
          resolve()
        })
    })
  }

  const playCurrentWordSounds = async () => {
    if (isPlayingSound) return
    try {
      setIsPlayingSound(true)
      setError(null)
      setShowResponseArea(false)

      for (const sound of currentWord.sounds) {
        await playSound(sound)
        if (sound) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }

      setIsPlayingSound(false)
      setShowResponseArea(true)
    } catch (err) {
      console.error("Error in playCurrentWordSounds:", err)
      setError(t("errorPlayingSounds"))
      setIsPlayingSound(false)
      setShowResponseArea(true)
    }
  }

  const uploadAudio = useCallback(
    async (audioBlob) => {
      if (!audioBlob || audioBlob.size === 0) {
        console.log("No audio data to upload.")
        setTranscriptionStatus("error")
        setIsTranscribing(false)
        return
      }

      const formData = new FormData()
      const filename = `sound_blending_word_${wordIndex}_${Date.now()}.wav`
      const file = new File([audioBlob], filename, { type: "audio/wav" })
      formData.append("file", file)
      formData.append("language", "en")

      setTranscriptionStatus("pending")
      setIsTranscribing(true)

      try {
        // Mock transcription for demo - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const mockTranscription = "cat" // Replace with actual API response

        setUserInput((prevInput) => {
          if (prevInput.trim() === "") {
            return mockTranscription
          } else {
            return prevInput
          }
        })
        setTranscriptionStatus("done")
      } catch (error) {
        console.error("Error uploading/transcribing audio:", error)
        setError(t("errorProcessingAudio"))
        setTranscriptionStatus("error")
      } finally {
        setIsTranscribing(false)
      }
    },
    [wordIndex, t],
  )

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    mediaRecorderRef.current = null
    setIsRecording(false)
  }, [])

  const startListening = useCallback(() => {
    if (isRecording) return
    setError(null)
    setUserInput("")
    setTranscriptionStatus("recording")
    setIsRecording(true)

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream
        audioChunksRef.current = []

        try {
          const recorder = new MediaRecorder(stream)
          mediaRecorderRef.current = recorder

          recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) audioChunksRef.current.push(event.data)
          }
          recorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
            uploadAudio(audioBlob)
            audioChunksRef.current = []
          }
          recorder.onerror = (event) => {
            console.error("MediaRecorder error:", event.error)
            setError(t("errorRecording"))
            setTranscriptionStatus("error")
            stopListening()
          }

          recorder.start()
        } catch (error) {
          console.error("Error creating/starting MediaRecorder:", error)
          setError(t("errorStartRecording"))
          setTranscriptionStatus("error")
          stopListening()
        }
      })
      .catch((error) => {
        console.error("getUserMedia error:", error)
        setError(t("errorMicAccess"))
        setTranscriptionStatus("error")
        setIsRecording(false)
      })
  }, [isRecording, stopListening, uploadAudio, t])

  const handleInputChange = (e) => {
    const typedValue = e.target.value
    setUserInput(typedValue)

    if (isRecording) {
      stopListening()
    }

    setTranscriptionStatus((prev) => {
      if (prev !== "recording" && prev !== "pending") {
        return typedValue ? "typed" : "idle"
      }
      return prev
    })
  }

  const handleSubmitResponse = () => {
    if (!userInput.trim()) {
      setError(t("errorNoInputSubmit"))
      return
    }
    onWordComplete(userInput.toLowerCase().trim())
  }

  const handleSkipWord = () => {
    onSkipWord()
  }

  const renderTranscriptionStatus = () => {
    switch (transcriptionStatus) {
      case "recording":
        return (
          <div className="flex items-center justify-center gap-2 text-red-400 h-6">
            <Mic className="h-4 w-4 animate-pulse" /> {t("statusRecording")}
          </div>
        )
      case "pending":
        return (
          <div className="flex items-center justify-center gap-2 text-blue-400 h-6">
            <Loader2 className="h-4 w-4 animate-spin" /> {t("statusTranscribing")}
          </div>
        )
      case "done":
        return (
          <div className="flex items-center justify-center gap-2 text-green-400 h-6">
            <Check className="h-4 w-4" /> {t("statusDone")}
          </div>
        )
      case "error":
        return (
          <div className="flex items-center justify-center gap-2 text-red-400 h-6">
            <X className="h-4 w-4" /> {t("statusError")}
          </div>
        )
      case "typed":
        return <div className="flex items-center justify-center gap-2 text-white h-6 text-sm">{t("statusTyped")}</div>
      case "idle":
      default:
        return <div className="h-6 text-white text-lg text-center">{t("statusIdle")}</div>
    }
  }

  // Reset state when word changes
  useEffect(() => {
    setUserInput("")
    setTranscriptionStatus("idle")
    setError(null)
    setIsRecording(false)
    setIsTranscribing(false)
    setShowResponseArea(false)
    stopListening()
  }, [wordIndex, stopListening])

  // Focus input when response area shows
  useEffect(() => {
    if (showResponseArea && !isRecording && !isTranscribing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showResponseArea, isRecording, isTranscribing])

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-cyan-600/80 to-blue-500/30 rounded-3xl shadow-2xl p-8 space-y-8 backdrop-blur-md border-2 border-white/40 relative overflow-hidden">
      {/* Progress Bar */}
      <div className="space-y-3 relative z-10">
        <div className="relative h-5 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full relative"
            style={{ width: `${((wordIndex + 1) / totalWords) * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${((wordIndex + 1) / totalWords) * 100}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <div className="flex justify-between text-lg font-medium text-white">
          <span>{t("progressStart")}</span>
          <span className="text-white font-bold">
            {isPracticeMode ? t("practice") : `${t("word")} ${wordIndex + 1} / ${totalWords}`}
          </span>
          <span>{t("progressFinish")}</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-4 relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative inline-block"
        >
          <motion.h2 className="text-4xl font-bold text-white/90" whileHover={{ scale: 1.05 }}>
            {isPracticeMode ? t("practiceRound") : t("soundBlendingTitle")}
          </motion.h2>
          <motion.div
            animate={{ x: [0, 15, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
            className="absolute -right-12 -top-6 text-5xl"
          >
            🐬
          </motion.div>
        </motion.div>
        <motion.p
          className="text-white font-semibold text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {showResponseArea ? t("promptEnterOrSay") : t("promptListen")}
        </motion.p>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-red-900/90 border-2 border-red-400 text-white p-4 rounded-xl shadow-lg"
        >
          <div className="flex items-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              className="mr-3 text-2xl"
            >
              ⚠️
            </motion.div>
            <p className="text-lg">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Central Interactive Element */}
      <motion.div className="flex justify-center my-8 relative z-10" whileHover={{ scale: 1.05 }}>
        <div className="relative">
          <motion.div
            animate={{
              scale: isPlayingSound || isRecording ? [1, 1.1, 1] : 1,
              rotate: isPlayingSound || isRecording ? [0, 5, -5, 0] : 0,
              background: isPlayingSound
                ? "radial-gradient(circle, #06b6d4, #3b82f6)"
                : showResponseArea
                  ? isRecording
                    ? "radial-gradient(circle, #ec4899, #3b82f6)"
                    : "radial-gradient(circle, #10b981, #06b6d4)"
                  : "radial-gradient(circle, #3b82f6, #06b6d4)",
            }}
            transition={{
              duration: 1,
              repeat: isPlayingSound || isRecording ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            }}
            className="w-40 h-40 rounded-full flex items-center justify-center shadow-xl border-4 border-white/40"
          >
            {isPlayingSound ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                className="text-7xl"
              >
                🌊
              </motion.div>
            ) : showResponseArea ? (
              isRecording ? (
                <motion.div
                  animate={{ scale: [0.9, 1.1] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  className="text-7xl"
                >
                  🎤
                </motion.div>
              ) : isTranscribing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="text-7xl"
                >
                  🌀
                </motion.div>
              ) : transcriptionStatus === "done" ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-7xl">
                  ✨
                </motion.div>
              ) : (
                <div className="text-7xl">🔊</div>
              )
            ) : (
              <div className="text-7xl">🐚</div>
            )}
          </motion.div>

          {(isPlayingSound || isRecording) && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
              className="absolute inset-0 border-4 border-cyan-400 rounded-full pointer-events-none"
            />
          )}
        </div>
      </motion.div>

      {/* Play Sounds Button */}
      {!showResponseArea && (
        <div className="space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-cyan-900/80 via-blue-800/50 to-blue-700/40 rounded-xl p-5 shadow-lg border border-cyan-400/40"
          >
            <p className="text-center text-xl text-white font-semibold">{t("promptListen")}</p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={playCurrentWordSounds}
            disabled={isPlayingSound}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 text-white font-bold py-4 text-xl rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-70"
            whileHover={{ scale: isPlayingSound ? 1 : 1.02 }}
            whileTap={{ scale: isPlayingSound ? 1 : 0.98 }}
          >
            {isPlayingSound ? (
              <motion.span
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className="flex items-center justify-center gap-3"
              >
                <Volume2 className="h-6 w-6" /> {t("playingSounds")}
              </motion.span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <Volume2 className="h-6 w-6" /> {t("playSounds")}
              </span>
            )}
          </motion.button>
        </div>
      )}

      {/* Response Area */}
      {showResponseArea && (
        <div className="space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-900/20 rounded-xl p-5 shadow-lg border border-cyan-400/40"
          >
            <p className="text-center text-xl font-semibold text-white">{t("promptHeard")}</p>
          </motion.div>

          {renderTranscriptionStatus()}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder={t("inputPlaceholder")}
              className="w-full px-5 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-200/70 focus:border-transparent text-center font-semibold text-lg text-white placeholder-blue-200 shadow-lg"
              onKeyPress={(e) => {
                if (e.key === "Enter" && userInput.trim() && !isRecording && !isTranscribing) {
                  handleSubmitResponse()
                }
              }}
              disabled={isRecording || isTranscribing || isPlayingSound}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            <motion.button
              onClick={isRecording ? stopListening : startListening}
              className={`rounded-xl py-4 text-xl font-bold shadow-lg transition-all ${
                isRecording
                  ? "bg-gradient-to-r from-rose-500 to-pink-400 animate-pulse"
                  : "bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-cyan-500 hover:to-sky-600"
              } text-white`}
              disabled={isPlayingSound || isTranscribing}
              whileHover={{ scale: isRecording || isPlayingSound || isTranscribing ? 1 : 1.02 }}
              whileTap={{ scale: isRecording || isPlayingSound || isTranscribing ? 1 : 0.98 }}
            >
              {isRecording ? (
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                  className="flex items-center justify-center gap-3"
                >
                  <MicOff className="h-6 w-6" /> {t("stopRecording")}
                </motion.span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <Mic className="h-6 w-6" /> {t("record")}
                </span>
              )}
            </motion.button>

            <motion.button
              onClick={handleSubmitResponse}
              className="bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-cyan-500 hover:to-sky-600 font-bold py-4 text-xl rounded-xl shadow-lg transition-all text-white drop-shadow-lg disabled:opacity-50"
              disabled={!userInput.trim() || isRecording || isTranscribing || isPlayingSound}
              whileHover={{ scale: !userInput.trim() || isRecording || isTranscribing || isPlayingSound ? 1 : 1.02 }}
              whileTap={{ scale: !userInput.trim() || isRecording || isTranscribing || isPlayingSound ? 1 : 0.98 }}
            >
              <Check className="h-6 w-6 inline mr-2" /> {t("submit")}
            </motion.button>

            <motion.button
              onClick={handleSkipWord}
              className="col-span-2 bg-gradient-to-r from-sky-800 to-cyan-500 text-slate-900 font-bold py-4 text-xl rounded-xl shadow-lg hover:from-cyan-600 hover:to-sky-700 transition-all transform hover:scale-[1.01] disabled:opacity-50"
              disabled={isPlayingSound || isRecording || isTranscribing}
              whileHover={{ scale: isPlayingSound || isRecording || isTranscribing ? 1 : 1.01 }}
              whileTap={{ scale: isPlayingSound || isRecording || isTranscribing ? 1 : 0.99 }}
            >
              <SkipForward className="h-6 w-6 inline mr-2" /> {t("skip")}
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default GameplayArea
