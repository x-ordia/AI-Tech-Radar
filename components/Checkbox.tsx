
import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  const id = `checkbox-${label.replace(/\s+/g, '-')}`;

  return (
    <label htmlFor={id} className="flex items-center space-x-3 cursor-pointer group">
      <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${checked ? 'bg-brand-primary border-brand-primary' : 'bg-slate-800 border-slate-600 group-hover:border-brand-secondary'}`}>
        {checked && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-sm font-medium transition-colors duration-200 ${checked ? 'text-slate-light' : 'text-slate-medium group-hover:text-slate-light'}`}>
        {label}
      </span>
    </label>
  );
};

export default Checkbox;
