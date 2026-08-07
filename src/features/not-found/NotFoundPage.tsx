/**
 * 404 Not Found Page Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center py-12" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
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
            <h1 className="text-8xl md:text-9xl font-bold text-primary-200 mb-4">
              404
            </h1>
          </motion.div>

          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary-100 flex items-center justify-center"
          >
            <Search className="w-12 h-12 text-primary-600" />
          </motion.div>

          {/* Error Message */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-text-primary mb-4"
          >
            الصفحة غير موجودة
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-text-secondary mb-8 leading-relaxed"
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
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" asChild>
              <Link to="/">
                <Home className="w-5 h-5 ml-2" />
                الصفحة الرئيسية
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link to="/careers">
                <Search className="w-5 h-5 ml-2" />
                تصفح الوظائف
              </Link>
            </Button>

            <Button size="lg" variant="ghost" onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
              العودة للخلف
            </Button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 pt-8 border-t border-border-default"
          >
            <p className="text-sm text-text-muted mb-4">روابط سريعة:</p>
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
                  className="text-sm text-text-secondary hover:text-primary-600 transition-colors"
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
            className="mt-8 text-xs text-text-muted"
          >
            تحتاج مساعدة؟ تواصل معنا على{' '}
            <a href="mailto:careers@elhawary.com" className="text-primary-600 hover:underline">
              careers@elhawary.com
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export { NotFoundPage };
