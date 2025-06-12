"use client";

import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

const PerformanceChart = ({ data = [] }) => {
  const { t } = useLanguage();

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        {t("noDataAvailable") || "No data available"}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="highest"
          stroke="#2563eb"
          strokeWidth={2}
          name={t("highest") || "Highest"}
        />
        <Line
          type="monotone"
          dataKey="average"
          stroke="#3b82f6"
          strokeWidth={2}
          name={t("average") || "Average"}
        />
        <Line
          type="monotone"
          dataKey="lowest"
          stroke="#93c5fd"
          strokeWidth={2}
          name={t("lowest") || "Lowest"}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
