'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './components/ThemeProvider';
import { ReactNode } from 'react';

import SmoothScroll from './components/SmoothScroll';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <SmoothScroll />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}