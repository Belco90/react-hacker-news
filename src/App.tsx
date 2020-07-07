import React from 'react';
import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import customTheme from './custom-theme';
import Header from './components/Header';
import Container from './components/Container';
import StoriesTimeline from './components/StoriesTimeline';

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />
      <Header />
      <Container>
        <StoriesTimeline />
      </Container>
    </ThemeProvider>
  );
}

export default App;
