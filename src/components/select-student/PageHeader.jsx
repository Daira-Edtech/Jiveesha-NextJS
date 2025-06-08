"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import SearchBar from "./SearchBar";

const PageHeader = ({ searchTerm, onSearch }) => {
  const { t } = useLanguage();

  return (
    <header className="mb-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 
          className="text-3xl font-bold text-blue-800 transition-all duration-300 hover:text-blue-700"
          aria-label={t('selectStudent') || 'Select Student'}
        >
          {t('selectStudent') || 'Select Student'}
        </h1>
        <SearchBar searchTerm={searchTerm} onSearch={onSearch} />
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-300 mt-4 rounded-full animate-pulseLight" 
           aria-hidden="true" />
    </header>
  );
};

export default PageHeader;
