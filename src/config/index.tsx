import { cookieStorage, createStorage, http } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, bsc } from 'wagmi/chains';

// Get projectId from environment
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  console.warn('Project ID is not defined, wallet connect may not work properly');
}

// Only use Ethereum and BSC chains
export const networks = [mainnet, bsc];

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: projectId || '',
});

export const config = wagmiAdapter.wagmiConfig; 