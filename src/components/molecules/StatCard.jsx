import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ icon, title, value, subtitle, trend, color = "primary" }) => {
  const colorClasses = {
    primary: "text-primary-500 bg-primary-100",
    success: "text-green-500 bg-green-100",
    warning: "text-amber-500 bg-amber-100",
    danger: "text-red-500 bg-red-100",
    info: "text-blue-500 bg-blue-100"
  };

  return (
    <Card className="p-6 hover:card-shadow-hover transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={cn("p-2 rounded-lg", colorClasses[color])}>
          <ApperIcon name={icon} size={20} />
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center text-xs">
            <ApperIcon 
              name={trend.direction === "up" ? "TrendingUp" : "TrendingDown"} 
              size={12} 
              className={cn("mr-1", trend.direction === "up" ? "text-green-500" : "text-red-500")}
            />
            <span className={cn(trend.direction === "up" ? "text-green-500" : "text-red-500")}>
              {trend.value}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;