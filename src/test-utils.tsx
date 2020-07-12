import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import customTheme from './custom-theme';
import { ThemeProvider } from '@chakra-ui/core';

const AllTheProviders: React.FC = ({ children }) => {
  return <ThemeProvider theme={customTheme}>{children}</ThemeProvider>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
