import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const AssignmentModal = ({ isOpen, onClose, onSave, assignment, courses = [] }) => {
const [formData, setFormData] = useState({
    title_c: "",
    course_id_c: "",
    description_c: "",
    due_date_c: "",
    priority_c: "medium",
    max_points_c: 100
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (assignment) {
setFormData({
        title_c: assignment.title_c || "",
        course_id_c: assignment.course_id_c?.Id || assignment.course_id_c || "",
        description_c: assignment.description_c || "",
        due_date_c: assignment.dueDate ? format(assignment.dueDate, "yyyy-MM-dd") : "",
        priority_c: assignment.priority_c || "medium",
        max_points_c: assignment.max_points_c || 100
      });
    } else {
setFormData({
        title_c: "",
        course_id_c: "",
        description_c: "",
        due_date_c: "",
        priority_c: "medium",
        max_points_c: 100
      });
    }
    setErrors({});
  }, [assignment, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
if (!formData.title_c.trim()) {
      newErrors.title_c = "Title is required";
    }
    
    if (!formData.course_id_c) {
      newErrors.course_id_c = "Course is required";
    }
    
    if (!formData.due_date_c) {
      newErrors.due_date_c = "Due date is required";
    }
    
    if (formData.max_points_c <= 0) {
      newErrors.max_points_c = "Max points must be greater than 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
const assignmentData = {
      ...formData,
      dueDate: new Date(formData.due_date_c),
      max_points_c: parseInt(formData.max_points_c),
      completed_c: assignment?.completed_c || false,
      grade_c: assignment?.grade_c || null,
      created_at_c: assignment?.created_at_c || new Date().toISOString()
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
value={formData.title_c}
            onChange={(e) => handleChange("title_c", e.target.value)}
            error={errors.title_c}
            placeholder="Enter assignment title"
          />
          
          <Select
            label="Course"
value={formData.course_id_c}
            onChange={(e) => handleChange("course_id_c", e.target.value)}
            error={errors.course_id_c}
          >
            <option value="">Select a course</option>
            {courses.map(course => (
<option key={course.Id} value={course.Id}>
                {course.code_c} - {course.name_c}
              </option>
            ))}
          </Select>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
value={formData.description_c}
              onChange={(e) => handleChange("description_c", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              placeholder="Enter assignment description (optional)"
            />
          </div>
          
          <Input
            label="Due Date"
            type="date"
value={formData.due_date_c}
            onChange={(e) => handleChange("due_date_c", e.target.value)}
            error={errors.due_date_c}
          />
          
          <Select
            label="Priority"
value={formData.priority_c}
            onChange={(e) => handleChange("priority_c", e.target.value)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
          
          <Input
            label="Max Points"
            type="number"
value={formData.max_points_c}
            onChange={(e) => handleChange("max_points_c", e.target.value)}
            error={errors.max_points_c}
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