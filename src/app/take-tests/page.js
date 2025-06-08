"use client";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { MdQuiz, MdSchool, MdSearch } from "react-icons/md";
import { useRouter } from "next/navigation";
import TakeTestCard from "@/components/take-tests/TakeTestCard";
import { useLanguage } from "@/contexts/LanguageContext";
import testsData from "@/Data/tests.json"; // Import the new test data
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/take-tests/SearchBar";
import EmptyState from "@/components/take-tests/EmptyState";

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
    router.push("/select-student");
  };

  const handleSearch = (e) => {
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
    // Guard against empty search term
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();

    // Always check English base fields with null/undefined checks
    let match = 
      (typeof test.testName === 'string' && test.testName.toLowerCase().includes(searchLower)) ||
      (typeof test.About === 'string' && test.About.toLowerCase().includes(searchLower));

    // Check localized fields for the current language if it's supported
    if (supportedLanguages.includes(language)) {
      const testNameLocalized = test[`testName_${language}`];
      const aboutLocalized = test[`About_${language}`];

      // Add null/undefined checks before calling toLowerCase
      if (typeof testNameLocalized === 'string') {
        match = match || testNameLocalized.toLowerCase().includes(searchLower);
      }
      
      if (typeof aboutLocalized === 'string') {
        match = match || aboutLocalized.toLowerCase().includes(searchLower);
      }
    }

    return match;
  });

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header section */}

        <div className="flex justify-end mb-6">
          <Button
            onClick={() => {
              localStorage.setItem("selectedTestId", "all");
              router.push("/select-student");
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-lg font-semibold"
            size="lg"
          >
            <MdQuiz className="w-6 h-6" />
            {t("takeAllTests")}
          </Button>
        </div>
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-blue-800 flex items-center">
                <MdQuiz className="mr-2 text-blue-600" />
                {t("tests")}
              </h1>
              <p className="text-gray-600 mt-1">{t("selectTestForStudent")}</p>
            </div>

            {/* Search bar */}
            <SearchBar 
              searchTerm={searchTerm}
              onSearch={handleSearch}
              onClear={clearSearch}
            />
          </div>
          
          <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-300 mt-4 rounded-full" />
        </div>

        {/* Tests grid */}
        <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
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
              <EmptyState searchTerm={searchTerm} />
            )}
          </div>
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
