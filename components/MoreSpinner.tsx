import React from 'react';

const MoreSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-3 my-8">
      <div className="w-6 h-6 border-2 border-slate-600 border-t-brand-secondary rounded-full animate-spin"></div>
      <p className="text-slate-medium text-sm">Loading more news...</p>
    </div>
  );
};

export default MoreSpinner;