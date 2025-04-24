'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '../../app/providers';

// This component is a simplified version of Web3ModalProvider from providers.tsx
// It provides the necessary wagmi context without initializing a new Web3Modal instance
export default function Web3Provider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  // Only render UI after component mounts to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
      </QueryClientProvider>
    </WagmiProvider>
  );
} 