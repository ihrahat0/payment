'use client';

import { ReactNode } from 'react';
import ContextProvider from '@/context';
import Header from './Header';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ContextProvider>
      <Header />
      <div className="pt-2">
        {children}
      </div>
    </ContextProvider>
  );
} 