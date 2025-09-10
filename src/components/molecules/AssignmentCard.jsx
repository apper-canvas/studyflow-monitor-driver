import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Checkbox from "@/components/atoms/Checkbox";
import ApperIcon from "@/components/ApperIcon";
import { format, isToday, isTomorrow, isYesterday, isPast } from "date-fns";
import { cn } from "@/utils/cn";

const AssignmentCard = ({ assignment, course, onToggleComplete, onEdit, onDelete }) => {
  const formatDueDate = (date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
  };

const isDue = isPast(assignment.dueDate) && !assignment.completed_c;
  const isUpcoming = !isPast(assignment.dueDate);

  const priorityColors = {
    high: "high",
    medium: "medium", 
    low: "low"
  };

  return (
<Card className={cn(
      "p-4 transition-all duration-200",
      assignment.completed_c && "opacity-60",
      isDue && !assignment.completed_c && "border-l-4 border-red-500"
    )}>
      <div className="flex items-start space-x-3">
<Checkbox
          checked={assignment.completed_c}
          onChange={(e) => onToggleComplete(assignment.Id, e.target.checked)}
          className="mt-0.5"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
<h3 className={cn(
                "font-semibold text-gray-900",
                assignment.completed_c && "line-through text-gray-500"
              )}>
                {assignment.title_c}
              </h3>
              
<p className="text-sm text-gray-600 mt-1">
                {course?.name_c} • {course?.code_c}
              </p>
              
{assignment.description_c && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {assignment.description_c}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
<Badge variant={priorityColors[assignment.priority_c]}>
                {assignment.priority_c}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="Calendar" size={14} className="mr-1" />
<span className={cn(
                isDue && !assignment.completed_c && "text-red-600 font-medium"
              )}>
                Due {formatDueDate(assignment.dueDate)}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
{assignment.grade_c !== null && assignment.grade_c !== undefined && (
                <span className="text-sm font-medium text-green-600">
                  {assignment.grade_c}/{assignment.max_points_c}
                </span>
              )}
              
              <button
                onClick={() => onEdit(assignment)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="Edit2" size={14} className="text-gray-400 hover:text-gray-600" />
              </button>
              
              <button
                onClick={() => onDelete(assignment.Id)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="Trash2" size={14} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AssignmentCard;