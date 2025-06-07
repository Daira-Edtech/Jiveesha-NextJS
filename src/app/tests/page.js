"use client";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { MdQuiz, MdSchool, MdSearch } from "react-icons/md";
import { useRouter } from "next/navigation";
import TakeTestCard from "@/components/take-tests/TakeTestCard";
import { useLanguage } from "@/contexts/LanguageContext";
import testsData from "@/Data/tests.json"; // Import the new test data

const TakeTests = () => {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Transform testsData (from tests.json array) into the tests array format
  const tests = testsData.map((item, index) => {
    // Ensure essential properties are present and correctly typed.
    // 'id' should be a number. Use original 'id' if present and valid, otherwise use index as a fallback.
    // 'testName' is the English name.
    // 'About' is the English description.
    return {
      ...item, // Start with all properties from the JSON item
      id: item.id, // Fallback for id, using 0-based index
      testName: item.testName,
      About: item.About
    };
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTestClick = (testId) => {
    localStorage.setItem("selectedTestId", testId);
    router.push("/selectstudent");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // const filteredTests = tests.filter(test => {
  //   const searchLower = searchTerm.toLowerCase();
  //   // Search in both English and Tamil test names and descriptions
  //   return test.testName.toLowerCase().includes(searchLower) ||
  //     (test.About && test.About.toLowerCase().includes(searchLower)) ||
  //     (language === \'\'\'ta\'\'\' && test.testName_ta && test.testName_ta.toLowerCase().includes(searchLower)) ||
  //     (language === \'\'\'ta\'\'\' && test.About_ta && test.About_ta.toLowerCase().includes(searchLower));
  // });

  const supportedLanguages = [
    "ta",
    "hi",
    "gu",
    "pa",
    "te",
    "od",
    "ml",
    "mr",
    "kn",
    "bn",
  ];

  const filteredTests = tests.filter((test) => {
    const searchLower = searchTerm.toLowerCase();

    // Always check English base fields
    let match =
      test.testName?.toLowerCase().includes(searchLower) ||
      test.About?.toLowerCase().includes(searchLower);

    // Check localized fields for the current language if it's supported
    if (supportedLanguages.includes(language)) {
      const testNameLocalized = test[`testName_${language}`];
      const aboutLocalized = test[`About_${language}`];

      match ||= testNameLocalized?.toLowerCase().includes(searchLower);
      match ||= aboutLocalized?.toLowerCase().includes(searchLower);
    }

    return match;
  });

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header section */}

        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              localStorage.setItem("selectedTestId", "all");
              router.push("/selectstudent");
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 text-lg font-semibold"
          >
            <MdQuiz className="w-6 h-6" />
            {t("takeAllTests")}
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-blue-800 flex items-center">
              <MdQuiz className="mr-2 text-blue-600" />
              {t("tests")}
            </h1>
            <p className="text-gray-600 mt-1">{t("selectTestForStudent")}</p>
          </div>

          {/* Search bar */}
          <div
            className={`relative flex items-center rounded-full border ${
              isFocused
                ? "border-blue-400 ring-2 ring-blue-100"
                : "border-gray-200"
            } bg-white px-3 py-2 w-full md:w-64 transition-all duration-200`}
          >
            <MdSearch
              className={`text-xl ${
                isFocused ? "text-blue-500" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder={t("searchTests")}
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-grow ml-2 outline-none text-gray-700 placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Tests grid */}
        <div className="space-y-6">
          {filteredTests.length > 0 ? (
            filteredTests.map((test) => (
              <div key={test.id}>
                <TakeTestCard
                  test={test}
                  buttonLabel={t("takeTest")}
                  onClick={() => handleTestClick(test.id)}
                />
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <MdSchool className="text-6xl text-blue-200 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                {t("noTestsFound")}
              </h3>
              <p className="text-gray-500">{t("tryDifferentSearch")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

TakeTests.propTypes = {
  tests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      testName: PropTypes.string.isRequired,
      testName_ta: PropTypes.string,
      About: PropTypes.string,
      About_ta: PropTypes.string,
    })
  ),
};

export default TakeTests;
