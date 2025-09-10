import React from "react";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ 
  selectedCourse, 
  onCourseChange, 
  selectedPriority, 
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  courses = [],
  onClearFilters,
  activeFiltersCount = 0
}) => {
  return (
    <div className="bg-white rounded-lg p-4 card-shadow mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select
            value={selectedCourse}
            onChange={(e) => onCourseChange(e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course.Id} value={course.Id}>
                {course.code} - {course.name}
              </option>
            ))}
          </Select>
        </div>
        
        <div className="flex-1">
          <Select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </Select>
        </div>
        
        <div className="flex-1">
          <Select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </Select>
        </div>
        
        {activeFiltersCount > 0 && (
          <div className="flex items-center space-x-2">
            <Badge variant="info">
              {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""}
            </Badge>
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <ApperIcon name="X" size={14} className="mr-1" />
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;