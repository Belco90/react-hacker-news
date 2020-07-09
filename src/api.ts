const HACKER_NEWS_URI = 'https://hacker-news.firebaseio.com/v0';

const DEFAULT_FETCH_OPTION: RequestInit = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
};

const cachedFetch = (url: string) => {
  const expiry = 5 * 60; // 5 min default
  const cacheKey = url;
  const cached = localStorage.getItem(cacheKey);
  const whenCached = localStorage.getItem(cacheKey + ':ts');

  if (cached !== null && whenCached !== null) {
    // it was in sessionStorage
    const age = (Date.now() - Number(whenCached)) / 1000;

    // TODO: check if offline to return cached value too
    if (age < expiry) {
      const response = JSON.parse(cached);
      return Promise.resolve(response);
    } else {
      // Clean up this old key
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(cacheKey + ':ts');
    }
  }

  return fetch(url, DEFAULT_FETCH_OPTION).then((response) => {
    if (response.ok) {
      // There is a .json() instead of .text() but
      // we're going to store it in sessionStorage as
      // string anyway.
      // If we don't clone the response, it will be
      // consumed by the time it's returned. This
      // way we're being un-intrusive.
      response
        .clone()
        .text()
        .then((content) => {
          localStorage.setItem(cacheKey, content);
          localStorage.setItem(cacheKey + ':ts', String(Date.now()));
        });
    }
    return response.json();
  });
};

export const readStoriesIndex = async () => {
  return cachedFetch(`${HACKER_NEWS_URI}/newstories.json`);
};

export const readItem = async (id: number) => {
  return cachedFetch(`${HACKER_NEWS_URI}/item/${id}.json`);
};
