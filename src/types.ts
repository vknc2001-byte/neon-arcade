export interface Game {
  id: string;
  title: string;
  category: string;
  gameTags?: string[];
  rating?: string;
  tag?: string;
  image: string;       // square/card thumbnail
  banner?: string;     // wide promotional banner (optional — only shown if set)
  isHot?: boolean;
  isNew?: boolean;
  description: string;
  publisher?: string;
  iframeUrl?: string;
  instructions?: string;
  tags?: string[];
  controls?: string;
}

export interface Score {
  rank: number;
  name: string;
  score: string;
}
