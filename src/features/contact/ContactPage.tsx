/**
 * Contact Page Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input, Textarea } from '@/app/components/ui/input';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { config } from '@/config';
import { useSiteContent } from '@/hooks/useSiteContent';
import { getSiteText } from '@/services/siteContentService';

const ContactPage: React.FC = () => {
  const { content } = useSiteContent();
  const { contact } = content.pages;
  const whatsappNumber = content.site.phone.replace(/[^0-9]/g, '') || config.contact.phone.replace(/[^0-9]/g, '');

  return (
    <div className="bg-background-alternate min-h-screen" dir="rtl">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 py-20 text-white md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              {getSiteText(contact.title)}
            </h1>
            <p className="text-xl leading-relaxed text-primary-100">
              {getSiteText(contact.description)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-text-primary mb-6 text-2xl font-bold">
                  {getSiteText(contact.infoTitle)}
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {getSiteText(contact.infoDescription)}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-text-primary mb-1 font-semibold">
                      العنوان
                    </h3>
                    <p className="text-text-secondary">
                      جمهورية مصر العربية
                      <br />
                      المقر الرئيسي - القاهرة
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-text-primary mb-1 font-semibold">
                      الهاتف
                    </h3>
                    <p className="text-text-secondary">
                      {content.site.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-text-primary mb-1 font-semibold">
                      البريد الإلكتروني
                    </h3>
                    <p className="text-text-secondary">
                      {content.site.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-text-primary mb-1 font-semibold">
                      ساعات العمل
                    </h3>
                    <p className="text-text-secondary">
                      الأحد - الخميس
                      <br />
                      9:00 صباحاً - 6:00 مساءً
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <Card>
                <div className="p-6">
                  <div className="text-center">
                    <MessageCircle className="mx-auto mb-3 h-12 w-12 text-success-500" />
                    <h3 className="text-text-primary mb-2 font-semibold">
                      تواصل عبر واتساب
                    </h3>
                    <p className="text-text-secondary mb-4 text-sm">
                      رد سريع على استفساراتك
                    </p>
                    <Button
                      fullWidth
                      variant="success"
                      className="bg-success-600 hover:bg-success-700"
                      asChild
                    >
                      <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="ml-2 h-4 w-4" />
                        {getSiteText(contact.whatsappLabel)}
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <Card>
                <div className="p-8">
                  <h2 className="text-text-primary mb-6 text-2xl font-bold">
                      {getSiteText(contact.formTitle)}
                  </h2>

                  <form className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Input
                        label="الاسم الكامل"
                        placeholder="أحمد محمد علي"
                        required
                      />
                      <Input
                        label="البريد الإلكتروني"
                        type="email"
                        placeholder="example@email.com"
                        required
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Input
                        label="رقم الهاتف"
                        type="tel"
                        placeholder="+20 1XX XXX XXXX"
                      />
                      <Input
                        label="الموضوع"
                        placeholder="استفسار عن وظيفة"
                        required
                      />
                    </div>

                    <Textarea
                      label="الرسالة"
                      placeholder="اكتب رسالتك هنا..."
                      rows={6}
                      required
                    />

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="consent"
                        className="border-border-default h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                      />
                      <label
                        htmlFor="consent"
                        className="text-text-secondary text-sm"
                      >
                        أوافق على معالجة بيانات الشخصية وفقاً لسياسة الخصوصية
                      </label>
                    </div>

                    <Button size="lg" fullWidth type="submit">
                      <Send className="ml-2 h-5 w-5 rotate-180" />
                      إرسال الرسالة
                    </Button>
                  </form>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-background-alternate py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-text-primary mb-4 text-3xl font-bold">
              مواقع فروعنا
            </h2>
            <p className="text-text-secondary mx-auto max-w-2xl">
              أكثر من 50 فرع منتشرة في جميع أنحاء جمهورية مصر العربية
            </p>
          </motion.div>

          {/* Placeholder Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-200 to-neutral-300"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="text-text-muted mx-auto mb-4 h-16 w-16" />
                <p className="text-text-secondary font-medium">خريطة الفروع</p>
                <p className="text-text-muted mt-2 text-sm">
                  قريباً: خريطة تفاعلية لجميع الفروع
                </p>
              </div>
            </div>

            {/* Decorative map-like elements */}
            <div className="absolute left-1/4 top-1/4 h-4 w-4 animate-pulse rounded-full bg-primary-500" />
            <div className="absolute right-1/3 top-1/3 h-3 w-3 animate-pulse rounded-full bg-secondary-500 delay-300" />
            <div className="absolute bottom-1/3 left-1/3 h-3 w-3 animate-pulse rounded-full bg-primary-400 delay-500" />
            <div className="absolute bottom-1/4 right-1/4 h-4 w-4 animate-pulse rounded-full bg-secondary-400 delay-700" />
          </motion.div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="bg-white py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-text-primary mb-4 text-3xl font-bold">
              أسئلة شائعة
            </h2>
            <p className="text-text-secondary">
              إجابات سريعة على الأسئلة الأكثر تكراراً
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: 'كيف يمكنني التقدم لوظيفة؟',
                a: 'يمكنك تصفح الوظائف المتاحة على موقعنا والتقديم مباشرة عبر نموذج التقديم الإلكتروني.',
              },
              {
                q: 'ما هي المستندات المطلوبة؟',
                a: 'السيرة الذاتية، صورة المؤهل الدراسي، وخطاب التوصية (اختياري).',
              },
              {
                q: 'كم تستغرق عملية التوظيف؟',
                a: 'عادة ما تستغرق من 2-4 أسابيع من تقديم الطلب حتى عرض التوظيف.',
              },
            ].map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background-alternate group overflow-hidden rounded-xl"
              >
                <summary className="text-text-primary flex cursor-pointer list-none items-center justify-between p-6 font-semibold">
                  {faq.q}
                  <svg
                    className="text-text-secondary h-5 w-5 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="text-text-secondary px-6 pb-6 leading-relaxed">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <a href="/#faq">عرض كل الأسئلة الشائعة</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export { ContactPage };
