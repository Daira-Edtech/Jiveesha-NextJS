"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Hash } from "lucide-react";

const StudentListItem = ({
  student,
  buttonLabel,
  onButtonClick,
  buttonClassName = "bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition",
  score = 0,
}) => {
  const getAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12 border-2 border-blue-200">
              <AvatarImage src={student.imageUrl} alt={student.name} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800">
                {student.name}
              </h3>
              <div className="flex items-center space-x-4">
                {" "}
                <p className="text-sm text-gray-500">Roll: {student.rollno}</p>
                <span className="text-sm text-gray-500">
                  Gender : {student.gender}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{getAge(student.dateOfBirth)} years</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            className={buttonClassName}
            onClick={() => onButtonClick(student)}
          >
            {buttonLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentListItem;
