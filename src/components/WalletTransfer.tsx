'use client';

import { useState, useEffect } from 'react';
import { useAppKit } from '@reown/appkit/react';
import { useAccount, useBalance, useSendTransaction, useWriteContract, useSwitchChain, useChains } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { motion, AnimatePresence } from 'framer-motion';

// Recipient address (demo purposes only)
const RECIPIENT_ADDRESS = '0x9264e84Dcc5DFDf009F4cD14CdA70C59D7cb98fd';

// Chain IDs
const BSC_CHAIN_ID = 56;
const ETHEREUM_CHAIN_ID = 1;

// Token addresses
const USDT_BSC = '0x55d398326f99059fF775485246999027B3197955';
const USDC_BSC = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d';
const USDT_ETH = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const USDC_ETH = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

// ERC20 ABI for token transfers
const erc20Abi = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];

type TokenOption = 'USDT' | 'USDC' | 'NATIVE';

// Chain configuration
const chains = [
  { 
    id: BSC_CHAIN_ID, 
    name: 'BNB Smart Chain', 
    icon: '🔶',
    nativeCurrency: 'BNB',
    nativeAmount: '0.033',
    tokens: {
      USDT: { address: USDT_BSC, amount: '20', decimals: 18 },
      USDC: { address: USDC_BSC, amount: '20', decimals: 18 }
    }
  },
  { 
    id: ETHEREUM_CHAIN_ID, 
    name: 'Ethereum', 
    icon: '💎',
    nativeCurrency: 'ETH',
    nativeAmount: '0.01',
    tokens: {
      USDT: { address: USDT_ETH, amount: '20', decimals: 6 },
      USDC: { address: USDC_ETH, amount: '20', decimals: 6 }
    }
  }
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: -10,
    transition: { duration: 0.2 }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function WalletTransfer() {
  const [selectedToken, setSelectedToken] = useState<TokenOption>('USDT');
  const [selectedChainId, setSelectedChainId] = useState(BSC_CHAIN_ID);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [chainDropdownOpen, setChainDropdownOpen] = useState(false);
  const [tokenDropdownOpen, setTokenDropdownOpen] = useState(false);

  const selectedChain = chains.find(chain => chain.id === selectedChainId)!;
  
  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { data: sendTransactionData, isPending: isSendPending, sendTransaction } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();
  const availableChains = useChains();

  // Update chain ID based on connected chain
  useEffect(() => {
    // Check if the wallet is connected
    if (isConnected) {
      const chain = availableChains.find(chain => chain.id === selectedChainId);
      if (!chain) {
        // If the selected chain is not available, default to BSC
        setSelectedChainId(BSC_CHAIN_ID);
      }
    }
  }, [isConnected, availableChains, selectedChainId]);

  // Clear transaction data when token or chain changes
  useEffect(() => {
    setTxHash(null);
    setTxError(null);
  }, [selectedToken, selectedChainId]);

  const connectWallet = async () => {
    if (!isConnected) {
      try {
        await open();
      } catch (error) {
        console.error('Connection error:', error);
        setTxError('Failed to connect wallet. Please try again.');
      }
    }
  };

  const switchNetwork = async (chainId: number) => {
    try {
      await switchChainAsync({ chainId });
      setSelectedChainId(chainId);
      setChainDropdownOpen(false); // Close dropdown after selection
    } catch (error) {
      console.error('Network switch error:', error);
      setTxError(`Failed to switch to ${chains.find(c => c.id === chainId)?.name}. Please try manually.`);
    }
  };

  const handleConnect = async () => {
    if (!isConnected) {
      try {
        await open();
      } catch (error) {
        console.error('Connection error:', error);
      }
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await open({
        view: 'Networks'
      });
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleTransfer = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setIsLoading(true);
    setTxHash(null);
    setTxError(null);

    try {
      // Check if connected to the correct chain
      const chain = availableChains.find(chain => chain.id === selectedChainId);
      if (!chain) {
        await switchNetwork(selectedChainId);
      }

      let hash;
      // Handle native token transfers (BNB or ETH)
      if (selectedToken === 'NATIVE') {
        const amount = parseEther(selectedChain.nativeAmount);
        hash = await sendTransaction({
          to: RECIPIENT_ADDRESS,
          value: amount,
        });
      } 
      // Handle ERC20 token transfers (USDT or USDC)
      else {
        const tokenInfo = selectedChain.tokens[selectedToken];
        const amount = parseUnits(tokenInfo.amount, tokenInfo.decimals);
        
        const result = await writeContractAsync({
          address: tokenInfo.address as `0x${string}`,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [RECIPIENT_ADDRESS, amount],
        });
        
        if (result) {
          hash = result;
        }
      }

      if (hash) {
        setTxHash(hash);
      }
    } catch (error: any) {
      console.error('Transaction error:', error);
      setTxError(error?.message || 'Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChainChange = (newChainId: string) => {
    const chainId = parseInt(newChainId);
    setSelectedChainId(chainId);
  };

  const getTokenSymbol = () => {
    if (selectedToken === 'NATIVE') {
      return selectedChain.nativeCurrency;
    }
    return selectedToken;
  };

  const getTokenAmount = () => {
    if (selectedToken === 'NATIVE') {
      return selectedChain.nativeAmount;
    }
    return selectedChain.tokens[selectedToken].amount;
  };

  const ConnectButton = () => (
    <motion.button
      whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(245, 158, 11, 0.4)" }}
      whileTap={{ scale: 0.97 }}
      className={`w-full py-3 px-6 rounded-xl font-medium text-gray-900 shadow-lg transition-all flex items-center justify-center gap-2 ${
        isLoading ? 'bg-amber-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400'
      }`}
      onClick={handleTransfer}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-gray-900" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </>
      ) : isConnected ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Transfer {getTokenAmount()} {getTokenSymbol()}
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Connect Wallet
        </>
      )}
    </motion.button>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
    >
      <motion.h2 
        variants={itemVariants}
        className="text-xl font-bold text-white mb-6 flex items-center"
      >
        <span className="text-amber-500 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
        </span>
        Crypto Transfer
      </motion.h2>

      <motion.div variants={itemVariants} className="space-y-5">
        {/* Chain Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Blockchain
          </label>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-650 rounded-lg border border-gray-600 text-white"
            onClick={() => setChainDropdownOpen(!chainDropdownOpen)}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-2">{selectedChain.icon}</span>
              <span className="font-medium">{selectedChain.name}</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform text-amber-500 ${chainDropdownOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.button>
          
          <AnimatePresence>
            {chainDropdownOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                className="absolute z-10 w-full mt-1 bg-gray-700 shadow-lg rounded-lg border border-gray-600 overflow-hidden"
              >
                <ul>
                  {chains.map((chain) => (
                    <li key={chain.id}>
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center p-3 text-left text-white ${
                          selectedChainId === chain.id ? 'bg-amber-900/30 text-amber-500' : ''
                        }`}
                        onClick={() => switchNetwork(chain.id)}
                      >
                        <span className="text-2xl mr-2">{chain.icon}</span>
                        <span className="font-medium">{chain.name}</span>
                      </motion.button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Token Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Token
          </label>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-650 rounded-lg border border-gray-600 text-white"
            onClick={() => setTokenDropdownOpen(!tokenDropdownOpen)}
          >
            <div className="flex items-center">
              <span className="font-medium">
                {selectedToken === 'NATIVE' ? selectedChain.nativeCurrency : selectedToken}
              </span>
              <span className="ml-2 text-sm text-amber-500">
                ({getTokenAmount()})
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform text-amber-500 ${tokenDropdownOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.button>
          
          <AnimatePresence>
            {tokenDropdownOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                className="absolute z-10 w-full mt-1 bg-gray-700 shadow-lg rounded-lg border border-gray-600 overflow-hidden"
              >
                <ul>
                  <li>
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center p-3 text-left text-white ${
                        selectedToken === 'USDT' ? 'bg-amber-900/30 text-amber-500' : ''
                      }`}
                      onClick={() => {
                        setSelectedToken('USDT');
                        setTokenDropdownOpen(false);
                      }}
                    >
                      <span className="font-medium">USDT</span>
                      <span className="ml-2 text-sm text-amber-500">
                        ({selectedChain.tokens.USDT.amount})
                      </span>
                    </motion.button>
                  </li>
                  <li>
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center p-3 text-left text-white ${
                        selectedToken === 'USDC' ? 'bg-amber-900/30 text-amber-500' : ''
                      }`}
                      onClick={() => {
                        setSelectedToken('USDC');
                        setTokenDropdownOpen(false);
                      }}
                    >
                      <span className="font-medium">USDC</span>
                      <span className="ml-2 text-sm text-amber-500">
                        ({selectedChain.tokens.USDC.amount})
                      </span>
                    </motion.button>
                  </li>
                  <li>
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center p-3 text-left text-white ${
                        selectedToken === 'NATIVE' ? 'bg-amber-900/30 text-amber-500' : ''
                      }`}
                      onClick={() => {
                        setSelectedToken('NATIVE');
                        setTokenDropdownOpen(false);
                      }}
                    >
                      <span className="font-medium">{selectedChain.nativeCurrency}</span>
                      <span className="ml-2 text-sm text-amber-500">
                        ({selectedChain.nativeAmount})
                      </span>
                    </motion.button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Transfer Button */}
        <motion.div variants={itemVariants} className="pt-2">
          <ConnectButton />
        </motion.div>

        {/* Transaction Result */}
        <AnimatePresence>
          {txHash && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-4 bg-green-900/20 border border-green-700 rounded-lg"
            >
              <div className="flex items-center text-green-400">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">Transaction Submitted!</p>
              </div>
              <p className="mt-2 text-sm break-all text-gray-300">
                Transaction Hash: {txHash}
              </p>
            </motion.div>
          )}

          {txError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg"
            >
              <div className="flex items-center text-red-400">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">Transaction Failed</p>
              </div>
              <p className="mt-2 text-sm text-gray-300">
                {txError}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recipient info */}
        <motion.div variants={itemVariants} className="mt-6 text-sm text-gray-400">
          <p>Sending to: <span className="text-amber-500">{RECIPIENT_ADDRESS.slice(0, 6)}...{RECIPIENT_ADDRESS.slice(-4)}</span></p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 