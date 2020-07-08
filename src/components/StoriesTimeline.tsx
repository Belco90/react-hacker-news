import React from 'react';
import { Box, Heading, Spinner, Stack } from '@chakra-ui/core';
import StoryItem from './StoryItem';
import { readStoriesIndex } from '../api';

const StoriesTimeline = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [storiesIds, setStoriesIds] = React.useState<number[]>([]);

  React.useEffect(() => {
    const retrieveStoriesIds = async () => {
      const data = await readStoriesIndex();
      setStoriesIds(data);
      setIsLoading(false);
    };

    retrieveStoriesIds();
  }, []);

  if (isLoading) {
    return (
      <Box
        minHeight="85vh"
        width="full"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner color="brand.500" size="xl" thickness="4px" speed="0.65s" />
      </Box>
    );
  }

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
