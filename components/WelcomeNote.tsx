import React, { useState, useEffect } from 'react';

const WelcomeNote: React.FC = () => {
  const [show, setShow] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Show the modal and lock body scroll
    setShow(true);
    document.body.style.overflow = 'hidden';

    return () => {
      // Ensure body scroll is restored if component unmounts
      document.body.style.overflowY = 'scroll';
    };
  }, []);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setShow(false);
      document.body.style.overflowY = 'scroll';
    }, 500); // This duration must match the CSS transition duration
  };

  if (!show) {
    return null;
  }

  return (
    <div
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-note-title"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-darker/75 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-11/12 max-w-md p-6 bg-slate-dark border-2 border-brand-secondary/50 rounded-lg shadow-2xl transform transition-all duration-500 ease-in-out ${isFadingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      >
        <button
          onClick={handleClose}
          aria-label="Close welcome note"
          className="absolute top-3 right-3 p-1 text-slate-500 hover:text-slate-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex items-start space-x-4">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 id="welcome-note-title" className="text-lg font-bold text-slate-light mb-2">A Note on Source Links</h4>
            <p className="text-slate-medium text-sm leading-relaxed">
              The AI provides a source link for each summary. Sometimes, a link might not work if it points to a copied article or if the original page has changed.
            </p>
            <p className="text-slate-light text-sm mt-3 font-semibold">
              If a link fails, use the search icon (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block -mt-1 mx-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              ) next to 'Read More'. It's the most reliable way to find the original story.
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-dark focus:ring-brand-primary"
        >
          Got It
        </button>
      </div>
    </div>
  );
};

export default WelcomeNote;
