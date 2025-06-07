"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const LoadingSkeletons = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-full">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-8 bg-gray-200 rounded mt-4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LoadingSkeletons;
