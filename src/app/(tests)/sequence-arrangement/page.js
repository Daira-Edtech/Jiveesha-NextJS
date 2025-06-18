// app/(tests)/sequence-arrangement/page.js
"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import WelcomeDialog from "../../../components/sequence-arrangement/WelcomeDialog.js";
// Import your existing LanguageProvider and useLanguage hook
import { LanguageProvider, useLanguage } from "../../../contexts/LanguageContext";

// This inner component will consume the context
const SequenceArrangementTestContent = () => {
  const router = useRouter();
  const { language, t } = useLanguage(); // Get language and t from your existing context
  const [childId, setChildId] = useState(null);

  useEffect(() => {
    const storedChildId = localStorage.getItem("childId");
    if (storedChildId) {
      setChildId(storedChildId);
    }
  }, []);

  // Define the speak function here, using the 'language' from context
  const speak = useCallback((text, langOverride) => {
    const effectiveLang = langOverride || language; // Use context language or an override
    console.log(`TTS (Page-level, Context Lang: ${language}): "${text}" in language "${effectiveLang}"`);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = effectiveLang;
      // You can set default rate and pitch here if desired, e.g.:
      // utterance.rate = 0.9;
      // utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  const handleEntireTestFlowComplete = async (finalScore) => {
    console.log("Entire test flow completed. Final Score:", finalScore);
    const token = localStorage.getItem("access_token");

    if (!childId) {
      console.warn("Child ID is missing. Cannot save results.");
      router.push("/take-tests");
      return;
    }

    try {
      const response = await axios.post(
        "/api/sequence-test/submitResult",
        {
          childId: childId,
          score: finalScore.correct,
          total_questions: finalScore.total,
          test_name: "Sequence Test 7",
        },
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Test results saved by page.js:", response.data);
    } catch (error) {
      console.error(
        "Error saving test results in page.js:",
        error.response?.data || error.message
      );
    } finally {
      router.push("/take-tests");
    }
  };

  return (
    <div className="w-screen h-screen">
      
      <WelcomeDialog
        t={t}
        speak={speak} // Pass the newly defined speak function
        onEntireTestFlowComplete={handleEntireTestFlowComplete}
        initialChildId={childId}
      />
    </div>
  );
};

// The main export now wraps the content with your existing LanguageProvider
const Test7Page = () => {
  return (
    <LanguageProvider>
      <SequenceArrangementTestContent />
    </LanguageProvider>
  );
};

export default Test7Page;