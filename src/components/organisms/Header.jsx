import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ title, onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
          >
            <ApperIcon name="Menu" size={20} className="text-gray-600" />
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center text-sm text-gray-600">
            <ApperIcon name="Calendar" size={16} className="mr-2" />
            {new Date().toLocaleDateString("en-US", { 
              weekday: "long", 
              month: "long", 
              day: "numeric" 
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;