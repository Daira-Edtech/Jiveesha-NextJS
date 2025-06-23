"use client";
import React, { useEffect, useState, useMemo } from "react";
import { MdPerson } from "react-icons/md";
import { useRouter, usePathname } from "next/navigation";
import SearchbyName from "../../components/SearchByName";
import StudentCard from "../../components/StudentCard";
import { useLanguage } from "../../contexts/LanguageContext";
import { useChildren } from "../../hooks/useChildren";

export default function Analytics() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const { data, isLoading, error, refetch } = useChildren();
  const students = data?.children ?? [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChildClick = (studentId) => {
    const storedId = localStorage.getItem("childId");
    if (studentId !== storedId) {
      localStorage.setItem("childId", studentId);
    }
    router.push("/testreports");
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredStudents = useMemo(
    () =>
      students
        ? students.filter((student) =>
            student.name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [],
    [students, searchTerm]
  );

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col overflow-auto">
        <header className="mb-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {" "}
            <h1
              className="text-3xl font-bold text-blue-800 transition-all duration-300 hover:text-blue-700"
              aria-label={t("myClassroom")}
            >
              {pathname.includes("/analytics")
                ? t("analytics")
                : t("studentsManagement")}
            </h1>
            <SearchbyName onSearch={handleSearch} />
          </div>
          <div
            className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-300 mt-4 rounded-full animate-pulseLight"
            aria-hidden="true"
          />
        </header>

        <main className="flex-grow overflow-auto pb-16">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Loading indicator */}
            {isLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center p-8">
                <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4"></div>
                <p className="text-blue-600 font-medium">
                  {t("loadingStudents") || "Loading students..."}
                </p>
              </div>
            ) : error ? (
              <div className="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-red-200 shadow-sm">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className="text-lg text-gray-600">
                  {error.message || error}
                </p>
                <button
                  onClick={refetch}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t("tryAgain") || "Try Again"}
                </button>
              </div>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  buttonLabel={t("viewTestReport") || "View Test Report"}
                  onButtonClick={() => handleChildClick(student.id)}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-blue-200 shadow-sm animate-slideInUp">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                  <MdPerson className="w-10 h-10" aria-hidden="true" />
                </div>
                <p className="text-lg text-gray-600">
                  {t("noStudentsFound") || "No students found"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {t("adjustSearchOrAddNewStudent") ||
                    "Adjust your search criteria"}
                </p>
              </div>
            )}
          </div>{" "}
        </main>
      </div>
    </div>
  );
}
