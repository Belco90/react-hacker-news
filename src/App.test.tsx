/**  * @jest-environment jsdom-sixteen  */
import React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from './test-utils';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

import App from './App';
import { HackerNewsStory } from './models';
import { readItem, readStoriesIndex } from './api';

const getFakeStory = (id: number): HackerNewsStory => ({
  id: id,
  by: 'John Doe',
  descendants: id * 3,
  score: id * 2,
  time: 1594541351,
  title: `Best Hacker News Story #${id}`,
  type: 'story',
  url: 'https://mario.dev',
});

const server = setupServer(
  rest.get(
    'https://hacker-news.firebaseio.com/v0/newstories.json',
    (req, res, ctx) => {
      return res(ctx.json([1, 2, 3]));
    }
  ),
  // It seems like URL matching doesn't work fine for
  // https://hacker-news.firebaseio.com/v0/item/:itemId.json
  // because of the dot after the placeholder.
  // That's why I need to mock item requests one by one manually.
  // TODO: open issue on msw and check if I can create a PR myself
  rest.get(
    'https://hacker-news.firebaseio.com/v0/item/1.json',
    (req, res, ctx) => {
      return res(ctx.json(getFakeStory(1)));
    }
  ),
  rest.get(
    'https://hacker-news.firebaseio.com/v0/item/2.json',
    (req, res, ctx) => {
      return res(ctx.json(getFakeStory(2)));
    }
  ),
  rest.get(
    'https://hacker-news.firebaseio.com/v0/item/3.json',
    (req, res, ctx) => {
      return res(ctx.json(getFakeStory(3)));
    }
  )
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

it('should render newest stories', async () => {
  render(<App />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  const title1 = await screen.findByText('Best Hacker News Story #1');
  expect(title1).toBeInTheDocument();
  const title2 = await screen.findByText('Best Hacker News Story #2');
  expect(title2).toBeInTheDocument();
  const title3 = await screen.findByText('Best Hacker News Story #3');
  expect(title3).toBeInTheDocument();

  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});

it('should render previous stories if offline', async () => {
  // render app first time to cache stories
  const { unmount } = render(<App />);

  await screen.findByText('Best Hacker News Story #1');
  await screen.findByText('Best Hacker News Story #2');
  await screen.findByText('Best Hacker News Story #3');

  // unmount current app to re-mount it later and force reading stories again
  unmount();

  // force error on api to prove it's using cache instead of performing new requests,
  // including some mocks calls as extra proof
  const anyRequestMock = jest.fn();
  server.use(
    rest.get(
      'https://hacker-news.firebaseio.com/v0/newstories.json',
      (req, res, ctx) => {
        anyRequestMock();
        return res(ctx.status(500));
      }
    ),
    rest.get(
      'https://hacker-news.firebaseio.com/v0/item/1.json',
      (req, res, ctx) => {
        anyRequestMock();
        return res(ctx.status(500));
      }
    )
  );

  // re-mount app
  render(<App />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  const title1 = await screen.findByText('Best Hacker News Story #1');
  expect(title1).toBeInTheDocument();
  const title2 = await screen.findByText('Best Hacker News Story #2');
  expect(title2).toBeInTheDocument();
  const title3 = await screen.findByText('Best Hacker News Story #3');
  expect(title3).toBeInTheDocument();

  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  expect(anyRequestMock).not.toHaveBeenCalled();
});

it('should handle server error retrieving the newest stories', async () => {
  server.use(
    rest.get(
      'https://hacker-news.firebaseio.com/v0/newstories.json',
      (req, res, ctx) => {
        return res(ctx.status(500));
      }
    )
  );

  render(<App />);

  const loadingElement = screen.getByText('Loading...');
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await waitForElementToBeRemoved(loadingElement);
  expect(screen.getByText('Something went wrong retrieving new stories'));
});
