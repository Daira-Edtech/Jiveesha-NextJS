"use client"

// components/auditory-sequential/ListeningScreen.js

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useCallback, useEffect } from "react"
import { useLanguage } from "@/contexts/LanguageContext.jsx"
import { Mic, MicOff, Loader2, CheckCircle, XCircle } from "lucide-react"

const ListeningScreen = ({ mode, onResponseComplete, t }) => {
  const { language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [error, setError] = useState(null)

  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const audioChunksRef = useRef([])

  const uploadAudio = useCallback(
    async (audioBlob) => {
      setIsTranscribing(true)
      setError(null)

      try {
        const formData = new FormData()
        const filename = `auditory_sequential_${Date.now()}.wav`
        const file = new File([audioBlob], filename, { type: "audio/wav" })
        formData.append("file", file)
        formData.append("language", language)

        console.log("Uploading audio for transcription...")

        const response = await fetch("/api/speech-to-text", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Transcription response:", data)

        if (!data.success) {
          throw new Error(data.error || "Transcription failed")
        }

        const transcription = data.transcription || ""
        console.log("Received transcription:", transcription)

        setTranscript(transcription)
        setIsTranscribing(false)

        // Process the response
        setTimeout(() => {
          onResponseComplete(transcription)
        }, 1000)
      } catch (error) {
        console.error("Error uploading/transcribing audio:", error)
        setError(t("errorProcessingAudio"))
        setIsTranscribing(false)
      }
    },
    [onResponseComplete, t, language],
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

    setTranscript("")
    setEvaluationResult(null)
    setError(null)

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream
        audioChunksRef.current = []

        const recorder = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        })
        mediaRecorderRef.current = recorder

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data)
          }
        }

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
          uploadAudio(audioBlob)
          audioChunksRef.current = []
        }

        recorder.onerror = (event) => {
          console.error("MediaRecorder error:", event.error)
          setError(t("errorRecording"))
          stopListening()
        }

        recorder.start()
        setIsRecording(true)
      })
      .catch((error) => {
        console.error("getUserMedia error:", error)
        setError(t("errorMicAccess"))
      })
  }, [isRecording, stopListening, uploadAudio, t])

  // Auto-start recording after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isRecording && !isTranscribing) {
        startListening()
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [startListening, isRecording, isTranscribing])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative flex flex-col items-center space-y-10 p-12 max-w-4xl mx-auto rounded-3xl backdrop-blur-xl border-2 shadow-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(120, 53, 15, 0.08) 25%, rgba(146, 64, 14, 0.12) 50%, rgba(120, 53, 15, 0.08) 75%, rgba(0, 0, 0, 0.4) 100%)",
        borderColor: "rgba(180, 83, 9, 0.3)",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent">
        <motion.div
          className="h-full bg-amber-500"
          animate={{ x: [-100, "100vw"] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          style={{ width: "100px" }}
        />
      </div>

      {/* Floating warm orbs */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-amber-500/40 rounded-full blur-sm"
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            left: `${20 + i * 20}%`,
            top: `${20 + i * 15}%`,
          }}
        />
      ))}

      <motion.h3
        className="relative text-3xl font-bold text-white text-center z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="drop-shadow-lg">{mode === "forward" ? t("repeatNumbersOrder") : t("sayNumbersReverse")}</span>
      </motion.h3>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-red-900/90 border-2 border-red-400 text-white p-4 rounded-xl shadow-lg z-10"
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

      <div className="flex flex-col items-center gap-8 w-full z-10">
        <div className="flex items-center gap-8">
          <motion.button
            onClick={stopListening}
            disabled={!isRecording}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative rounded-2xl h-20 w-20 flex items-center justify-center transition-all duration-300 shadow-lg border-2 backdrop-blur-lg overflow-hidden ${
              !isRecording
                ? "bg-black/30 cursor-not-allowed text-white/50 border-amber-500/20"
                : "bg-amber-600/40 hover:bg-amber-600/50 text-white border-amber-600/60"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Button glow effect */}
            {isRecording && (
              <motion.div
                className="absolute inset-0 bg-amber-500/20 rounded-2xl"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            )}

            {isRecording ? <MicOff size={40} /> : <Mic size={40} />}
          </motion.button>

          {isRecording && !isTranscribing && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col items-start gap-3 px-8 py-4 backdrop-blur-xl text-white rounded-xl border-2 border-amber-500/30 overflow-hidden relative"
              style={{
                background: "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(120, 53, 15, 0.1) 100%)",
              }}
            >
              {/* Pulsing background */}
              <motion.div
                className="absolute inset-0 bg-amber-500/10"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />

              <div className="flex items-center gap-3 relative z-10">
                <span className="text-xl font-bold">{t("recording")}</span>
                <div className="flex gap-1">
                  {[0, 0.3, 0.6].map((delay) => (
                    <motion.span
                      key={delay}
                      className="h-3 w-3 bg-amber-500 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2, delay }}
                    />
                  ))}
                </div>
              </div>

              <div className="text-2xl relative z-10 mt-2">Click to Stop!</div>
            </motion.div>
          )}
        </div>

        {/* Enhanced audio visualizer */}
        {isRecording && (
          <motion.div
            className="relative w-full max-w-md h-8 backdrop-blur-lg rounded-full overflow-hidden flex items-center gap-1 px-3 border border-amber-500/30"
            style={{
              background: "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(120, 53, 15, 0.08) 100%)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Animated background wave */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-amber-500/20 to-amber-600/10"
              animate={{ x: [-100, 100] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />

            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="h-4 bg-gradient-to-t from-amber-600 to-amber-400 rounded-full flex-1 origin-bottom relative z-10"
                animate={{
                  height: [4, Math.random() * 24 + 4, 4],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 0.5,
                  delay: i * 0.05,
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Enhanced transcription loading */}
      {isTranscribing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center space-y-6 relative z-10"
        >
          <motion.div className="relative w-24 h-24">
            {/* Multiple rotating rings */}
            <motion.div
              className="absolute inset-0 border-2 border-amber-500/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 border-2 border-amber-600/50 rounded-full border-t-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 border-2 border-amber-400/70 rounded-full border-r-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-amber-400" />
            </div>
          </motion.div>
          <div className="text-2xl text-white font-bold drop-shadow-lg">{t("processingYourAnswer")}</div>
        </motion.div>
      )}

      {/* Enhanced transcript display */}
      {transcript && !isTranscribing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl text-center relative z-10"
        >
          <div className="text-xl text-white/80 mb-2 drop-shadow">{t("youSaid")}:</div>
          <motion.div
            className="text-3xl font-bold text-white px-6 py-4 rounded-xl backdrop-blur-lg border border-amber-500/30 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(120, 53, 15, 0.1) 100%)",
            }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            {/* Subtle shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent"
              animate={{ x: [-200, 200] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <span className="relative z-10 drop-shadow">{transcript}</span>
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced evaluation feedback */}
      <AnimatePresence>
        {evaluationResult && (
          <motion.div
            key="evaluationFeedback"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="flex flex-col items-center space-y-6 mt-8 relative z-10"
          >
            {evaluationResult === "correct" ? (
              <>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="relative"
                >
                  <CheckCircle size={60} className="text-amber-400 drop-shadow-lg" />
                  {/* Success glow */}
                  <motion.div
                    className="absolute inset-0 bg-amber-500/30 rounded-full blur-xl"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="backdrop-blur-xl text-white px-10 py-6 rounded-2xl border-2 border-amber-500/30 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(180, 83, 9, 0.2) 0%, rgba(146, 64, 14, 0.15) 100%)",
                  }}
                >
                  <span className="text-3xl font-bold drop-shadow-lg">{t("correct")}!</span>
                </motion.div>
                <motion.div
                  className="text-4xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  🎉
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="relative"
                >
                  <XCircle size={60} className="text-amber-400 drop-shadow-lg" />
                  {/* Gentle glow for incorrect answer */}
                  <motion.div
                    className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="backdrop-blur-xl text-white px-10 py-6 rounded-2xl border-2 border-amber-500/30 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(120, 53, 15, 0.1) 100%)",
                  }}
                >
                  <span className="text-3xl font-bold drop-shadow-lg">{t("letsTryNextOne")}</span>
                </motion.div>
                <motion.div
                  className="text-4xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                >
                  💪
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ListeningScreen
