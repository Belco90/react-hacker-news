import React from 'react';
import { Box, Heading, Stack } from '@chakra-ui/core';
import { HACKER_NEWS_URI } from '../global-constants';
import StoryItem from './StoryItem';

const fetchLatestStories = async () => {
  const resp = await fetch(`${HACKER_NEWS_URI}/newstories.json`);

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error('Something went wrong fetching latest stories');
};

const StoriesTimeline = () => {
  const [storiesIds, setStoriesIds] = React.useState<number[]>([]);

  React.useEffect(() => {
    const retrieveStoriesIds = async () => {
      const data = await fetchLatestStories();
      setStoriesIds(data);
    };

    retrieveStoriesIds();
  }, []);

  return (
    <Box my={8}>
      <Heading as="h2" size="lg" mb={4}>
        Latest Stories
      </Heading>

      <Stack spacing={2}>
        {storiesIds.slice(0, 30).map((storyId) => (
          <StoryItem key={storyId} id={storyId} />
        ))}
      </Stack>
    </Box>
  );
};

export default StoriesTimeline;
