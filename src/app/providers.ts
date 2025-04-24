import { createConfig, http, Config } from 'wagmi';
import { mainnet } from 'wagmi/chains';

// Create wagmi config
export const wagmiConfig: Config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  }
}); 