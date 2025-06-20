"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const MetricCard = ({ title, value, className = "" }) => {
  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <h2 className="text-2xl font-bold text-blue-600 mt-1">{value}</h2>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
