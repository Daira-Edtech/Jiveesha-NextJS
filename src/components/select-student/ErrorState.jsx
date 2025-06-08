"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const ErrorState = ({ error, onRetry }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col flex-1 bg-gray-50 min-h-0">
      <div className="flex-1 px-4 py-8 min-h-0 overflow-y-auto">
        <div className="text-center py-16">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {t('errorLoadingStudents') || 'Failed to load students'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.message || 'An error occurred while loading the student list'}
          </p>
          <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
            {t('tryAgain') || 'Try Again'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
