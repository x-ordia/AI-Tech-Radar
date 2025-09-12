
import React from 'react';
import type { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const { title, summary, sourceUrl, sourceTitle } = article;

  return (
    <div className="bg-slate-dark border border-slate-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 animate-fade-in">
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-light mb-2">{title}</h3>
        <p className="text-slate-medium text-base mb-4">{summary}</p>
        <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-brand-secondary bg-brand-secondary/20 px-2 py-1 rounded">
                {sourceTitle || 'Source'}
            </span>
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
  );
};

export default NewsCard;
