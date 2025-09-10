import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  className, 
  checked, 
  onChange,
  label,
  ...props 
}, ref) => {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            "w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200",
            checked 
              ? "bg-primary-500 border-primary-500" 
              : "border-gray-300 hover:border-primary-300",
            className
          )}
        >
          {checked && (
            <ApperIcon name="Check" size={12} className="text-white" />
          )}
        </div>
      </div>
      {label && (
        <span className="ml-3 text-sm text-gray-700">{label}</span>
      )}
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;