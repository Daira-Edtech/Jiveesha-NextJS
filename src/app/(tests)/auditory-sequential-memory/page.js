// app/(tests)/auditory-sequential/page.js

"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import WelcomeDialog from "@/components/auditory-sequential-memory/WelcomeDialog.js";
import { useLanguage } from "@/contexts/LanguageContext.jsx";

const AuditorySequentialPage = ({ isContinuous = false, onTestComplete }) => {
  const router = useRouter();
  const { language, t } = useLanguage();
  const speak = useCallback(
    (text, rate = 0.9, pitch = 1.1) => {
      if (typeof window !== "undefined" && "speechSynthesis" in window && text) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.lang = language;
        window.speechSynthesis.speak(utterance);
      }
    },
    [language]
  );
  const [childId, setChildId] = useState(null);

  useEffect(() => {
    const storedChildId = localStorage.getItem("childId");
    if (storedChildId) {
      setChildId(storedChildId);
    }
  }, []);

  const handleEntireTestFlowComplete = async (finalScore) => {
    if (isContinuous) {
      if (onTestComplete) {
        onTestComplete({
          score: finalScore.final,
          total: finalScore.total, // Assuming finalScore has a total property
          test: "AuditorySequentialMemory",
          details: finalScore,
        });
      }
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!childId) {
      console.warn("Child ID is missing. Cannot save results.");
      router.push("/take-tests?skipStart=true");
      return;
    }

    const apiUrl = "/api/auditory-test/submitResult";

    const payload = {
      childId: childId,
      score: finalScore.final,
      forwardCorrect: finalScore.forward,
      reverseCorrect: finalScore.reverse,
      test_name: "Auditory Sequential Memory Test",
    };

    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      });

      console.log("Test results saved by page.js:", response.data);
    } catch (error) {
      console.error(
        "Error saving test results in page.js:",
        error.response?.data || error.message
      );
    } finally {
      router.push("/take-tests?skipStart=true");
    }
  };

  return (
    <div className="w-screen h-screen">
      <WelcomeDialog
        t={t}
        speak={speak}
        onEntireTestFlowComplete={handleEntireTestFlowComplete}
        initialChildId={childId}
      />
    </div>
  );
};

export default AuditorySequentialPage;
