
export interface NewsArticle {
  title: string;
  summary: string;
  sourceUrl: string;
  sourceTitle: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}
