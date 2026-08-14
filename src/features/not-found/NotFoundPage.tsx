/**
 * 404 Not Found Page Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { config } from '@/config';

const NotFoundPage: React.FC = () => {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 py-12"
      dir="rtl"
    >
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Animated 404 */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="mb-4 text-8xl font-bold text-primary-200 md:text-9xl">
              404
            </h1>
          </motion.div>

          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary-100"
          >
            <Search className="h-12 w-12 text-primary-600" />
          </motion.div>

          {/* Error Message */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-text-primary mb-4 text-3xl font-bold md:text-4xl"
          >
            الصفحة غير موجودة
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-text-secondary mb-8 text-lg leading-relaxed"
          >
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
            <br />
            يمكنك العودة للصفحة الرئيسية أو تصفح الوظائف المتاحة.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" asChild>
              <Link to="/">
                <Home className="ml-2 h-5 w-5" />
                الصفحة الرئيسية
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link to="/careers">
                <Search className="ml-2 h-5 w-5" />
                تصفح الوظائف
              </Link>
            </Button>

            <Button
              size="lg"
              variant="ghost"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              العودة للخلف
            </Button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="border-border-default mt-12 border-t pt-8"
          >
            <p className="text-text-muted mb-4 text-sm">روابط سريعة:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: 'الرئيسية', href: '/' },
                { label: 'الوظائف', href: '/careers' },
                { label: 'المزايا', href: '/benefits' },
                { label: 'من نحن', href: '/about' },
                { label: 'اتصل بنا', href: '/contact' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-text-secondary text-sm transition-colors hover:text-primary-600"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Help */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-text-muted mt-8 text-xs"
          >
            تحتاج مساعدة؟ تواصل معنا على{' '}
            <a
              href={`mailto:${config.contact.email}`}
              className="text-primary-600 hover:underline"
            >
              {config.contact.email}
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export { NotFoundPage };
