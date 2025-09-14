import React from 'react';
import { TAB_CONFIG, TabKey } from '../constants';

interface TabsProps {
  activeTab: TabKey;
  onTabClick: (tab: TabKey) => void;
  isLoading: boolean;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabClick, isLoading }) => {
  return (
    <div className="bg-slate-darker border-b border-slate-800 px-4 sm:px-6 lg:px-8">
        <nav className="-mb-px flex space-x-4 sm:space-x-6" aria-label="Tabs">
        {Object.entries(TAB_CONFIG).map(([key, config]) => {
            const isActive = activeTab === key;
            return (
            <button
                key={key}
                onClick={() => onTabClick(key as TabKey)}
                disabled={isLoading}
                className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2 focus:ring-offset-slate-darker rounded-t-sm
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                    isActive
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-slate-medium hover:text-slate-light hover:border-slate-500'
                }
                `}
                aria-current={isActive ? 'page' : undefined}
            >
                {config.label}
            </button>
            );
        })}
        </nav>
    </div>
  );
};

export default Tabs;