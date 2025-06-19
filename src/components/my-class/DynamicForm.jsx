"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  User,
  Calendar,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const DynamicForm = ({ onSubmit, isLoading, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const WEIGHT_THRESHOLD = 4;
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Import the JSON data directly
        const formData = await import("@/Data/formData.json");
        const data = formData.default;
        setQuestions(data.questions);

        // Paginate questions based on weight
        const paginatedPages = [];
        let currentPageQuestions = [];
        let currentWeight = 0;

        for (const question of data.questions) {
          if (
            currentWeight + question.weight > WEIGHT_THRESHOLD &&
            currentPageQuestions.length > 0
          ) {
            paginatedPages.push(currentPageQuestions);
            currentPageQuestions = [question];
            currentWeight = question.weight;
          } else {
            currentPageQuestions.push(question);
            currentWeight += question.weight;
          }
        }

        if (currentPageQuestions.length > 0) {
          paginatedPages.push(currentPageQuestions);
        }

        setPages(paginatedPages);
      } catch (error) {
        console.error("Error loading questions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleInputChange = (name, value) => {
    setAnswers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name, option, checked) => {
    setAnswers((prev) => {
      const currentValues = prev[name] || [];
      if (checked) {
        return {
          ...prev,
          [name]: [...currentValues, option],
        };
      } else {
        return {
          ...prev,
          [name]: currentValues.filter((val) => val !== option),
        };
      }
    });
  };

  const renderInput = (question) => {
    const { name, type, options, label } = question;
    const value = answers[name] || (type === "checkbox" ? [] : "");

    const baseClasses =
      "w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

    switch (type) {
      case "text":
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={`${baseClasses} border-gray-200 bg-white/80 backdrop-blur-sm`}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={`${baseClasses} border-gray-200 bg-white/80 backdrop-blur-sm`}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={`${baseClasses} border-gray-200 bg-white/80 backdrop-blur-sm min-h-[100px]`}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={`${baseClasses} border-gray-200 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-md`}
          >
            <option value="">Select an option</option>
            {options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="space-y-3">
            {options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="radio"
                  id={`${name}-${index}`}
                  name={name}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(name, e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor={`${name}-${index}`}
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-3">
            {options?.map((option, index) => (
              <div key={index} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id={`${name}-${index}`}
                  checked={value.includes(option)}
                  onChange={(e) =>
                    handleCheckboxChange(name, option, e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <label
                  htmlFor={`${name}-${index}`}
                  className="text-sm font-medium text-gray-700 cursor-pointer leading-5"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={`${baseClasses} border-gray-200 bg-white/80 backdrop-blur-sm`}
          />
        );
    }
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleSubmit = () => {
    console.log("DynamicForm - Submitting answers:", answers);
    console.log(
      "DynamicForm - Number of answers:",
      Object.keys(answers).length
    );

    // Basic validation for required fields
    const requiredFields = ["childName", "childDob", "gender"];
    const missingFields = requiredFields.filter((field) => !answers[field]);

    if (missingFields.length > 0) {
      alert(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    onSubmit(answers);
  };

  const progress = ((currentPage + 1) / pages.length) * 100;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{
        backgroundImage: `url('/Form/image.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

      <Card className="w-full max-w-2xl mx-auto relative z-10 shadow-2xl border-0 bg-white/90 backdrop-blur-md">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Student Registration Form
          </CardTitle>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-2">
            <Calendar className="w-4 h-4" />
            <span>
              Page {currentPage + 1} of {pages.length}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {pages[currentPage]?.map((question, index) => (
              <div key={question.name} className="space-y-3">
                <Label
                  htmlFor={question.name}
                  className="text-base font-semibold text-gray-800 flex items-center space-x-2"
                >
                  <span className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {pages
                      .slice(0, currentPage)
                      .reduce((acc, page) => acc + page.length, 0) +
                      index +
                      1}
                  </span>
                  <span>{question.label}</span>
                  {question.required && <span className="text-red-500">*</span>}
                </Label>
                {renderInput(question)}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <Button
              onClick={prevPage}
              disabled={currentPage === 0}
              variant="outline"
              className="flex items-center space-x-2 px-6 py-2 bg-white/80 hover:bg-white/90 border-gray-300"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            {currentPage === pages.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={nextPage}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicForm;
