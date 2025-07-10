// app/(tests)/auditory-sequential/page.js

"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import WelcomeDialog from "@/components/auditory-sequential-memory/WelcomeDialog.js";
import { useLanguage } from "@/contexts/LanguageContext.jsx";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const AuditorySequentialPage = ({ isContinuous = false, onTestComplete }) => {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        const totalQuestions = finalScore.forwardTotal + finalScore.reverseTotal;
        onTestComplete({
          score: finalScore.final,
          total: totalQuestions,
          test: "AuditorySequentialMemory",
          details: finalScore,
        });
      }
      return;
    }

    const token = localStorage.getItem("access_token");
    const storedChildId = localStorage.getItem("childId");

    if (!storedChildId) {
      toast.error(t("errorNoChildId", "User information is missing"));
      router.push("/take-tests?skipStart=true");
      return;
    }

    setIsSubmitting(true);
    const submissionToastId = toast.loading(t("submittingResults", "Submitting results..."));

    const apiUrl = `/api/auditory-test/submitResult`;

    const payload = {
      childId: storedChildId,
      score: finalScore.final,
      forwardCorrect: finalScore.forward,
      reverseCorrect: finalScore.reverse,
      test_name: "Auditory Sequential Memory Test",
      language: language
    };

    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Test results saved:", response.data);
      toast.dismiss(submissionToastId);
      toast.success(t("resultsSubmitted", "Results submitted successfully!"));
      router.push("/take-tests?skipStart=true");
    } catch (error) {
      console.error("Error saving results:", error.response?.data || error.message);
      toast.dismiss(submissionToastId);
      toast.error(
        t("errorSubmittingResults", "Error submitting results. Please try again.")
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen h-screen">
      <WelcomeDialog
        t={t}
        speak={speak}
        onEntireTestFlowComplete={handleEntireTestFlowComplete}
        initialChildId={childId}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AuditorySequentialPage;
