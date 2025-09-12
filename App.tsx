import React, { useState, useCallback, useEffect, useRef } from 'react';
import { newsStore, NewsStoreState } from './services/newsStore';
import { TabKey } from './constants';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import LoadingSpinner from './components/LoadingSpinner';
import Tabs from './components/Tabs';
import CustomQueryForm from './components/CustomQueryForm';
import MoreSpinner from './components/MoreSpinner';

const App: React.FC = () => {
  const [storeState, setStoreState] = useState<NewsStoreState>(newsStore.getState());
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreRef = useCallback((node: HTMLDivElement) => {
    if (storeState.isLoading || storeState.isFetchingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && storeState.hasMore) {
        newsStore.fetchNews(false);
      }
    });

    if (node) observer.current.observe(node);
  }, [storeState.isLoading, storeState.isFetchingMore, storeState.hasMore]);

  useEffect(() => {
    const unsubscribe = newsStore.subscribe(setStoreState);
    newsStore.fetchNews(true);
    return () => unsubscribe();
  }, []);

  const handleTabClick = (tab: TabKey) => {
    newsStore.setActiveTab(tab);
  };

  const handleCustomQueryChange = (query: string) => {
    newsStore.setCustomQuery(query);
  };

  const handleCustomSearch = () => {
    newsStore.validateAndFetchCustomNews();
  };
  
  const { articles, isLoading, isFetchingMore, error, hasMore, activeTab, customQuery, customQueryError } = storeState;

  const renderContent = () => {
    if (isLoading && articles.length === 0) return <LoadingSpinner />;
    
    if (error && articles.length === 0) {
      return (
        <div className="text-center my-16 bg-red-900/50 text-red-300 p-6 rounded-lg border border-red-700 animate-fade-in">
          <h3 className="text-xl font-bold mb-2">An Error Occurred</h3>
          <p>{error}</p>
        </div>
      );
    }
    
    if (activeTab === 'CUSTOM' && !isLoading && articles.length === 0 && !error) {
        return (
            <div className="text-center my-16 text-slate-medium animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-slate-light mt-4 mb-2">Custom Search</h3>
              <p>Enter a technical topic above to find the latest news.</p>
            </div>
        );
    }

    if (!isLoading && articles.length === 0) {
      return (
        <div className="text-center my-16 text-slate-medium animate-fade-in">
          <h3 className="text-2xl font-bold text-slate-light mb-2">No News Found</h3>
          <p>Try adjusting your query or selecting another tab.</p>
        </div>
      );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => {
            if (articles.length > 3 && index === articles.length - 3) {
              return <div ref={loadMoreRef} key={`${article.title}-${index}`}><NewsCard article={article} /></div>
            }
            return <NewsCard key={`${article.title}-${index}`} article={article} />
          })}
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-darker text-slate-light font-sans">
      <Header />
      <Tabs activeTab={activeTab} onTabClick={handleTabClick} isLoading={isLoading} />
      {activeTab === 'CUSTOM' && (
        <CustomQueryForm
          query={customQuery}
          onQueryChange={handleCustomQueryChange}
          onSearch={handleCustomSearch}
          isLoading={isLoading}
          error={customQueryError}
        />
      )}
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        {renderContent()}
        {isFetchingMore && <MoreSpinner />}
        {!isLoading && !isFetchingMore && !hasMore && articles.length > 0 && (
           <p className="text-center text-slate-medium my-8">You've reached the end!</p>
        )}
      </main>
    </div>
  );
};

export default App;
