import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const CourseCard = ({ course, assignmentCount, averageGrade, onEdit, onDelete }) => {
  const getGradeColor = (grade) => {
    if (grade >= 90) return "success";
    if (grade >= 80) return "info";
    if (grade >= 70) return "warning";
    return "error";
  };

  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
<h3 className="text-lg font-semibold text-gray-900">{course.name_c}</h3>
          <p className="text-sm text-gray-600">{course.code_c}</p>
        </div>
        
        <div 
className="w-4 h-4 rounded-full"
          style={{ backgroundColor: course.color_c }}
        />
      </div>
      
      <div className="space-y-3">
<div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Instructor</span>
          <span className="font-medium">{course.instructor_c}</span>
        </div>
        
<div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Credits</span>
          <span className="font-medium">{course.credits_c}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Assignments</span>
          <Badge variant="default">{assignmentCount || 0}</Badge>
        </div>
        
        {averageGrade !== null && averageGrade !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Average Grade</span>
            <Badge variant={getGradeColor(averageGrade)}>
              {averageGrade.toFixed(1)}%
            </Badge>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">
{course.semester_c} {course.year_c}
        </p>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(course)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Edit2" size={16} className="text-gray-400 hover:text-gray-600" />
          </button>
          
          <button
            onClick={() => onDelete(course.Id)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Trash2" size={16} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;