
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-darker p-6 shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center space-x-4">
        <div className="p-2 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L12 5" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 19L12 22" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M5 12L2 12" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M22 12L19 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-light tracking-tight">AI Tech Radar</h1>
      </div>
    </header>
  );
};

export default Header;
