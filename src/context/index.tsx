'use client';

import { wagmiAdapter, projectId } from '@/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { mainnet } from '@reown/appkit/networks';
import { bsc } from '@reown/appkit/networks';
import React, { type ReactNode, useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';

// Set up queryClient
const queryClient = new QueryClient();

// Set up metadata
const metadata = {
  name: 'Crypto Dashboard',
  description: 'Live cryptocurrency prices with WalletConnect integration',
  url: 'http://getbnb.in', // Update this for production
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId: projectId || '',
  networks: [mainnet, bsc], // Only Ethereum and BSC
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export default function ContextProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => queryClient);
  const [mounted, setMounted] = useState(false);

  // Handle wallet connection persistence
  useEffect(() => {
    setMounted(true);
    
    // Check if we should autoconnect
    const checkWalletConnection = async () => {
      if (typeof window !== 'undefined') {
        // Check if there's a stored connection
        const storedConnection = localStorage.getItem('wallet-connection');
        
        if (storedConnection === 'true') {
          try {
            // The modal object has methods to connect
            console.log('Reconnecting to previously connected wallet');
            // Auto connection is handled by the AppKit internally
          } catch (error) {
            console.error('Error reconnecting to wallet:', error);
          }
        }
      }
    };
    
    checkWalletConnection();
  }, []);

  // Listen for connection events and store state
  useEffect(() => {
    const handleConnect = () => {
      localStorage.setItem('wallet-connection', 'true');
    };
    
    const handleDisconnect = () => {
      localStorage.removeItem('wallet-connection');
    };
    
    window.addEventListener('appkit_wallet_connected', handleConnect);
    window.addEventListener('appkit_wallet_disconnected', handleDisconnect);
    
    return () => {
      window.removeEventListener('appkit_wallet_connected', handleConnect);
      window.removeEventListener('appkit_wallet_disconnected', handleDisconnect);
    };
  }, []);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={client}>
        {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
      </QueryClientProvider>
    </WagmiProvider>
  );
} 