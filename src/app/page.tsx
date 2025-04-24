'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Import components with dynamic import to avoid SSR issues
const CryptoDashboardWithNoSSR = dynamic(
  () => import('../components/CryptoDashboard'),
  { ssr: false }
);

const WalletModalWithNoSSR = dynamic(
  () => import('../components/WalletModal'),
  { ssr: false }
);

export default function Home() {
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);

  const openWalletModal = () => setWalletModalOpen(true);
  const closeWalletModal = () => setWalletModalOpen(false);

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

  // Shimmering gold effect animation
  const shimmerVariants = {
    initial: { backgroundPosition: '0 0' },
    animate: {
      backgroundPosition: ['0 0', '100% 0'],
      transition: {
        repeat: Infinity,
        repeatType: "mirror" as const,
        duration: 3,
        ease: "linear"
      }
    }
  };

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-900 text-white"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-950">
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
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-24 lg:py-32">
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
              animate={{ scale: [1, 1.01, 1], transition: { duration: 5, repeat: Infinity } }}
            >
              <span className="block text-white">Pay the Due</span>
              <motion.span 
                className="block bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              >
                With Crypto
              </motion.span>
            </motion.h1>
            
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-300">
             Allowing all kind of Crypto wallets to pay with.
            </p>
            
            <div className="mt-10 flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(245, 158, 11, 0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={openWalletModal}
                className="py-4 px-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg font-bold shadow-lg transition-all text-gray-900 flex items-center gap-2 hover:from-amber-400 hover:to-yellow-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                Pay Now
              </motion.button>
              
              <appkit-button />
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          variants={itemVariants} 
          className="mb-16"
          whileInView={{ 
            x: [50, 0], 
            opacity: [0, 1], 
            transition: { duration: 0.8 } 
          }}
          viewport={{ once: true }}
        >
          <CryptoDashboardWithNoSSR />
        </motion.div>
      </div>
      
      {/* Wallet Modal */}
      <WalletModalWithNoSSR isOpen={isWalletModalOpen} onClose={closeWalletModal} />
    </motion.main>
  );
}
