'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect } from 'wagmi';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  // Only show UI after client-side hydration
  useEffect(() => {
    setMounted(true);
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleWalletClick = () => {
    if (isConnected) {
      setShowDropdown(!showDropdown);
    } else {
      open();
    }
  };
  
  const handleDisconnect = () => {
    disconnect();
    setShowDropdown(false);
  };
  
  const handleViewAccount = () => {
    open({ view: 'Account' });
    setShowDropdown(false);
  };
  
  if (!mounted) return null;
  
  return (
    <header className="sticky top-0 z-10 backdrop-blur-sm bg-white/75 dark:bg-gray-900/75 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Crypto Dashboard
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleWalletClick}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              {isConnected 
                ? `${address?.substring(0, 6)}...${address?.substring(address!.length - 4)}`
                : 'Connect Wallet'}
            </button>
            
            {showDropdown && isConnected && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-xl z-20 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleViewAccount}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  View Account
                </button>
                <Link 
                  href="/wallet" 
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setShowDropdown(false)}
                >
                  Transfer Tokens
                </Link>
                <button
                  onClick={handleDisconnect}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 