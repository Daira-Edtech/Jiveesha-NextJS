// app/(tests)/sequence-arrangement/page.js
"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import WelcomeDialog from "../../../components/sequence-arrangement/WelcomeDialog.js";
// Import your existing LanguageProvider and useLanguage hook
import {
  LanguageProvider,
  useLanguage,
} from "../../../contexts/LanguageContext";

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

  const handleEntireTestFlowComplete = async (finalScore) => {
    console.log("Entire test flow completed. Final Score:", finalScore);
    console.log("Child ID:", childId);
    const token = localStorage.getItem("access_token");

    if (!childId) {
      console.warn("Child ID is missing. Cannot save results.");
      router.push("/take-tests?skipStart=true");
      return;
    }

    const payload = {
      childId: childId,
      score: finalScore.correct,
      total_questions: finalScore.total,
      test_name: "Sequential Memory Test",
    };

    console.log("Sending payload to API:", payload);

    try {
      const response = await axios.post(
        "/api/sequence-test/submitResult",
        payload,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Test results saved successfully:", response.data);
    } catch (error) {
      console.error(
        "Error saving test results in page.js:",
        error.response?.data || error.message
      );
      console.error("Full error object:", error);
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
const Test7Page = () => {
  return (
    <LanguageProvider>
      <SequenceArrangementTestContent />
    </LanguageProvider>
  );
};

export default Test7Page;
