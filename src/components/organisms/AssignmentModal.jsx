import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const AssignmentModal = ({ isOpen, onClose, onSave, assignment, courses = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    description: "",
    dueDate: "",
    priority: "medium",
    maxPoints: 100
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || "",
        courseId: assignment.courseId || "",
        description: assignment.description || "",
        dueDate: assignment.dueDate ? format(assignment.dueDate, "yyyy-MM-dd") : "",
        priority: assignment.priority || "medium",
        maxPoints: assignment.maxPoints || 100
      });
    } else {
      setFormData({
        title: "",
        courseId: "",
        description: "",
        dueDate: "",
        priority: "medium",
        maxPoints: 100
      });
    }
    setErrors({});
  }, [assignment, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.courseId) {
      newErrors.courseId = "Course is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    
    if (formData.maxPoints <= 0) {
      newErrors.maxPoints = "Max points must be greater than 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const assignmentData = {
      ...formData,
      dueDate: new Date(formData.dueDate),
      maxPoints: parseInt(formData.maxPoints),
      completed: assignment?.completed || false,
      grade: assignment?.grade || null,
      createdAt: assignment?.createdAt || new Date()
    };
    
    onSave(assignmentData);
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
            {assignment ? "Edit Assignment" : "Add Assignment"}
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
            label="Assignment Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={errors.title}
            placeholder="Enter assignment title"
          />
          
          <Select
            label="Course"
            value={formData.courseId}
            onChange={(e) => handleChange("courseId", e.target.value)}
            error={errors.courseId}
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.Id} value={course.Id}>
                {course.code} - {course.name}
              </option>
            ))}
          </Select>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              placeholder="Enter assignment description (optional)"
            />
          </div>
          
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            error={errors.dueDate}
          />
          
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
          
          <Input
            label="Max Points"
            type="number"
            value={formData.maxPoints}
            onChange={(e) => handleChange("maxPoints", e.target.value)}
            error={errors.maxPoints}
            min="1"
            placeholder="100"
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="gradient-bg text-white">
              {assignment ? "Update" : "Create"} Assignment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentModal;