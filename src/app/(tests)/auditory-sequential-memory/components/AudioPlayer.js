import { useEffect, useRef, useCallback } from "react";

export default function AudioPlayer({ language = "en" }) {
  const speechSynthesisRef = useRef(null);

  const speakText = useCallback((text, rate = 0.9, pitch = 1.1) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = rate;
      speech.pitch = pitch;

      // Set language based on current language
      if (language === "ta") {
        speech.lang = "ta-IN"; // Tamil
      } else if (language === "hi") {
        speech.lang = "hi-IN"; // Hindi
      } else {
        speech.lang = "en-US"; // Default to English
      }

      speech.onend = () => {
        console.log("Speech finished");
      };

      speech.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
      };

      window.speechSynthesis.speak(speech);
      speechSynthesisRef.current = speech;
    } else {
      console.warn("Speech synthesis not supported in this browser.");
    }
  }, [language]);

  const stopSpeech = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Return the functions for external use
  return {
    speakText,
    stopSpeech
  };
}