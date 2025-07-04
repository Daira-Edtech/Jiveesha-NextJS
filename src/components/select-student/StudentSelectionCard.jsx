"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const StudentSelectionCard = ({ student, onSelect }) => {
  const { t } = useLanguage();
  
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
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-400 animate-slideInUp"
      onClick={() => onSelect(student)}
    >
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-20 h-20 border-4 border-blue-200 group-hover:border-blue-400 transition-colors">
            <AvatarImage src={student.imageUrl} alt={student.name} />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-lg">
              {getInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-xl text-gray-800 group-hover:text-blue-600 transition-colors">
              {student.name}
            </h3>
            <p className="text-sm text-gray-500">{t('labelRoll')}: {student.rollno}</p>
          </div>

          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('labelAge')}</span>
              <Badge variant="secondary">{t('labelYears', { count: getAge(student.dateOfBirth) })}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('labelGender')}</span>
              <span className="text-gray-800 font-medium">{student.gender}</span>
            </div>
          </div>

          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(student);
            }}
          >
            {t('selectStudentButton') || 'Select Student'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentSelectionCard;
