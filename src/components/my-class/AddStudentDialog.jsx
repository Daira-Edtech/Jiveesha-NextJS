"use client";

import React, { useState } from "react";
import { useSubmitFormData } from "@/hooks/useFormData";
import DynamicForm from "./DynamicForm";
import AnalysisDisplay from "./AnalysisDisplay";

const AddStudentDialog = ({ open, onOpenChange, onAddStudent, childId }) => {
  const { mutate: submitFormData, isPending: isSubmittingForm } =
    useSubmitFormData();
  const [analysisData, setAnalysisData] = useState(null);
  const [childDob, setChildDob] = useState(null);
  const handleFormSubmit = (responses) => {
    console.log("Form responses:", responses);
    console.log("Child ID:", childId);

    // childId can be null for new student registration

    submitFormData(
      {
        childId: childId || null, // Pass null if no childId (new registration)
        responses,
        formVersion: "1.0",
      },
      {
        onSuccess: (result) => {
          console.log("Form submission response:", result);
          // The API returns { message, data: { child, formResponse, analysis } }
          setAnalysisData(result.data?.analysis);
          setChildDob(responses.childDob);
          onAddStudent && onAddStudent();
        },
        onError: (error) => {
          console.error("Error submitting form:", error);
        },
      }
    );
  };

  const handleClose = () => {
    setAnalysisData(null);
    setChildDob(null);
    onOpenChange(false);
  };

  if (!open) return null;

  if (analysisData) {
    return (
      <AnalysisDisplay
        analysis={analysisData}
        childDob={childDob}
        onClose={handleClose}
      />
    );
  }

  return (
    <DynamicForm
      onSubmit={handleFormSubmit}
      isLoading={isSubmittingForm}
      onClose={() => onOpenChange(false)}
    />
  );
};

export default AddStudentDialog;
