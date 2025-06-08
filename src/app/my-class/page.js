"use client";

import React, { useState, useEffect } from "react";
import { useChildren } from "@/hooks/useChildren";
import StudentCard from "@/components/my-class/StudentCard";
import AddStudentDialog from "@/components/my-class/AddStudentDialog";
import StudentDetailsDialog from "@/components/my-class/StudentDetailsDialog";
import AddStudentCard from "@/components/my-class/AddStudentCard";
import SearchBar from "@/components/my-class/SearchBar";
import EmptyStates from "@/components/my-class/EmptyStates";
import LoadingSkeletons from "@/components/my-class/LoadingSkeletons";
import ErrorState from "@/components/my-class/ErrorState";

export default function MyClass() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { data: childrenData, isLoading, error, refetch } = useChildren();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setIsDetailsDialogOpen(true);
  };

  const handleAddStudent = () => {
    refetch();
  };

  const filteredStudents = childrenData?.children
    ? childrenData.children.filter((student) =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollno?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="flex flex-col flex-1 bg-gray-50 min-h-0">
      <div className="flex-1 px-4 py-8 min-h-0 overflow-y-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Class</h1>
              <p className="text-gray-600">
                Manage your students and track their progress
              </p>
            </div>
            
            <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
          </div>
          
          <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-300 mt-4 rounded-full" />
        </div>

        <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {isLoading ? (
            <LoadingSkeletons />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AddStudentCard onClick={() => setIsAddDialogOpen(true)} />
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onStudentClick={handleStudentClick}
                  />
                ))
              ) : searchTerm ? (
                <EmptyStates type="search" searchTerm={searchTerm} />
              ) : (
                childrenData?.children?.length === 0 && (
                  <EmptyStates 
                    type="empty" 
                    onAddStudent={() => setIsAddDialogOpen(true)}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>

      <AddStudentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddStudent={handleAddStudent}
      />

      <StudentDetailsDialog
        student={selectedStudent}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
    </div>
  );
}
