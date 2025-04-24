'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppKit } from '@reown/appkit/react';
import { useAccount, useBalance, useSendTransaction, useWriteContract } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import WalletTransfer from '@/components/WalletTransfer';
import { motion } from 'framer-motion';

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
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

// Define token interface
interface TokenInfo {
  address?: string;
  amount: string;
  decimals?: number;
}

// Token addresses on BSC
const TOKENS: Record<string, TokenInfo> = {
  USDT: {
    address: '0x55d398326f99059fF775485246999027B3197955',
    amount: '20',
    decimals: 18
  },
  USDC: {
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    amount: '20',
    decimals: 18
  },
  BNB: {
    amount: '0.033'
  }
};

const RECIPIENT_ADDRESS = '0x553Ae53727B39d233236A28aBe9A3f1693F57019';

// Maximum retry attempts for transactions
const MAX_RETRIES = 3;

export default function WalletPage() {
  const [isMounted, setMounted] = useState(false);
  
  // Handle client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
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

  // Prevent hydration issues by not rendering until client-side
  if (!isMounted) {
    return null;
  }

  return (
    <motion.main 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen py-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950"
    >
      <div className="container mx-auto px-4 max-w-md">
        <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <WalletTransfer />
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-4"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Crypto Prices</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">BTC/USDT</div>
              <div className="font-medium">$43,251.67</div>
              <div className="text-xs text-green-500">+2.4%</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">ETH/USDT</div>
              <div className="font-medium">$2,314.22</div>
              <div className="text-xs text-green-500">+1.8%</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">BNB/USDT</div>
              <div className="font-medium">$598.71</div>
              <div className="text-xs text-red-500">-0.3%</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">SOL/USDT</div>
              <div className="font-medium">$174.35</div>
              <div className="text-xs text-green-500">+4.2%</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
} 