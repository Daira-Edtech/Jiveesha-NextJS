"use client";

import React from "react";
import { User, Calendar, Hash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const StudentDetailsDialog = ({ student, open, onOpenChange }) => {
  if (!student) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Student Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Student Avatar and Basic Info */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24 border-4 border-blue-200">
              <AvatarImage src={student.imageUrl} alt={student.name} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-xl">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
              <p className="text-gray-600">Roll Number: {student.rollno}</p>
            </div>
          </div>

          {/* Student Information Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="text-2xl font-bold text-gray-800">{getAge(student.dateOfBirth)}</p>
                  <p className="text-xs text-gray-500">years old</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <Hash className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Tests Taken</p>
                  <p className="text-2xl font-bold text-gray-800">{student.testsTaken || 0}</p>
                  <p className="text-xs text-gray-500">completed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Gender</span>
              <Badge variant="secondary">{student.gender}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Date of Birth</span>
              <span className="text-gray-800">{formatDate(student.dateOfBirth)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Joined</span>
              <span className="text-gray-800">{formatDate(student.createdAt)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              Take Test
            </Button>
            <Button variant="outline" className="flex-1">
              View Reports
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsDialog;
