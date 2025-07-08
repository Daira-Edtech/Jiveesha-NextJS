// app/(tests)/sequence-arrangement/page.js
"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import WelcomeDialog from "../../../components/sequence-arrangement/WelcomeDialog.js";

import {
  LanguageProvider,
  useLanguage,
} from "../../../contexts/LanguageContext";

const SequenceArrangementTestContent = ({ isContinuous = false, onTestComplete }) => {
  const router = useRouter();
  const { t } = useLanguage();
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
          score: finalScore.correct,
          total: finalScore.total,
          test: "SequenceArrangement",
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

    const apiUrl = "/api/sequence-test/submitResult";

    const payload = {
      childId: childId,
      score: finalScore.correct,
      total_questions: finalScore.total,
      test_name: "Sequential Memory Test",
    };

    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      });
      console.log("Test results saved successfully:", response.data);
    } catch (error) {
      console.error(
        "Error saving test results:",
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
        onEntireTestComplete={handleEntireTestFlowComplete}
        initialChildId={childId}
      />
    </div>
  );
};

// The main export now wraps the content with your existing LanguageProvider
const Test7Page = ({ isContinuous = false, onTestComplete }) => {
  return (
    <LanguageProvider>
      <SequenceArrangementTestContent
        isContinuous={isContinuous}
        onTestComplete={onTestComplete}
      />
    </LanguageProvider>
  );
};

export default Test7Page;
