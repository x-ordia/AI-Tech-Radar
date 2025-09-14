import { streamNews, validateQuery, PromptConfig } from './geminiService';
import type { NewsArticle } from '../types';
import { TAB_CONFIG, TabKey } from '../constants';

type Subscriber = (state: NewsStoreState) => void;

export interface NewsStoreState {
  articles: NewsArticle[];
  isLoading: boolean;
  isFetchingMore: boolean;
  error: string | null;
  hasMore: boolean;
  activeTab: TabKey;
  customQuery: string;
  customQueryError: string | null;
}

class NewsStore {
  private state: NewsStoreState = {
    articles: [],
    isLoading: true,
    isFetchingMore: false,
    error: null,
    hasMore: true,
    activeTab: 'TECH',
    customQuery: '',
    customQueryError: null,
  };

  private subscribers: Subscriber[] = [];
  private isStreaming = false;

  public subscribe(callback: Subscriber): () => void {
    this.subscribers.push(callback);
    callback(this.state);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notify() {
    this.subscribers.forEach(callback => callback(this.state));
  }

  private setState(newState: Partial<NewsStoreState>) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }
  
  public getState(): NewsStoreState {
    return this.state;
  }

  public async fetchNews(isInitialLoad = false) {
    if (this.isStreaming || (!isInitialLoad && !this.state.hasMore)) return;

    this.isStreaming = true;

    // The main `isLoading` and `articles` reset is now handled by `setActiveTab` or `validateAndFetchCustomNews`.
    // This function only needs to manage the `isFetchingMore` state for subsequent ("load more") fetches.
    if (!isInitialLoad) {
      this.setState({ isFetchingMore: true, error: null });
    }

    const promptConfig: PromptConfig = {
        tabKey: this.state.activeTab,
        customQuery: this.state.activeTab === 'CUSTOM' ? this.state.customQuery : undefined,
        existingTitles: this.state.articles.map(a => a.title),
    };
    
    try {
      const articleGenerator = streamNews(promptConfig);
      let batchesReceived = 0;
      let articlesInThisFetch = 0;

      for await (const batch of articleGenerator) {
          articlesInThisFetch += batch.length;

          const newState: Partial<NewsStoreState> = {
            articles: [...this.state.articles, ...batch]
          };

          if (isInitialLoad && batchesReceived === 0) {
            // First sub-batch of an initial load has arrived.
            // Hide the main loader and show the bottom loader for subsequent sub-batches.
            newState.isLoading = false;
            newState.isFetchingMore = true;
          }
          
          this.setState(newState);
          batchesReceived++;
      }
      
      this.setState({
          hasMore: this.state.activeTab !== 'CUSTOM' && articlesInThisFetch >= 10,
      });

    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      this.setState({ error: message });
    } finally {
      this.isStreaming = false;
      this.setState({
          isLoading: false,
          isFetchingMore: false,
      });
    }
  }

  public setActiveTab(tab: TabKey) {
    if (this.state.activeTab === tab) return;

    this.isStreaming = false; // Reset the streaming lock
    // This method is now the single source of truth for resetting state on a tab change.
    this.setState({
      activeTab: tab,
      articles: [],
      error: null,
      customQueryError: null,
      hasMore: true,
      isLoading: tab !== 'CUSTOM', // Show loader immediately for non-custom tabs
    });

    if (tab !== 'CUSTOM') {
      this.fetchNews(true);
    }
  }

  public setCustomQuery(query: string) {
    this.setState({ customQuery: query, customQueryError: null });
  }

  public async validateAndFetchCustomNews() {
    if (this.isStreaming) return;

    this.setState({ isLoading: true, articles: [], error: null, customQueryError: null });

    const validation = await validateQuery(this.state.customQuery);
    if (validation.isValid) {
      this.fetchNews(true);
    } else {
      this.setState({
        customQueryError: validation.reason,
        isLoading: false,
      });
    }
  }
}

export const newsStore = new NewsStore();