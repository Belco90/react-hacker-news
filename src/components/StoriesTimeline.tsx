import React from 'react';
import { Box, Button, Heading, Spinner, Stack, Text } from '@chakra-ui/core';
import StoryItem from './StoryItem';
import { readStoriesIndex } from '../api';

const CHUNK_SIZE = 30;

const StoriesTimeline = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [storiesIds, setStoriesIds] = React.useState<number[]>([]);
  const [scrollStoriesIds, setScrollStoriesIds] = React.useState<number[]>([]);
  const [canLoadMore, setCanLoadMore] = React.useState<boolean>(false);
  const { current: pagination } = React.useRef<{
    cursor: number;
  }>({ cursor: 0 });

  React.useEffect(() => {
    const retrieveStoriesIds = async () => {
      const data = await readStoriesIndex();
      setStoriesIds(data);
      setIsLoading(false);

      const firstPagination = data.slice(0, CHUNK_SIZE);
      setScrollStoriesIds(firstPagination);
      pagination.cursor = firstPagination.length;
      setCanLoadMore(firstPagination.length < data.length);
    };

    retrieveStoriesIds();
    // eslint-disable-next-line
  }, []);

  const loadMoreStories = () => {
    const nextStoriesIdsSlice = storiesIds.slice(
      pagination.cursor,
      pagination.cursor + CHUNK_SIZE
    );

    const newScrollStoriesIds = [...scrollStoriesIds, ...nextStoriesIdsSlice];

    pagination.cursor = newScrollStoriesIds.length;
    setCanLoadMore(newScrollStoriesIds.length < storiesIds.length);

    setScrollStoriesIds(newScrollStoriesIds);
  };

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
        {scrollStoriesIds.map((storyId) => (
          <StoryItem key={storyId} id={storyId} />
        ))}
      </Stack>

      <Box mt={5} display="flex" justifyContent="center">
        {canLoadMore ? (
          <Button onClick={loadMoreStories} variantColor="brand">
            Load more
          </Button>
        ) : (
          <Text as="em" mx="auto" color="gray.500">
            No more news :(
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default StoriesTimeline;
