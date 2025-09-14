import React, { useState } from 'react';

interface FAQPageProps {
  onBackClick: () => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ onBackClick }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setOpenSection(prevOpenSection => (prevOpenSection === sectionId ? null : sectionId));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="mb-8">
        <button
          onClick={onBackClick}
          className="inline-flex items-center font-semibold text-brand-primary hover:text-brand-secondary transition-colors duration-200 group"
          aria-label="Go back to the main page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to News
        </button>
      </div>

      <div className="bg-slate-dark border border-slate-800 rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-light mb-6 border-b border-slate-700 pb-4">Frequently Asked Questions</h1>
        
        <div className="space-y-4">
          {/* FAQ 1: Source Links */}
          <div>
            <button
              onClick={() => toggleSection('source-links')}
              aria-expanded={openSection === 'source-links'}
              aria-controls="faq-answer-1"
              className="w-full flex justify-between items-center text-left p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2 focus:ring-offset-slate-dark transition-colors duration-200"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-brand-secondary">Why do I sometimes get a "Not Found" error on source links?</h2>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-slate-400 transform transition-transform duration-300 ${openSection === 'source-links' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openSection === 'source-links' && (
              <div id="faq-answer-1" className="mt-4 px-4 pb-4 animate-fade-in">
                <p className="text-slate-medium leading-relaxed mb-4">
                  The app correctly fetches and displays the exact source link provided by the AI. However, the dynamic nature of the web means that a link which was valid one moment can become invalid the next. This isn't a bug, but a reflection of how the live internet works.
                </p>
                <p className="text-slate-light leading-relaxed font-medium mb-4">
                  Here are the most common reasons:
                </p>
                <ul className="list-disc list-inside space-y-4 text-slate-medium">
                  <li>
                    <strong className="text-slate-light">The Web is Volatile:</strong> News organizations might update an article and change its URL, restructure their website, or delete old content entirely. The link the AI found was valid at the moment of its search but became a dead link seconds later.
                  </li>
                  <li>
                    <strong className="text-slate-light">Search Index Latency:</strong> The AI uses a snapshot of Google's search index. It's possible for the AI to find a link to a page that was taken down just moments before the index was updated.
                  </li>
                  <li>
                    <strong className="text-slate-light">Paywalls and Access Restrictions:</strong> The link might be valid, but the content is inaccessible to you. The AI's web crawler may have access to subscriber-only content that a regular user cannot view.
                  </li>
                </ul>
                <p className="mt-6 p-4 bg-slate-darker border border-brand-primary/30 rounded-lg text-slate-light text-sm">
                    <strong>Our Recommendation:</strong> If a link fails, always use the search icon (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block -mt-1 mx-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    ) next to 'Read More'. This performs a fresh Google search and is the most reliable way to find the story.
                </p>
              </div>
            )}
          </div>

          {/* FAQ 2: Loading Time */}
          <div>
            <button
              onClick={() => toggleSection('loading-time')}
              aria-expanded={openSection === 'loading-time'}
              aria-controls="faq-answer-2"
              className="w-full flex justify-between items-center text-left p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2 focus:ring-offset-slate-dark transition-colors duration-200"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-brand-secondary">Why isn't the news feed instant? What's happening in the background?</h2>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-slate-400 transform transition-transform duration-300 ${openSection === 'loading-time' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openSection === 'loading-time' && (
              <div id="faq-answer-2" className="mt-4 px-4 pb-4 animate-fade-in">
                <p className="text-slate-medium leading-relaxed mb-4">
                  Unlike a traditional news app that just pulls articles from a database, AI Tech Radar acts as your real-time research assistant. When you select a topic, you're kicking off a sophisticated, live process powered by the Gemini AI.
                </p>
                <p className="text-slate-light leading-relaxed font-medium mb-4">
                  Here's a breakdown of what happens in those few seconds:
                </p>
                <ul className="list-disc list-inside space-y-4 text-slate-medium">
                  <li>
                    <strong className="text-slate-light">Live Web Search:</strong> The AI performs a fresh, targeted search across the internet to find the most up-to-the-minute information related to your query.
                  </li>
                  <li>
                    <strong className="text-slate-light">Relevance Analysis:</strong> It intelligently sifts through the search results, discarding noise and identifying articles, technical blog posts, and research papers that are genuinely relevant.
                  </li>
                  <li>
                    <strong className="text-slate-light">Recency Verification:</strong> A critical step is filtering these results to ensure they are from the last 48 hours. This guarantees you're seeing cutting-edge developments, not old news.
                  </li>
                  <li>
                    <strong className="text-slate-light">Intelligent Summarization:</strong> Finally, the AI reads and understands the most important sources and then writes the concise, technical summaries that appear on the cards.
                  </li>
                </ul>
                <p className="mt-6 p-4 bg-slate-darker border border-brand-primary/30 rounded-lg text-slate-light text-sm">
                  <strong>In Short:</strong> The loading time reflects a powerful AI actively researching, filtering, and summarizing the web for you in real-time. The result is a highly-curated intelligence briefing, not just a simple list of links.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;