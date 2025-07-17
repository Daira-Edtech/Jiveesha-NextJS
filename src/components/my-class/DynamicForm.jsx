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
import ConsentDialog from "./ConsentDialog";

const DynamicForm = ({ onSubmit, isLoading, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConsent, setShowConsent] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const formData = await import("@/Data/formData.json");
        const data = formData.default;
        setQuestions(data.questions);

        // Custom pagination: First page - consent + childName, Second page - childDob + gender, then 2 questions per page
        const paginatedPages = [];
        const allQuestions = data.questions;

        // Find specific questions by name
        const consent = allQuestions.find(q => q.name === "consent");
        const childName = allQuestions.find(q => q.name === "childName");
        const childDob = allQuestions.find(q => q.name === "childDob");
        const gender = allQuestions.find(q => q.name === "gender");

        // First page: consent + childName
        if (consent && childName) {
          paginatedPages.push([consent, childName]);
        }

        // Second page: childDob + gender
        if (childDob && gender) {
          paginatedPages.push([childDob, gender]);
        }

        // Remaining questions: 2 per page
        const remainingQuestions = allQuestions.filter(q => 
          !["consent", "childName", "childDob", "gender"].includes(q.name)
        );

        for (let i = 0; i < remainingQuestions.length; i += 2) {
          paginatedPages.push(remainingQuestions.slice(i, i + 2));
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

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (currentPage < pages.length - 1) {
          nextPage();
        } else {
          handleSubmit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, pages.length]);

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
      "w-full transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-base backdrop-blur-xl border-0 bg-white/20 rounded-xl shadow-sm";

    switch (type) {
      case "text":
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={`${baseClasses} h-12 px-4 placeholder:text-gray-400`}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={`${baseClasses} h-12 px-4`}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={`${baseClasses} min-h-24 px-4 py-3 placeholder:text-gray-400 resize-none`}
            placeholder={`Enter ${label.toLowerCase()}`}
            rows={3}
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            className={`${baseClasses} h-12 px-4 appearance-none cursor-pointer`}
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
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500/30 focus:ring-2"
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
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500/30 focus:ring-2 mt-0.5"
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
          <div className="space-y-4">
            <div className="p-4 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl text-xs text-gray-700">
              <p className="font-semibold mb-2">Rating Scale:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><b>0</b> – Never or almost never have the symptom</li>
                <li><b>1</b> – Occasionally have it, effect is not severe</li>
                <li><b>2</b> – Occasionally have it, effect is severe</li>
                <li><b>3</b> – Frequently have it, effect is not severe</li>
                <li><b>4</b> – Frequently have it, effect is severe</li>
              </ul>
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/20 bg-white/20 backdrop-blur-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20 bg-white/10">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Symptom
                    </th>
                    {scale?.map((s, i) => (
                      <th
                        key={i}
                        className="text-center py-3 px-2 font-semibold text-gray-700"
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
                      className="border-b border-white/10 last:border-b-0 hover:bg-white/10 transition-colors duration-200"
                    >
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {option}
                      </td>
                      {scale?.map((scaleValue, scaleIndex) => (
                        <td key={scaleIndex} className="text-center py-3 px-2">
                          <input
                            type="radio"
                            id={`${name}-${optionIndex}-${scaleIndex}`}
                            name={`${name}-${option}`}
                            value={scaleValue}
                            checked={answers[name]?.[option] === scaleValue}
                            onChange={(e) =>
                              handleTableInputChange(
                                name,
                                option,
                                e.target.value
                              )
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500/30 focus:ring-2 cursor-pointer"
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
          <div className="flex items-center justify-center space-x-6 pt-2">
            {scale?.map((option, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <label
                  htmlFor={`${name}-${index}`}
                  className="text-base font-medium text-gray-700 text-center"
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
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500/30 focus:ring-2"
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
            className={`${baseClasses} h-12 px-4`}
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
    console.log("DynamicForm - Number of answers:", Object.keys(answers).length);

    const requiredFields = ["childName", "childDob", "gender"];
    const missingFields = requiredFields.filter((field) => !answers[field]);

    if (missingFields.length > 0) {
      alert(
        `Please fill in the following required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    onSubmit(answers);
  };

  const progress = ((currentPage + 1) / pages.length) * 100;

  const handleConsentConfirm = () => {
    setShowConsent(false);
  };

  const handleConsentCancel = () => {
    onClose();
  };

  if (loading) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dlfn3vcjp/image/upload/v1752780072/forestcrayon_gevzcb.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent relative z-10"></div>
      </div>
    );
  }

  // Show consent dialog first
  if (showConsent) {
    return (
      <ConsentDialog 
        onConfirm={handleConsentConfirm}
        onCancel={handleConsentCancel}
      />
    );
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dlfn3vcjp/image/upload/v1752779537/20250718_0039_Whimsical_Crayon_Zoo_simple_compose_01k0cwj5kzf8ktmhg2enrmfeky_2_ns5qkx.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/50 to-purple-50/30 backdrop-blur-lg"></div>

      <Card className="w-full scale-75 max-w-3xl mx-auto relative z-10 shadow-2xl border-0 bg-white/40 backdrop-blur-2xl rounded-3xl">
        <CardHeader className="text-center pb-6 border-b border-white/20">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Student Registration Form
          </CardTitle>
          <div className="flex items-center justify-center space-x-2 text-base text-gray-600 mt-3">
            <Calendar className="w-4 h-4" />
            <span>Page {currentPage + 1} of {pages.length}</span>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-base font-medium text-gray-700">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2 backdrop-blur-sm">
              <div
                className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Questions Container */}
          <div className="space-y-4">
            {pages[currentPage]?.map((question, index) => (
              <div
                key={question.name}
                className="p-6 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/20 transition-all duration-300"
              >
                <div className="space-y-4">
                  <Label
                    htmlFor={question.name}
                    className="text-lg font-semibold text-gray-800 flex items-center space-x-3"
                  >
                    <span className="w-8 h-8 min-w-8 min-h-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {pages
                        .slice(0, currentPage)
                        .reduce((acc, page) => acc + page.length, 0) +
                        index +
                        1}
                    </span>
                    <span className="leading-tight">{question.label}</span>
                    {question.required && <span className="text-red-500">*</span>}
                  </Label>
                  <div>
                    {renderInput(question)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-white/20">
            <Button
              onClick={prevPage}
              disabled={currentPage === 0}
              variant="outline"
              className="flex items-center space-x-2 px-6 py-3 bg-white/50 hover:bg-white/70 border-white/30 backdrop-blur-sm rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

          
            {currentPage === pages.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all duration-200"
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
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all duration-200"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-center pt-2">
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-white bg-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200"
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
