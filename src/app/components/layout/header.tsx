/**
 * Header Component
 * Main navigation header with logo and navigation links
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import { NAVIGATION_ITEMS } from '@/constants';
import { useSiteContent } from '@/hooks/useSiteContent';
import { getSiteText } from '@/services/siteContentService';

export interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { content } = useSiteContent();
  const text = getSiteText;

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={cn(
        'border-border-default sticky top-0 z-sticky w-full border-b bg-white/90 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between md:min-h-20">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 shadow-lg transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl md:h-12 md:w-12">
                <svg
                  className="h-6 w-6 text-white md:h-7 md:w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-text-primary text-lg font-bold md:text-xl">
                  {content.brand.nameAr}
                </h1>
                <p className="text-text-muted -mt-1 text-xs">
                  {content.brand.nameEn}
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={cn(
                  'rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200',
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100'
                    : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'
                )}
              >
                {getSiteText(content.header[`${item.key}Label` as keyof typeof content.header] ?? { ar: item.labelAr, en: item.labelAr })}
              </Link>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden items-center gap-4 md:flex">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin">{text(content.header.loginLabel)}</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/careers">
                {text(content.header.applyLabel)}
                <svg
                className="mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
                </svg>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-text-secondary hover:text-text-primary rounded-xl p-2.5 transition-colors hover:bg-neutral-100 md:hidden"
            aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.svg
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </motion.svg>
              ) : (
                <motion.svg
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              id="mobile-navigation"
              className="border-border-default overflow-hidden border-t md:hidden"
            >
              <nav className="space-y-2 py-4">
                {NAVIGATION_ITEMS.map((item) => (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'block rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200',
                      isActive(item.path)
                        ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100'
                        : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'
                    )}
                  >
                    {getSiteText(content.header[`${item.key}Label` as keyof typeof content.header] ?? { ar: item.labelAr, en: item.labelAr })}
                  </Link>
                ))}
                <div className="border-border-default mt-4 space-y-3 border-t pt-4">
                  <Button asChild variant="outline" fullWidth>
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      {text(content.header.loginLabel)}
                    </Link>
                  </Button>
                  <Button asChild fullWidth>
                    <Link to="/careers" onClick={() => setIsMobileMenuOpen(false)}>
                      {text(content.header.applyLabel)}
                    </Link>
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export { Header };
