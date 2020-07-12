const HACKER_NEWS_URI = 'https://hacker-news.firebaseio.com/v0';

const DEFAULT_FETCH_OPTION: RequestInit = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
};

const cachedFetch = (url: string) => {
  const cacheKey = url;
  const cached = localStorage.getItem(cacheKey);
  const whenCached = localStorage.getItem(cacheKey + ':ts');
  const hasCacheMatch = cached !== null && whenCached !== null;

  return fetch(url, DEFAULT_FETCH_OPTION)
    .then((response) => {
      if (response.ok) {
        // If we don't clone the response,
        // it will be consumed by the time it's returned.
        response
          .clone()
          .text()
          .then((content) => {
            // save new cache result
            localStorage.setItem(cacheKey, content);
            localStorage.setItem(cacheKey + ':ts', String(Date.now()));

            // if there was previous cache result, delete it
            if (hasCacheMatch) {
              localStorage.removeItem(cacheKey);
              localStorage.removeItem(cacheKey + ':ts');
            }
          });
        return response.json();
      } else if (hasCacheMatch) {
        const response = JSON.parse(cached!);
        return Promise.resolve(response);
      }

      throw new Error(`Impossible to fetch "${url}"`);
    })
    .catch((error) => {
      if (hasCacheMatch) {
        const response = JSON.parse(cached!);
        return Promise.resolve(response);
      }

      throw error;
    });
};

export const readStoriesIndex = async () => {
  return cachedFetch(`${HACKER_NEWS_URI}/newstories.json`);
};

export const readItem = async (id: number) => {
  return cachedFetch(`${HACKER_NEWS_URI}/item/${id}.json`);
};
