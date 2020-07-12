export interface HackerNewsStory {
  id: number;
  by: string;
  descendants: number;
  kids?: Array<number>;
  score: number;
  time: number;
  title: string;
  type: 'story';
  url: string;
}
