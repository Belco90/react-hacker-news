import React from 'react';

type ConnectivityStatus = 'online' | 'offline';

const ConnectivityStatusContext = React.createContext<ConnectivityStatus>(
  window.navigator.onLine ? 'online' : 'offline'
);

const ConnectivityStatusProvider: React.FC = ({ children }) => {
  const [connectivity, setConnectivity] = React.useState<ConnectivityStatus>(
    'online'
  );

  React.useEffect(() => {
    const setOnline = () => setConnectivity('online');
    const setOffline = () => setConnectivity('offline');

    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  return (
    <ConnectivityStatusContext.Provider
      value={connectivity}
      children={children}
    />
  );
};

const useConnectivityStatus = (): ConnectivityStatus => {
  const context = React.useContext(ConnectivityStatusContext);

  if (!context) {
    throw new Error(
      'useConnectivityStatus must be used within a ConnectivityStatusProvider'
    );
  }

  return context;
};

export { ConnectivityStatusProvider, useConnectivityStatus };
