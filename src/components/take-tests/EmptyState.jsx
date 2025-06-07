"use client";

import React from "react";
import { MdSchool } from "react-icons/md";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const EmptyState = ({ searchTerm }) => {
  const { t } = useLanguage();
  
  return (
    <Card className="w-full">
      <CardContent className="p-8 text-center">
        <MdSchool className="text-6xl text-blue-200 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          {t("noTestsFound")}
        </h3>
        <p className="text-gray-500">{t("tryDifferentSearch")}</p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
