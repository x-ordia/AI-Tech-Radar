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
    let articlesFetchedInStream = 0;

    if (isInitialLoad) {
      this.setState({
        isLoading: true,
        hasMore: true,
        articles: [],
        error: null,
      });
    } else {
      this.setState({ isFetchingMore: true, error: null });
    }

    const promptConfig: PromptConfig = {
        tabKey: this.state.activeTab,
        customQuery: this.state.activeTab === 'CUSTOM' ? this.state.customQuery : undefined,
        existingTitles: isInitialLoad ? [] : this.state.articles.map(a => a.title),
    };
    
    streamNews(promptConfig, {
      onArticle: (article) => {
        if (!this.state.articles.some(a => a.title === article.title)) {
            articlesFetchedInStream++;
            this.setState({
              articles: [...this.state.articles, article]
            });
        }
      },
      onSources: () => {},
      onComplete: () => {
        this.isStreaming = false;
        this.setState({
          isLoading: false,
          isFetchingMore: false,
          hasMore: this.state.activeTab !== 'CUSTOM' && articlesFetchedInStream === 10,
        });
      },
      onError: (err) => {
        this.isStreaming = false;
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        this.setState({
          error: message,
          isLoading: false,
          isFetchingMore: false,
        });
      }
    });
  }

  public setActiveTab(tab: TabKey) {
    if (this.state.activeTab === tab) return;

    this.isStreaming = false; // Cancel any ongoing stream
    this.setState({
      activeTab: tab,
      articles: [],
      error: null,
      customQueryError: null,
      hasMore: true,
      isLoading: tab !== 'CUSTOM',
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