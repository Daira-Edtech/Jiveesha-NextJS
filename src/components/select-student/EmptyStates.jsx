"use client";

import React from "react";
import { User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const EmptyStates = ({ searchTerm }) => {
  const { t } = useLanguage();
  
  return (
    <div className="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-blue-200 shadow-sm animate-slideInUp">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
        <User className="w-10 h-10" aria-hidden="true" />
      </div>
      <p className="text-lg text-gray-600">
        {searchTerm ? t('noStudentsFound') || 'No students found' : t('noStudentsAvailable') || 'No students available'}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        {searchTerm ? t('tryAdjustingSearch') || 'Try adjusting your search' : t('contactAdministrator') || 'Please contact your administrator'}
      </p>
    </div>
  );
};

export default EmptyStates;
