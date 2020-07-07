import React from 'react';
import { Box, Link, Stack, Text } from '@chakra-ui/core';
import { HACKER_NEWS_URI } from '../global-constants';
import { HackerNewsStory } from '../models';

const fetchItem = async (id: number) => {
  const resp = await fetch(`${HACKER_NEWS_URI}/item/${id}.json`);

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  throw new Error('Something went wrong fetching latest stories');
};

const getTimeDisplay = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

type Props = {
  id: number;
};

const StoryItem: React.FC<Props> = ({ id, ...props }) => {
  const [story, setStory] = React.useState<HackerNewsStory | null>(null);

  React.useEffect(() => {
    const retrieveStoryItem = async () => {
      const data = await fetchItem(id);
      setStory(data);
    };

    retrieveStoryItem();
  }, []);

  return (
    <Box p={5} shadow="md" borderWidth="1px" {...props}>
      {story && (
        <Stack spacing={4}>
          <Box fontWeight="semibold">
            <Link href={story.url}>{story.title}</Link>
          </Box>
          <Box borderLeftWidth="2px" paddingLeft={2}>
            <Text fontSize="sm" color="gray.500">
              By {story.by || 'Unknown'} at {getTimeDisplay(story.time)}
            </Text>
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default StoryItem;
