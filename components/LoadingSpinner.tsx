
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-16 animate-fade-in">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-brand-secondary rounded-full animate-spin"></div>
        <p className="text-slate-medium text-lg font-semibold">Analyzing the latest tech trends...</p>
    </div>
  );
};

export default LoadingSpinner;
