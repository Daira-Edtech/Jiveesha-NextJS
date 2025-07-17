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

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const formData = await import("@/Data/formData.json");
        const data = formData.default;
        setQuestions(data.questions);

        const paginatedPages = [];
        let currentPageQuestions = [];
        let currentPageSlots = 0;
        const MAX_SLOTS = 6;

        const getSlots = (weight) => {
          if (weight === 1) return 2; 
          if (weight === 2) return 3; 
          if (weight === 3) return 6; 
          return 6; 
        };

        for (const question of data.questions) {
          const questionSlots = getSlots(question.weight);

          if (
            currentPageSlots + questionSlots > MAX_SLOTS &&
            currentPageQuestions.length > 0
          ) {
            paginatedPages.push(currentPageQuestions);
            currentPageQuestions = [question];
            currentPageSlots = questionSlots;
          } else {
            currentPageQuestions.push(question);
            currentPageSlots += questionSlots;
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

  const handleTableInputChange = (questionName, option, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionName]: {
        ...(prev[questionName] || {}),
        [option]: value,
      },
    }));
  };

  const renderInput = (question) => {
    const { name, type, options, label, scale } = question;
    const value = answers[name] || (type === "checkbox" ? [] : "");

    const baseClasses =
      "w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base";

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
            className={`${baseClasses} border-gray-200 bg-white/80 backdrop-blur-sm`}
            placeholder={`Enter ${label.toLowerCase()}`}
            rows={4}
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
                  className="text-base font-medium text-gray-700 cursor-pointer"
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
                  className="text-base font-medium text-gray-700 cursor-pointer leading-5"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case "table":
        return (
          <div>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">
              <p className="font-semibold mb-2">Rating Scale:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <b>0</b> – Never or almost never have the symptom
                </li>
                <li>
                  <b>1</b> – Occasionally have it, effect is not severe
                </li>
                <li>
                  <b>2</b> – Occasionally have it, effect is severe
                </li>
                <li>
                  <b>3</b> – Frequently have it, effect is not severe
                </li>
                <li>
                  <b>4</b> – Frequently have it, effect is severe
                </li>
              </ul>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      Symptom
                    </th>
                    {scale?.map((s, i) => (
                      <th
                        key={i}
                        className="text-center py-3 px-2 font-semibold text-gray-600"
                      >
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {options?.map((option, optionIndex) => (
                    <tr
                      key={optionIndex}
                      className="border-b last:border-b-0 hover:bg-gray-100/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {option}
                      </td>
                      {scale?.map((scaleValue, scaleIndex) => (
                        <td key={scaleIndex} className="text-center py-3 px-2">
                          <input
                            type="radio"
                            id={`${name}-${optionIndex}-${scaleIndex}`}
                            name={`${name}-${option}`} // Unique name for each radio group
                            value={scaleValue}
                            checked={answers[name]?.[option] === scaleValue}
                            onChange={(e) =>
                              handleTableInputChange(
                                name,
                                option,
                                e.target.value
                              )
                            }
                            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "scale":
        return (
          <div className="flex items-center justify-center space-x-4 pt-2">
            {scale?.map((option, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <label
                  htmlFor={`${name}-${index}`}
                  className="text-base font-medium text-gray-700"
                >
                  {option}
                </label>
                <input
                  type="radio"
                  id={`${name}-${index}`}
                  name={name}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(name, e.target.value)}
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
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
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
              <div key={question.name} className="min-h-[200px] p-4 bg-white/50 rounded-lg border border-gray-200 shadow-sm">
                <div className="h-full flex flex-col">
                  <Label
                    htmlFor={question.name}
                    className="text-lg font-semibold text-gray-800 flex items-center space-x-2 mb-4 flex-shrink-0"
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
                  <div className="flex-1 flex items-start">
                    {renderInput(question)}
                  </div>
                </div>
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
