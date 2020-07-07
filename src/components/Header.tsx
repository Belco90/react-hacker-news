import React from 'react';
import { Box, Heading } from '@chakra-ui/core';
import Container from './Container';

const Header = () => {
  return (
    <Box
      as="header"
      backgroundColor="brand.400"
      mb={{ xs: 2, md: 4 }}
      py={2}
      color="gray.50"
    >
      <Container>
        <Heading as="h1" size="xl">
          Hacker News
        </Heading>
      </Container>
    </Box>
  );
};

export default Header;
