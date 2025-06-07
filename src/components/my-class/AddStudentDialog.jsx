"use client";

import React, { useState } from "react";
import { Users } from "lucide-react";
import { useAddChild } from "@/hooks/useChildren";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const AddStudentDialog = ({ open, onOpenChange, onAddStudent }) => {
  const [formData, setFormData] = useState({
    name: "",
    rollno: "",
    dateOfBirth: "",
    gender: "Male",
  });

  const { mutate: addChild, isPending } = useAddChild();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    addChild(formData, {
      onSuccess: (data) => {
        onAddStudent();
        setFormData({ name: "", rollno: "", dateOfBirth: "", gender: "Male" });
        onOpenChange(false);
      },
      onError: (error) => {
        console.error("Error adding student:", error);
        // You can add toast notification here
      },
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Add New Student
          </DialogTitle>
          <DialogDescription>
            Add a new student to your class. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student's full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rollno">Roll Number</Label>
            <Input
              id="rollno"
              name="rollno"
              value={formData.rollno}
              onChange={handleChange}
              placeholder="Enter roll number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? "Adding..." : "Add Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
