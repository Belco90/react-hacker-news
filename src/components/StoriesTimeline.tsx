import React from 'react';
import { Box, Heading, Stack } from '@chakra-ui/core';
import StoryItem from './StoryItem';
import { readStoriesIndex } from '../api';

const StoriesTimeline = () => {
  const [storiesIds, setStoriesIds] = React.useState<number[]>([]);

  React.useEffect(() => {
    const retrieveStoriesIds = async () => {
      const data = await readStoriesIndex();
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
