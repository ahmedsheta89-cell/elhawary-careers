/**
 * Success Page Component
 * Application success confirmation with animated success state
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { CheckCircle, MessageCircle, Home, Share2 } from 'lucide-react';

const SuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-success-50 to-success-100 flex items-center justify-center py-12" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        >
          <Card className="text-center overflow-hidden">
            <div className="p-8 py-12">
              {/* Animated Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-success-100 flex items-center justify-center"
              >
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <CheckCircle className="w-14 h-14 text-success-600" />
                </motion.div>
              </motion.div>

              {/* Confetti-like particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: Math.cos((i * 60 * Math.PI) / 180) * 100,
                    y: Math.sin((i * 60 * Math.PI) / 180) * 100,
                  }}
                  transition={{
                    delay: 0.5 + i * 0.1,
                    duration: 0.8,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][i],
                  }}
                />
              ))}

              {/* Success Message */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-bold text-text-primary mb-4"
              >
                تم إرسال طلبك بنجاح!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-text-secondary mb-8 leading-relaxed"
              >
                نشكرك على اهتمامك بالانضمام إلى فريق صيدلية الهواري.
                <br />
                سيقوم فريق الموارد البشرية بمراجعة طلبك والتواصل معك خلال 5 أيام عمل.
              </motion.p>

              {/* Reference Number */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-neutral-100 rounded-lg p-4 mb-8"
              >
                <p className="text-sm text-text-muted mb-1">رقم الطلب المرجعي</p>
                <p className="text-xl font-mono font-bold text-text-primary">
                  ELP-{Date.now().toString().slice(-8)}
                </p>
              </motion.div>

              {/* What's Next */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-right bg-info-50 border border-info-200 rounded-lg p-4 mb-8"
              >
                <h3 className="font-semibold text-info-800 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  الخطوات التالية:
                </h3>
                <ul className="text-sm text-info-700 space-y-2 text-right pr-7">
                  <li>• راقب بريدك الإلكتروني للتحديثات</li>
                  <li>• تحقق من مجلد البريد العشوائي</li>
                  <li>• احتفظ برقم الطلب المرجعي</li>
                  <li>• يمكنكم التواصل معنا للاستفسار</li>
                </ul>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col gap-3"
              >
                <Button
                  fullWidth
                  size="lg"
                  variant="success"
                  className="bg-success-600 hover:bg-success-700 text-white"
                  asChild
                >
                  <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 ml-2" />
                    تواصل عبر واتساب
                  </a>
                </Button>

                <div className="flex gap-3">
                  <Button fullWidth variant="outline" asChild>
                    <Link to="/">
                      <Home className="w-4 h-4 ml-2" />
                      الرئيسية
                    </Link>
                  </Button>

                  <Button fullWidth variant="outline" asChild>
                    <Link to="/careers">
                      <Share2 className="w-4 h-4 ml-2" />
                      وظائف أخرى
                    </Link>
                  </Button>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-xs text-text-muted"
              >
                للاستفسارات: careers@elhawary.com | 01000000000
              </motion.p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export { SuccessPage };
