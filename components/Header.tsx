import React from 'react';

interface HeaderProps {
  onFaqClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onFaqClick }) => {
  return (
    <header className="bg-slate-darker p-4 sm:p-6 shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L12 5" />
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 19L12 22" />
               <path strokeLinecap="round" strokeLinejoin="round" d="M5 12L2 12" />
               <path strokeLinecap="round" strokeLinejoin="round" d="M22 12L19 12" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-light tracking-tight">AI Tech Radar</h1>
        </div>
        <button
          onClick={onFaqClick}
          className="inline-flex items-center justify-center sm:justify-start px-3 py-2 sm:px-4 border border-slate-700 text-sm font-medium rounded-md text-slate-light bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-darker focus:ring-brand-secondary transition-colors"
          aria-label="Open Frequently Asked Questions"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="hidden sm:inline">FAQ</span>
        </button>
      </div>
    </header>
  );
};

export default Header;