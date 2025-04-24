'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

type PaymentConfirmationProps = {
  txHash: string;
  amount: string;
  token: string;
  recipientAddress: `0x${string}` | null;
  chainName: string;
  onClose: () => void;
};

export default function PaymentConfirmation({
  txHash,
  amount,
  token,
  recipientAddress,
  chainName,
  onClose,
}: PaymentConfirmationProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const paymentId = `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  
  useEffect(() => {
    // Trigger confetti animation on component mount
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
    
    const instance = confetti.create();
    
    (function frame() {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        return;
      }
      
      const particleCount = 50 * (timeLeft / duration);
      
      // Launch confetti from both sides
      instance({
        particleCount,
        spread: 70,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#F59E0B', '#FBBF24', '#ffffff'],
      });
      
      instance({
        particleCount,
        spread: 70,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#F59E0B', '#FBBF24', '#ffffff'],
      });
      
      requestAnimationFrame(frame);
    }());
    
    // Clean up confetti on unmount
    return () => {
      instance.reset();
    };
  }, []);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
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

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  // Helper function to format an address for display
  const formatAddress = (address: `0x${string}` | null): string => {
    if (!address) return 'Unknown Address';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4">
      <motion.div
        className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        {/* Gold accent top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"></div>
        
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -inset-[100px] opacity-30"
            animate={{
              backgroundPosition: ['0px 0px', '100px 100px'],
            }}
            transition={{ 
              duration: 20, 
              ease: "linear", 
              repeat: Infinity,
              repeatType: "loop" 
            }}
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            style={{
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
            }}
          />
          
          <motion.div
            className="absolute bottom-10 right-10 w-48 h-48 rounded-full"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
            }}
          />
        </div>
        
        <div className="relative p-8 pt-12">
          {/* Success icon */}
          <div className="flex justify-center mb-8">
            <motion.div
              className="relative w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1
              }}
            >
              <motion.div 
                className="absolute inset-0 rounded-full"
                animate="pulse"
                variants={pulseVariants}
                style={{
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.7) 0%, transparent 70%)',
                }}
              />
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </motion.div>
          </div>
        
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-gray-300">Your transaction has been processed successfully.</p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants} 
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 mt-6"
            >
              <p className="text-gray-300 mb-2">Amount</p>
              <p className="text-xl font-bold text-white mb-2">{amount} <span className="text-amber-500">{token}</span></p>
              <p className="text-sm text-gray-400">On {chainName}</p>
              <p className="text-sm text-gray-400 mt-1">To: {formatAddress(recipientAddress)}</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-5 mt-6">
              <div>
                <p className="text-gray-300 mb-2">Payment ID</p>
                <div className="flex items-center justify-between bg-gray-800/80 border border-gray-700 rounded-lg p-3">
                  <p className="font-mono text-amber-400 tracking-wider">{paymentId}</p>
                  <button 
                    onClick={() => copyToClipboard(paymentId)}
                    className="ml-2 p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <p className="text-gray-300 mb-2">Transaction Hash</p>
                <div className="flex items-center justify-between bg-gray-800/80 border border-gray-700 rounded-lg p-3">
                  <p className="font-mono text-gray-300 text-sm truncate">{txHash}</p>
                  <button 
                    onClick={() => copyToClipboard(txHash)}
                    className="ml-2 p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="pt-6">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-gray-900 font-bold shadow-lg transition-all"
                onClick={onClose}
              >
                Done
              </motion.button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-sm text-gray-400 mt-4">
              Need help? Contact our support team.
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 