import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="AlertCircle" size={32} className="text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{message}</p>
        </div>
        
        {onRetry && (
          <Button onClick={onRetry} className="mb-4">
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}
        
        <p className="text-sm text-gray-500">
          If the problem persists, please check your internet connection or try refreshing the page.
        </p>
      </div>
    </div>
  );
};

export default Error;