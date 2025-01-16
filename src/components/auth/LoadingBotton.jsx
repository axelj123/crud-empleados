'use client';
import React from 'react';

const LoadingButton = ({ 
  isLoading, 
  text = 'Submit', 
  loadingText = text,
  type = 'button',
  className = '',
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseStyles = "w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none relative";
  const loadingStyles = "opacity-70 cursor-not-allowed";
  
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      className={`${baseStyles} ${isLoading ? loadingStyles : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          <span>{loadingText}</span>
        </div>
      ) : (
        text
      )}
    </button>
  );
};

export default LoadingButton;