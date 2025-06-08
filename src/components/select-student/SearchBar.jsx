"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

const SearchBar = ({ searchTerm, onSearch }) => {
  const { t } = useLanguage();
  
  return (
    <div className="relative w-full md:w-80">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder={t('searchStudent') || 'Search students...'}
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default SearchBar;
