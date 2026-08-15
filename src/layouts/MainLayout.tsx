/**
 * Main Layout Component
 * Wraps pages with Header and Footer and applies editable site theme.
 */

import React from 'react';
import { Header, Footer } from '@/app/components/layout';
import { useSiteContent } from '@/hooks/useSiteContent';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { content } = useSiteContent();
  const { theme } = content;

  return (
    <div
      className="bg-background-default flex min-h-screen flex-col"
      dir="rtl"
      style={{
        '--site-primary': theme.primaryColor,
        '--site-secondary': theme.secondaryColor,
        '--site-accent': theme.accentColor,
        '--site-surface': theme.surfaceColor,
      } as React.CSSProperties}
    >
      {theme.customCss ? <style>{theme.customCss}</style> : null}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export { MainLayout };
