"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AddStudentCard = ({ onClick }) => {
  return (
    <Card
      className="border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-all duration-300 hover:shadow-lg group"
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
              Add New Student
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Click to add a student to your class
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddStudentCard;
