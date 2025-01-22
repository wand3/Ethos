// ErrorComponent.tsx
import React from 'react';

interface ErrorComponentProps {
  error: string | null; // The error message to display
  onRetry?: () => void; // Optional retry callback function
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error, onRetry }) => {
  if (!error) return null; // If there's no error, render nothing

  return (
    <div className="p-4 bg-red-100 border border-red-400 rounded-lg text-red-700 items-center max-w-md mx-auto mt-4">
      <p className="m-0 text-center text-sm ">{error}</p>
      {/* {onRetry && (
        <button 
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          onClick={onRetry}
        >
          Retry
        </button>
      )} */}
    </div>
  );
};

export default ErrorComponent;
