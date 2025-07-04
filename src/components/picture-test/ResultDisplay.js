// components/PictureTest/ResultsDisplay.js
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import LoadingSpinner from "./LoadingSpinner";

export default function ResultsDisplay({ testResults, t, onRetakeTest }) {
  if (!testResults) {
    return <LoadingSpinner text={t("loadingResultsText")} />;
  }
  const isArray = Array.isArray(testResults);

  let responses = [];
  if (isArray) {
    responses = testResults;
  } else if (Array.isArray(testResults?.responses)) {
    responses = testResults.responses;
  } else if (typeof testResults?.responses === "string") {
    // Parse JSON string responses from database
    try {
      responses = JSON.parse(testResults.responses);
    } catch (e) {
      console.error("Failed to parse responses JSON:", e);
      responses = [];
    }
  }

  const score = isArray
    ? responses.reduce((sum, r) => sum + (r.totalForThisImage ?? 0), 0)
    : testResults?.score ?? 0;
  const totalPossibleScore = isArray
    ? responses.length * 2
    : testResults?.totalPossibleScore ?? responses.length * 2;

  // Debug logging
  console.log("ResultsDisplay Debug:", {
    testResults,
    isArray,
    responses,
    score,
    totalPossibleScore,
    responsesLength: responses?.length,
    responsesType: typeof testResults?.responses,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-4 md:p-6"
    >
      <div className="max-w-5xl w-full mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-white text-center"
          >
            {t("pictureTestResultsTitle")}
          </motion.h1>
        </div>

        <div className="p-4 md:p-6">
          <div className="overflow-x-auto rounded-lg border border-blue-200 shadow-md">
            <table className="w-full min-w-[700px]">
              {" "}
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    {t("tableHeaderImage")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    {t("tableHeaderUserAnswer")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    {t("tableHeaderCorrectAnswer")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    {t("tableHeaderScore")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    {t("tableHeaderDescription")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    {t("tableHeaderFeedback")}
                  </th>
                </tr>
              </thead>{" "}
              <tbody className="bg-white divide-y divide-blue-200">
                {responses?.length > 0 ? (
                  responses.map((response, index) => (
                    <motion.tr
                      key={response.image + index || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07, duration: 0.3 }}
                      className={index % 2 === 0 ? "bg-blue-50/70" : "bg-white"}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {response.image ? (
                          <Image
                            src={response.image}
                            alt={`Image for ${response.correctAnswer}`}
                            width={64}
                            height={64}
                            style={{ objectFit: "contain" }}
                            className="rounded-md"
                            onError={(e) => {
                              console.log(
                                "Image failed to load:",
                                response.image
                              );
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs">
                            {t("noImagePlaceholder")}
                          </div>
                        )}
                      </td>
                      <td
                        className={`px-4 py-3 whitespace-normal break-words ${
                          response.answerScore === 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {response.userAnswer || "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-normal break-words text-blue-800">
                        {response.correctAnswer || "-"}
                      </td>
                      <td
                        className={`px-4 py-3 whitespace-nowrap font-medium ${
                          (response.totalForThisImage ?? 0) === 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {response.totalForThisImage ?? "0"}/2
                      </td>
                      <td className="px-4 py-3 whitespace-normal break-words max-w-xs">
                        {response.description || "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-normal break-words max-w-xs text-blue-800">
                        {response.feedback || "-"}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      {t("noResponsesFound")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: (responses?.length || 0) * 0.07 + 0.2,
              duration: 0.4,
            }}
            className="mt-6 md:mt-8 bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200 shadow-lg"
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              {" "}
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <h2 className="text-xl font-bold text-blue-800">{t("finalScoreTitle")}</h2>
                <p className="text-4xl font-extrabold text-blue-600">
                  {score ?? 0}/{totalPossibleScore}
                </p>
              </div>
              <div className="flex space-x-2 md:space-x-4">
                {" "}
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRetakeTest}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {t("buttonTakeNewTest")}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}