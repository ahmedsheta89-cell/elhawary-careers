/**
 * Main Layout Component
 * Wraps pages with Header and Footer
 */

import React from 'react';
import { Header, Footer } from '@/app/components/layout';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="bg-background-default flex min-h-screen flex-col" dir="rtl">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export { MainLayout };
