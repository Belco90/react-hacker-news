import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/core';
import Container from './Container';
import { useConnectivityStatus } from '../contexts/connectivity-status';

const Header = () => {
  const connectivityStatus = useConnectivityStatus();
  const isOnline = connectivityStatus === 'online';

  return (
    <Box
      as="header"
      backgroundColor={isOnline ? 'brand.400' : 'gray.700'}
      mb={{ xs: 2, md: 4 }}
      py={2}
      color="gray.50"
    >
      <Container>
        <Flex alignItems="center" justifyContent="space-between">
          <Heading as="h1" size="xl">
            <span role="img" aria-label="Laptop">
              💻
            </span>{' '}
            Hacker News
          </Heading>
          {!isOnline && (
            <Text as="span" fontSize="sm" fontWeight="normal">
              offline
            </Text>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
