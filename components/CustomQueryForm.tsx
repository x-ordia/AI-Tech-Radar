import React from 'react';

interface CustomQueryFormProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  error: string | null;
}

const CustomQueryForm: React.FC<CustomQueryFormProps> = ({ query, onQueryChange, onSearch, isLoading, error }) => {
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoading) {
      onSearch();
    }
  };

  return (
    <div className="bg-slate-dark border-b border-slate-800 p-4 sm:p-6 lg:p-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <label htmlFor="custom-query" className="block text-sm font-medium text-slate-light mb-2">
            Enter a tech topic to research
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative flex-grow w-full">
            <input
              id="custom-query"
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              maxLength={50}
              placeholder="e.g., 'advancements in vector databases'"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-slate-800 text-slate-light border-2 border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 disabled:opacity-50"
              aria-describedby="query-error"
            />
             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                {query.length} / 50
            </span>
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && (
            <p id="query-error" className="text-red-400 text-sm mt-3 animate-fade-in" role="alert">
                <span className="font-semibold">Validation Error:</span> {error}
            </p>
        )}
      </form>
    </div>
  );
};

export default CustomQueryForm;
