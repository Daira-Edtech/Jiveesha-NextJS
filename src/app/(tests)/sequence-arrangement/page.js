// app/(tests)/sequence-arrangement/page.js
"use client";

import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import WelcomeDialog from "../../../components/sequence-arrangement/WelcomeDialog.js";

import {
  LanguageProvider,
  useLanguage,
} from "../../../contexts/LanguageContext";

const SequenceArrangementTestContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const [childId, setChildId] = useState(null);

  useEffect(() => {
    const storedChildId = localStorage.getItem("childId");
    if (storedChildId) {
      setChildId(storedChildId);
    }
  }, []);
  //vimalchangesdonehere

  const handleEntireTestFlowComplete = async (finalScore) => {
    const token = localStorage.getItem("access_token");

    if (!childId) {
      console.warn("Child ID is missing. Cannot save results.");
      // For non-dummy routes, redirect if no childId
      if (pathname !== "/dummy") {
        router.push("/take-tests?skipStart=true");
      }
      return;
    }

    const isDummyRoute = pathname === "/dummy";
    const apiUrl = isDummyRoute
      ? "/api/continuous-test"
      : "/api/sequence-test/submitResult";

    const payload = isDummyRoute
      ? {
          childId,
          totalScore: parseFloat(finalScore?.correct || 0),
          testResults: JSON.stringify(finalScore),
          analysis: "Sequential Memory Test",
        }
      : {
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
      if (!isDummyRoute) {
        router.push("/take-tests?skipStart=true");
      }
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
      <SequenceArrangementTestContent />
    
  );
};

export default Test7Page;
