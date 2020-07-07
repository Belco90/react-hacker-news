const HACKER_NEWS_URI = 'https://hacker-news.firebaseio.com/v0';

export const readStoriesIndex = async () => {
  const resp = await fetch(`${HACKER_NEWS_URI}/newstories.json`);

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error('Something went wrong fetching new stories');
};

export const readItem = async (id: number) => {
  const resp = await fetch(`${HACKER_NEWS_URI}/item/${id}.json`);

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error(`Something went wrong fetching item ${id}`);
};
