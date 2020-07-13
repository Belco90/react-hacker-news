/**  * @jest-environment jsdom-sixteen  */
import { setupServer } from 'msw/node';
import { rest } from 'msw';

import { cachedFetch } from './api';

const TEST_URL = 'https://hacker-news.firebaseio.com/v0/test';

const server = setupServer(
  rest.get(TEST_URL, (req, res, ctx) => {
    return res(ctx.json({ id: 23 }));
  })
);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

it('should return and cache result on success response', async () => {
  expect(localStorage).toHaveLength(0);

  const result = await cachedFetch(TEST_URL);

  expect(result).toEqual({ id: 23 });
  expect(localStorage).toHaveLength(1);
  expect(localStorage.getItem(TEST_URL)).toEqual(JSON.stringify({ id: 23 }));
});

it('should return and replace cached result on success response', async () => {
  // init old value in cache that must be deleted by cachedFetch
  localStorage.setItem(TEST_URL, JSON.stringify({ id: 18 }));

  const result = await cachedFetch(TEST_URL);

  expect(result).toEqual({ id: 23 });
  expect(localStorage).toHaveLength(1);
  expect(localStorage.getItem(TEST_URL)).toEqual(JSON.stringify({ id: 23 }));
});

it('should return cached result on server error if available', async () => {
  // init value in cache that must be returned by cachedFetch
  localStorage.setItem(TEST_URL, JSON.stringify({ id: 18 }));

  server.use(
    rest.get(TEST_URL, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  const result = await cachedFetch(TEST_URL);

  expect(result).toEqual({ id: 18 });
  expect(localStorage).toHaveLength(1);
  expect(localStorage.getItem(TEST_URL)).toEqual(JSON.stringify({ id: 18 }));
});

it('should throw on server error if no cached result available', async () => {
  expect(localStorage).toHaveLength(0);
  server.use(
    rest.get(TEST_URL, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  await expect(cachedFetch(TEST_URL)).rejects.toEqual(
    Error('Impossible to fetch "https://hacker-news.firebaseio.com/v0/test"')
  );
});
