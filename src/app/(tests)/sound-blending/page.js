// app/(tests)/sound-blending/page.js

"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WelcomeDialog from "../../../components/sound-blending/WelcomeDialog.js";
import { useLanguage } from "../../../contexts/LanguageContext";

const SoundBlendingPage = ({ isContinuous = false, onTestComplete }) => {
  const router = useRouter();
  const [childId, setChildId] = useState(null);
  const { t } = useLanguage();

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
          test: "SoundBlending",
          responses: finalScore.responses,
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

    const apiUrl = "/api/soundBlending-test/submitResult";

    const payload = {
      childId: childId,
      score: finalScore.correct,
      total_questions: finalScore.total,
      test_name: "Sound Blending Test",
      responses: finalScore.responses || {},
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
        onEntireTestComplete={handleEntireTestFlowComplete}
        initialChildId={childId}
      />
    </div>
  );
};

export default SoundBlendingPage;
