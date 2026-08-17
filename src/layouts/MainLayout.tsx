/**
 * Main Layout Component
 * Wraps pages with Header and Footer and applies editable site theme.
 */

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header, Footer } from '@/app/components/layout';
import { useSiteContent } from '@/hooks/useSiteContent';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { content } = useSiteContent();
  const { theme } = content;
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const pageTitle = path === '/'
      ? 'وظائف صيدلية الهواري'
      : path === '/careers'
        ? 'الوظائف المتاحة'
        : path.startsWith('/jobs/')
          ? 'تفاصيل الوظيفة'
          : path.startsWith('/apply/')
            ? 'التقديم على وظيفة'
            : path.startsWith('/success/')
              ? 'تم استلام طلبك'
              : path === '/about'
                ? 'من نحن'
                : path === '/benefits'
                  ? 'المزايا والعوائد'
                  : path === '/contact'
                    ? 'اتصل بنا'
                    : path === '/privacy'
                      ? 'سياسة الخصوصية'
                      : path === '/terms'
                        ? 'الشروط والأحكام'
                        : path === '/admin'
                          ? 'لوحة الإدارة'
                          : 'صيدلية الهواري';

    document.title = `${pageTitle} | ${content.brand.nameAr}`;
  }, [content.brand.nameAr, location.pathname]);

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
      <a
        href="#main-content"
        className="sr-only fixed right-4 top-4 z-[100] rounded-xl bg-sky-700 px-4 py-3 text-sm font-bold text-white shadow-lg focus:not-sr-only"
      >
        الانتقال إلى المحتوى الرئيسي
      </a>
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  );
};

export { MainLayout };
