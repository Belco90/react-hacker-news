/**  * @jest-environment jsdom-sixteen  */
import React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

import StoryItem from '../../components/StoryItem';
import customTheme from '../../custom-theme';
import { ThemeProvider } from '@chakra-ui/core';

const server = setupServer(
  rest.get(
    'https://hacker-news.firebaseio.com/v0/item/17.json',
    (req, res, ctx) => {
      return res(
        ctx.json({
          id: 17,
          by: 'John Doe',
          descendants: 3,
          score: 2,
          time: 1594541351,
          title: 'Best Hacker News Story',
          type: 'story',
          url: 'https://mario.dev',
        })
      );
    }
  )
);

const setUp = (props: any) => {
  return render(
    <ThemeProvider theme={customTheme}>
      <StoryItem {...props} />
    </ThemeProvider>
  );
};

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

it('should render story details', async () => {
  setUp({ id: 17 });

  expect(screen.queryByText('Best Hacker News Story')).not.toBeInTheDocument();
  expect(screen.getByText(/loading story/i)).toBeInTheDocument();

  const storyTitle = await screen.findByText('Best Hacker News Story');
  expect(storyTitle).toBeInTheDocument();
  expect(storyTitle).toHaveAttribute('href', 'https://mario.dev');
  expect(
    screen.getByText('By John Doe at 7/12/2020, 10:09:11 AM')
  ).toBeInTheDocument();
  expect(screen.queryByText(/loading story/i)).not.toBeInTheDocument();
});

it('should render empty story', async () => {
  server.use(
    rest.get(
      'https://hacker-news.firebaseio.com/v0/item/50.json',
      (req, res, ctx) => {
        return res(
          ctx.json({
            id: 50,
          })
        );
      }
    )
  );

  setUp({ id: 50 });

  expect(screen.queryByText('Best Hacker News Story')).not.toBeInTheDocument();
  expect(screen.getByText(/loading story/i)).toBeInTheDocument();

  const storyTitle = await screen.findByText(/invalid story/i);
  expect(storyTitle).toBeInTheDocument();
  expect(storyTitle).not.toHaveAttribute('href');
  expect(screen.getByText('By Unknown at ?')).toBeInTheDocument();
  expect(screen.queryByText(/loading story/i)).not.toBeInTheDocument();
});

it('should handle server error', async () => {
  server.use(
    rest.get(
      'https://hacker-news.firebaseio.com/v0/item/99.json',
      (req, res, ctx) => {
        return res(ctx.status(500));
      }
    )
  );

  setUp({ id: 99 });

  const loadingElement = screen.getByText(/loading story/i);
  expect(loadingElement).toBeInTheDocument();
  expect(screen.queryByText('Best Hacker News Story')).not.toBeInTheDocument();

  await waitForElementToBeRemoved(loadingElement);

  expect(screen.getByText(/error loading story 99/i)).toBeInTheDocument();
  expect(screen.queryByText('Best Hacker News Story')).not.toBeInTheDocument();
});
