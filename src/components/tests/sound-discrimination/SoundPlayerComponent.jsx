'use client';

import React, { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css"; // Ensure this is handled correctly in Next.js (e.g., global import)
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";

// PATH CHANGE: Assumes speakerbird.json is in public/sound-test/
// The import for speakerbirdAnimation is removed. We'll use the path prop for Lottie.
const speakerbirdAnimationPath = "/sound-test/speakerbird.json";

const SoundPlayerComponent = ({ pair, onTimeout }) => {
  const [isPlaying, setIsPlaying] = useState(false); // isPlaying state may not be directly used from AudioPlayer's internal state
  const [playCount, setPlayCount] = useState(0);
  const lottieRef = useRef(null);
  const timeoutRef = useRef(null);
  const [audioError, setAudioError] = useState(null);
  const [glow, setGlow] = useState(false);

  const handleClick = () => {
    const playPauseButton = document.querySelector(".rhap_play-pause-button");
    if (playPauseButton) {
      playPauseButton.click();
    }
    setGlow(true);
    setTimeout(() => setGlow(false), 300);
  };

  useEffect(() => {
    if (playCount >= 2) {
      timeoutRef.current = setTimeout(() => {
        onTimeout();
      }, 5000);
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [playCount, onTimeout]);

  const handleAudioPlay = () => {
    setIsPlaying(true);
  };

  const handleAudioPause = () => {
    setIsPlaying(false);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setPlayCount((prev) => prev + 1);
  };

  const handleAudioError = (error) => {
    console.error("Audio error:", error);
    setAudioError("Failed to load audio");
    setIsPlaying(false);
    timeoutRef.current = setTimeout(() => {
      setPlayCount((prev) => prev + 1); // Simulate completion for timeout logic
      onTimeout(); // Also call onTimeout directly if error means cannot proceed
    }, 2000); // Or use onTimeout directly: onTimeout();
  };
  
  // Reset playCount when pair changes
  useEffect(() => {
    setPlayCount(0);
    setAudioError(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [pair]);


  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-64 h-64 mb-6">
        <Lottie
          lottieRef={lottieRef}
          path={speakerbirdAnimationPath} // PATH CHANGE: Using path prop for Lottie
          loop={true}
          autoplay={true}
          style={{ height: "100%", width: "100%" }}
        />
      </div>

      <div className="w-full max-w-md mb-6">
        <AudioPlayer
          // PATH CHANGE: Assumes audio files are in public/audio/
          src={`/audio/${pair[0]}_${pair[1]}.m4a`}
          onPlay={handleAudioPlay}
          onPause={handleAudioPause}
          onEnded={handleAudioEnd}
          onError={handleAudioError}
          customProgressBarSection={[
            "MAIN_CONTROLS",
            "PROGRESS_BAR",
            "DURATION",
          ]}
          customControlsSection={[]}
          customAdditionalControls={[]}
          showJumpControls={false}
          layout="horizontal"
          style={{ opacity: 0, position: "absolute", pointerEvents: "none" }} // Hidden player, controlled by custom button
        />
      </div>
      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.7)",
        }}
        whileTap={{
          scale: 0.95,
          boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
        }}
        onClick={handleClick}
        className={`
          relative p-8 rounded-full 
          bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 
          text-white shadow-xl 
          transition-all duration-300
          ${glow ? "ring-4 ring-cyan-300/60" : ""}
          overflow-hidden
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/0 rounded-full" />
        <FaPlay className="text-3xl" />
        {glow && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-300/30"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}
      </motion.button>
      {audioError && (
        <motion.div
          className="text-center mt-4 text-red-400 font-medium text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {audioError} - Continuing in 2 seconds...
        </motion.div>
      )}
    </div>
  );
};

export default SoundPlayerComponent;