"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChildren } from "@/hooks/useChildren";
import { useLanguage } from "@/contexts/LanguageContext";
import testsData from "@/Data/tests.json";

import StudentSelectionCard from "@/components/select-student/StudentSelectionCard";
import LoadingSkeletons from "@/components/select-student/LoadingSkeletons";
import EmptyStates from "@/components/select-student/EmptyStates";
import ErrorState from "@/components/select-student/ErrorState";
import PageHeader from "@/components/select-student/PageHeader";

export default function SelectStudentPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const { data: childrenData, isLoading, error } = useChildren();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  const handleStudentSelect = (student) => {
    localStorage.setItem("childId", student.id.toString());
    localStorage.setItem('selectedStudent', JSON.stringify(student));
    
    const selectedTestIdString = localStorage.getItem("selectedTestId");
    
    if (selectedTestIdString === "all") {
      router.push("/continuousassessment");
    } else if (selectedTestIdString) {
      const selectedTestId = parseInt(selectedTestIdString, 10);
      const test = testsData.find(t => t.id === selectedTestId);
      if (test && test.routeName) {
        router.push(`/${test.routeName}`);
      } else {
        console.warn(`Test with ID ${selectedTestId} or its routeName not found. Navigating to dashboard.`);
        router.push("/dashboard");
      }
    } else {
      console.warn("selectedTestId not found in localStorage. Navigating to dashboard.");
      router.push("/dashboard");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const filteredStudents = (childrenData?.children || []).filter((student) =>
    student?.name?.toLowerCase().includes(searchTerm) ||
    student?.rollno?.toLowerCase().includes(searchTerm)
  );

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="h-screen bg-gradient-to-b from-blue-50 to-white overflow-auto">
      <div className="container mx-auto px-4 py-8 pb-16">
        <PageHeader searchTerm={searchTerm} onSearch={handleSearch} />

        <main>
          <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {isLoading ? (
              <LoadingSkeletons />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <StudentSelectionCard
                      key={student.id}
                      student={student}
                      onSelect={handleStudentSelect}
                    />
                  ))
                ) : (
                  <EmptyStates searchTerm={searchTerm} />
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseLight {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }

        .animate-pulseLight {
          animation: pulseLight 2s infinite;
        }

        .stagger-children > * {
          animation-delay: calc(var(--stagger) * 100ms);
        }
      `}</style>
    </div>
  );
}
