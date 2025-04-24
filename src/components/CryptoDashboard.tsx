'use client';

import { useEffect, useState } from 'react';
import CryptoPriceCard from './CryptoPriceCard';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Import WalletModal with dynamic import
const WalletModalWithNoSSR = dynamic(
  () => import('./WalletModal'),
  { ssr: false }
);

// Crypto assets to display
const cryptoAssets = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    color: '#F7931A',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#627EEA',
  },
  {
    id: 'binancecoin',
    name: 'BNB',
    symbol: 'BNB',
    color: '#F3BA2F',
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    color: '#00FFA3',
  },
];

export default function CryptoDashboard() {
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);

  const openWalletModal = (cryptoId: string) => {
    setSelectedCrypto(cryptoId);
    setWalletModalOpen(true);
  };

  const closeWalletModal = () => {
    setWalletModalOpen(false);
  };

  // Card hover animations
  const cardHoverAnimation = {
    rest: { scale: 1, boxShadow: "0 0 0px rgba(245, 158, 11, 0)" },
    hover: { 
      scale: 1.03, 
      boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Staggered animation for cards
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-700 shadow-lg">
      {/* Background effects matching hero section */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-80"></div>
        <motion.div 
          className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-20"
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
            transition: {
              duration: 40,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            }
          }}
        ></motion.div>
        {/* Gold accent lines */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"
          initial={{ opacity: 0, x: -200 }}
          animate={{ 
            opacity: [0, 0.7, 0], 
            x: ['-100%', '200%'],
            transition: {
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 3
            }
          }}
        ></motion.div>
      </div>
      
      <div className="relative p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="mr-3 text-xl text-amber-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-white">
              Live Crypto <span className="text-amber-500">Prices</span>
            </h2>
          </div>
          {/* The w3m-button is a web component that will be rendered by Reown AppKit */}
          <appkit-button />
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerAnimation}
          initial="hidden"
          animate="show"
        >
          {cryptoAssets.map((crypto, index) => (
            <motion.div 
              key={crypto.id} 
              variants={itemAnimation}
              whileHover="hover"
              initial="rest"
              animate="rest"
            >
              <CryptoPriceCard
                id={crypto.id}
                name={crypto.name}
                symbol={crypto.symbol}
                color={crypto.color}
                onPay={() => openWalletModal(crypto.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Wallet Modal */}
        <WalletModalWithNoSSR isOpen={isWalletModalOpen} onClose={closeWalletModal} />
      </div>
    </div>
  );
} 