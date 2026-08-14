/**
 * Success Page Component
 * Application success confirmation with animated success state
 */

import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { config } from '@/config';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { CheckCircle, MessageCircle, Home, Share2 } from 'lucide-react';

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('ref') || 'سيظهر بعد تأكيد الطلب';
  const whatsappNumber = config.contact.phone.replace(/[^0-9]/g, '');

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-success-50 to-success-100 py-12"
      dir="rtl"
    >
      <div className="container mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        >
          <Card className="overflow-hidden text-center">
            <div className="p-8 py-12">
              {/* Animated Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success-100"
              >
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <CheckCircle className="h-14 w-14 text-success-600" />
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
                  className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: [
                      '#22c55e',
                      '#3b82f6',
                      '#f59e0b',
                      '#ef4444',
                      '#8b5cf6',
                      '#ec4899',
                    ][i],
                  }}
                />
              ))}

              {/* Success Message */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-text-primary mb-4 text-2xl font-bold md:text-3xl"
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
                سيقوم فريق الموارد البشرية بمراجعة طلبك والتواصل معك خلال 5 أيام
                عمل.
              </motion.p>

              {/* Reference Number */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-8 rounded-lg bg-neutral-100 p-4"
              >
                <p className="text-text-muted mb-1 text-sm">
                  رقم الطلب المرجعي
                </p>
                <p className="text-text-primary font-mono text-xl font-bold">
                  {reference}
                </p>
              </motion.div>

              {/* What's Next */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="border-info-200 mb-8 rounded-lg border bg-info-50 p-4 text-right"
              >
                <h3 className="text-info-800 mb-2 flex items-center gap-2 font-semibold">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  الخطوات التالية:
                </h3>
                <ul className="space-y-2 pr-7 text-right text-sm text-info-700">
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
                  className="bg-success-600 text-white hover:bg-success-700"
                  asChild
                >
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="ml-2 h-5 w-5" />
                    تواصل عبر واتساب
                  </a>
                </Button>

                <div className="flex gap-3">
                  <Button fullWidth variant="outline" asChild>
                    <Link to="/">
                      <Home className="ml-2 h-4 w-4" />
                      الرئيسية
                    </Link>
                  </Button>

                  <Button fullWidth variant="outline" asChild>
                    <Link to="/careers">
                      <Share2 className="ml-2 h-4 w-4" />
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
                className="text-text-muted mt-8 text-xs"
              >
                للاستفسارات: {config.contact.email} | {config.contact.phone}
              </motion.p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export { SuccessPage };
