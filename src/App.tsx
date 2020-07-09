import React from 'react';
import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import customTheme from './custom-theme';
import Header from './components/Header';
import Container from './components/Container';
import StoriesTimeline from './components/StoriesTimeline';
import { ConnectivityStatusProvider } from './contexts/connectivity-status';

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <ConnectivityStatusProvider>
        <CSSReset />
        <Header />
        <Container>
          <StoriesTimeline />
        </Container>
      </ConnectivityStatusProvider>
    </ThemeProvider>
  );
}

export default App;
