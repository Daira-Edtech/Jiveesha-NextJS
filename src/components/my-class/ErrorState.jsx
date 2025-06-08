"use client";

import React from "react";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Students
            </h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorState;
