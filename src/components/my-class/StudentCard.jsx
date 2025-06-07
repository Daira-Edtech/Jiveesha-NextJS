"use client";

import React from "react";
import { Calendar, Hash } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const StudentCard = ({ student, onStudentClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-400"
      onClick={() => onStudentClick(student)}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="w-16 h-16 border-2 border-blue-200 group-hover:border-blue-400 transition-colors">
            <AvatarImage src={student.imageUrl} alt={student.name} />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
              {getInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
              {student.name}
            </h3>
            <p className="text-sm text-gray-500">Roll: {student.rollno}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Age
            </span>
            <Badge variant="secondary">{getAge(student.dateOfBirth)} years</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Hash className="w-4 h-4" />
              Tests Taken
            </span>
            <Badge variant="outline">{student.testsTaken || 0}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Gender</span>
            <span className="text-gray-800 font-medium">{student.gender}</span>
          </div>
        </div>
        <Button 
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onStudentClick(student);
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
