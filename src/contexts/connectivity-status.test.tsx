/**  * @jest-environment jsdom-sixteen  */
import React from 'react';
import { act, render, screen } from '../test-utils';
import {
  ConnectivityStatusProvider,
  useConnectivityStatus,
} from './connectivity-status';

const TestComponent: React.FC = () => {
  const status = useConnectivityStatus();
  return <div>{status}</div>;
};

it('should get updated connectivity status', () => {
  render(
    <ConnectivityStatusProvider>
      <TestComponent />
    </ConnectivityStatusProvider>
  );
  expect(screen.getByText('online')).toBeInTheDocument();
  expect(screen.queryByText('offline')).not.toBeInTheDocument();

  act(() => {
    window.dispatchEvent(new Event('offline'));
  });
  expect(screen.getByText('offline')).toBeInTheDocument();
  expect(screen.queryByText('online')).not.toBeInTheDocument();

  act(() => {
    window.dispatchEvent(new Event('online'));
  });
  expect(screen.getByText('online')).toBeInTheDocument();
  expect(screen.queryByText('offline')).not.toBeInTheDocument();
});
