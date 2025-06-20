"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const TestResultCard = ({ test, onClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick && onClick(test)}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-800 mb-0.5 truncate">
              {test.testName || "Test"}
            </h4>
            <p className="text-xs text-gray-600 mb-1 truncate">
              {test.studentName || "Unknown Student"}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{formatDate(test.createdAt)}</span>
              <span>•</span>
              <span>{formatTime(test.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestResultCard;
