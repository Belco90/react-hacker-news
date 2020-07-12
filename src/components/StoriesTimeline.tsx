import React from 'react';
import { Box, Heading, Spinner, Stack, Text } from '@chakra-ui/core';
import { Waypoint } from 'react-waypoint';

import StoryItem from './StoryItem';
import { readStoriesIndex } from '../api';

const CHUNK_SIZE = 30;
type PaginationData = {
  cursor: number;
};

const StoriesTimeline = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [storiesIds, setStoriesIds] = React.useState<number[]>([]);
  const [scrollStoriesIds, setScrollStoriesIds] = React.useState<number[]>([]);
  const [canLoadMore, setCanLoadMore] = React.useState<boolean>(false);
  const { current: pagination } = React.useRef<PaginationData>({ cursor: 0 });

  const loadMoreStories = () => {
    if (canLoadMore) {
      const nextStoriesIdsSlice = storiesIds.slice(
        pagination.cursor,
        pagination.cursor + CHUNK_SIZE
      );

      const newScrollStoriesIds = [...scrollStoriesIds, ...nextStoriesIdsSlice];

      pagination.cursor = newScrollStoriesIds.length;
      setCanLoadMore(newScrollStoriesIds.length < storiesIds.length);

      setScrollStoriesIds(newScrollStoriesIds);
    }
  };

  React.useEffect(() => {
    const retrieveStoriesIds = async () => {
      try {
        const data = await readStoriesIndex();
        setStoriesIds(data);

        const firstPagination = data.slice(0, CHUNK_SIZE);
        setScrollStoriesIds(firstPagination);
        pagination.cursor = firstPagination.length;
        setCanLoadMore(firstPagination.length < data.length);
      } catch (e) {
        setIsError(true);
      }
      setIsLoading(false);
    };

    retrieveStoriesIds();
    // eslint-disable-next-line
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

      {isError ? (
        <Box>Something went wrong retrieving new stories</Box>
      ) : (
        <>
          <Stack spacing={2}>
            {scrollStoriesIds.map((storyId) => (
              <StoryItem key={storyId} id={storyId} />
            ))}
          </Stack>

          <Waypoint onEnter={loadMoreStories}>
            <Box mt={5} display="flex" justifyContent="center">
              {!canLoadMore && !isLoading && (
                <Text as="em" mx="auto" color="gray.500">
                  No more news :(
                </Text>
              )}
            </Box>
          </Waypoint>
        </>
      )}
    </Box>
  );
};

export default StoriesTimeline;
