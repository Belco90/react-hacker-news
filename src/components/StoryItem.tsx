import React from 'react';
import { Box, Link, Stack, Text } from '@chakra-ui/core';
import { HackerNewsStory } from '../models';
import { readItem } from '../api';
import { getTimeDisplay } from '../utilities';

type Props = {
  id: number;
};

const StoryItem: React.FC<Props> = ({ id, ...props }) => {
  const [story, setStory] = React.useState<HackerNewsStory | null>(null);

  React.useEffect(() => {
    const retrieveStoryItem = async () => {
      const data = await readItem(id);
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
