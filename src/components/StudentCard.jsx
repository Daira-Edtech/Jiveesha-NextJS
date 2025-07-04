import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

// Default translations as fallback
const defaultTranslations = {
  en: {
    rollNo: "Roll No",
    testsTaken: "Tests Taken",
    takeFullTest: "Take Full Test",
    takeIndividualTest: "Take Individual Test",
    close: "Close",
    performance: "Performance",
    viewFormAnalysis: "View Form Analysis",
  },
  ta: {
    rollNo: "ரோல் எண்",
    testsTaken: "எடுத்த தேர்வுகள்",
    takeFullTest: "முழு தேர்வு எடுக்கவும்",
    takeIndividualTest: "தனிப்பட்ட தேர்வு எடுக்கவும்",
    close: "மூடு",
    performance: "செயல்திறன்",
    viewFormAnalysis: "படிவ பகுப்பாய்வு பார்க்கவும்",
  },
};

// Animated info card component for student details
const InfoCard = ({ title, value, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white w-full center rounded-xl p-4 flex flex-col items-center shadow-md border border-blue-100 hover:border-blue-300 transition-colors duration-300"
  >
    <div className="text-2xl mb-1 text-blue-500">{icon}</div>
    <p className="text-xs text-blue-400 font-medium">{title}</p>
    <p className="font-semibold text-blue-700 text-lg mt-1">{value}</p>
  </motion.div>
);

const StudentCard = ({
  student = {},
  buttonLabel = "Click Me",
  onButtonClick = () => {},
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showDialog, setShowDialog] = useState(false);
  const dialogRef = useRef(null);

  // Get language context with fallback
  const languageContext = useLanguage();
  const language = languageContext?.language || "en";
  const t = (key) => {
    if (languageContext?.t) return languageContext.t(key);
    return defaultTranslations[language][key] || key;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setShowDialog(false);
      }
    };
    if (showDialog) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDialog]);

  const handleCardClick = () => {
    if (pathname === "/viewstudents") setShowDialog(true);
  };

  return (
    <>
      <div
        className="h-full bg-white rounded-xl border-2 border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out hover:border-blue-400 group overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        <article className="h-full flex flex-col p-4">
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 mb-3 rounded-full overflow-hidden border-2 border-blue-300 transition-all duration-300 group-hover:border-blue-500 transform group-hover:scale-105">
              <img
                src={student.profileImage || "/default-profile.jpg"}
                alt={`${student.name || "Student"}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </div>
            <h3 className="text-xl font-semibold text-blue-800 transition-colors duration-300 group-hover:text-blue-600">
              {student.name || "Unknown Student"}
            </h3>
          </div>
          <div className="flex justify-between items-center w-full px-4 mb-5">
            <div className="flex flex-col items-center justify-center space-y-1 w-1/2 transition-transform duration-300 ease-out group-hover:transform group-hover:-translate-y-1">
              <p className="text-sm text-blue-500">{t("rollNo")}</p>
              <p className="text-sm font-semibold text-blue-700">
                {student.rollno || "N/A"}
              </p>
            </div>
            <div className="h-12 border-r border-blue-200 transition-all duration-300 group-hover:border-blue-400 group-hover:h-14"></div>
            <div className="flex flex-col items-center justify-center space-y-1 w-1/2 transition-transform duration-300 ease-out group-hover:transform group-hover:-translate-y-1">
              <p className="text-sm text-blue-500">{t("testsTaken")}</p>
              <p className="text-base font-semibold text-blue-700">
                {student.testsTaken || "0"}
              </p>
            </div>
          </div>
          {(pathname.includes("/analytics") ||
            pathname.includes("/selectstudent")) && (
            <div className="mt-auto space-y-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onButtonClick();
                }}
                className="w-full py-2 px-4 bg-blue-100 hover:bg-blue-600 text-blue-700 hover:text-white rounded-md border border-blue-300 hover:border-transparent transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`View test report for ${student.name || "student"}`}
              >
                {buttonLabel}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  localStorage.setItem("childId", student.id);
                  router.push("/formanalysis");
                }}
                className="w-full py-2 px-4 bg-blue-100 hover:bg-blue-600 text-blue-700 hover:text-white rounded-md border border-blue-300 hover:border-transparent transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`View form analysis for ${
                  student.name || "student"
                }`}
              >
                {t("viewFormAnalysis")}
              </button>
            </div>
          )}
        </article>
      </div>
    </>
  );
};

export default StudentCard;
