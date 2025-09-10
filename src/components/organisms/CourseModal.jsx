import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const CourseModal = ({ isOpen, onClose, onSave, course }) => {
const [formData, setFormData] = useState({
    name_c: "",
    code_c: "",
    instructor_c: "",
    credits_c: 3,
    color_c: "#6366f1",
    semester_c: "Fall",
    year_c: new Date().getFullYear()
  });

  const [errors, setErrors] = useState({});

  const colors = [
    "#6366f1", "#8b5cf6", "#f59e0b", "#ef4444", 
    "#10b981", "#3b82f6", "#f97316", "#84cc16"
  ];

  useEffect(() => {
    if (course) {
setFormData({
        name_c: course.name_c || "",
        code_c: course.code_c || "",
        instructor_c: course.instructor_c || "",
        credits_c: course.credits_c || 3,
        color_c: course.color_c || "#6366f1",
        semester_c: course.semester_c || "Fall",
        year_c: course.year_c || new Date().getFullYear()
      });
    } else {
      setFormData({
        name: "",
        code: "",
        instructor: "",
        credits: 3,
        color: "#6366f1",
        semester: "Fall",
        year: new Date().getFullYear()
      });
    }
    setErrors({});
  }, [course, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
if (!formData.name_c.trim()) {
      newErrors.name_c = "Course name is required";
    }
    
    if (!formData.code_c.trim()) {
      newErrors.code_c = "Course code is required";
    }
    
    if (!formData.instructor_c.trim()) {
      newErrors.instructor_c = "Instructor name is required";
    }
    
    if (formData.credits_c <= 0) {
      newErrors.credits_c = "Credits must be greater than 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
const courseData = {
      ...formData,
      credits_c: parseInt(formData.credits_c),
      year_c: parseInt(formData.year_c)
    };
    
    onSave(courseData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {course ? "Edit Course" : "Add Course"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="X" size={20} className="text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
label="Course Name"
            value={formData.name_c}
            onChange={(e) => handleChange("name_c", e.target.value)}
            error={errors.name_c}
            placeholder="e.g., Introduction to Computer Science"
          />
          
<Input
            label="Course Code"
            value={formData.code_c}
            onChange={(e) => handleChange("code_c", e.target.value)}
            error={errors.code_c}
            placeholder="e.g., CS 101"
          />
          
<Input
            label="Instructor"
            value={formData.instructor_c}
            onChange={(e) => handleChange("instructor_c", e.target.value)}
            error={errors.instructor_c}
            placeholder="e.g., Prof. Johnson"
          />
          
<Input
            label="Credits"
            type="number"
            value={formData.credits_c}
            onChange={(e) => handleChange("credits_c", e.target.value)}
            error={errors.credits_c}
            min="1"
            max="6"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
onClick={() => handleChange("color_c", color)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all ${
                    formData.color_c === color ? "border-gray-400 scale-110" : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
<Select
              label="Semester"
              value={formData.semester_c}
              onChange={(e) => handleChange("semester_c", e.target.value)}
            >
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
            </Select>
            
<Input
              label="Year"
              type="number"
              value={formData.year_c}
              onChange={(e) => handleChange("year_c", e.target.value)}
              min="2020"
              max="2030"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="gradient-bg text-white">
              {course ? "Update" : "Create"} Course
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;