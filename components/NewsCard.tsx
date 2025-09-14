import React from 'react';
import type { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const { title, summary, sourceUrl, sourceTitle } = article;

  return (
    <div className="bg-slate-dark border border-slate-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 animate-fade-in">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-light mb-2">{title}</h3>
        <p className="text-slate-medium text-sm sm:text-base mb-4">{summary}</p>
        <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-brand-secondary bg-brand-secondary/20 px-2 py-1 rounded">
                {sourceTitle || 'Source'}
            </span>
            <div className="flex items-center space-x-4">
                <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Search for this title on Google if the direct link fails"
                    aria-label="Search for this title on Google"
                    className="text-slate-medium hover:text-brand-primary transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </a>
                <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-semibold text-brand-primary hover:text-brand-secondary transition-colors duration-200 group"
                >
                Read More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;