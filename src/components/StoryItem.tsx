import React from 'react';
import { Box, Link, Skeleton, Stack, Text } from '@chakra-ui/core';
import { HackerNewsStory } from '../models';
import { readItem } from '../api';
import { getTimeDisplay } from '../utilities';

type Props = {
  id: number;
};

const StoryItem: React.FC<Props> = ({ id, ...props }) => {
  const [story, setStory] = React.useState<HackerNewsStory | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const retrieveStoryItem = async () => {
      const data = await readItem(id);
      setStory(data);
      setIsLoading(false);
    };

    retrieveStoryItem();
    // eslint-disable-next-line
  }, []);

  return (
    <Box p={5} shadow="md" borderWidth="1px" {...props}>
      <Stack spacing={4}>
        <Box fontWeight="semibold">
          <Skeleton
            isLoaded={!isLoading}
            width={isLoading ? { base: '80%', md: '40%' } : 'full'}
          >
            {story ? (
              <Link href={story.url}>{story.title}</Link>
            ) : (
              <Text as="em">Invalid story</Text>
            )}
          </Skeleton>
        </Box>
        <Box borderLeftWidth="2px" paddingLeft={2}>
          <Skeleton
            isLoaded={!isLoading}
            width={isLoading ? { base: '40%', md: '20%' } : 'full'}
          >
            <Text fontSize="sm" color="gray.500">
              By {story?.by || 'Unknown'} at{' '}
              {story ? getTimeDisplay(story.time) : '?'}
            </Text>
          </Skeleton>
        </Box>
      </Stack>
    </Box>
  );
};

export default StoryItem;
