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
    <div className="min-h-screen flex flex-col bg-background-default" dir="rtl">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export { MainLayout };
