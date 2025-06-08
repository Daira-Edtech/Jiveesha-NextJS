"use client";

import React from "react";
import { Search, Users, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EmptyStates = ({ type, searchTerm, onAddStudent }) => {
  if (type === "search") {
    return (
      <div className="col-span-full">
        <Card className="border-2 border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No students found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or add a new student
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (type === "empty") {
    return (
      <div className="col-span-full">
        <Card className="border-2 border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No students yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start by adding your first student to the class
              </p>
              <Button 
                onClick={onAddStudent}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default EmptyStates;
