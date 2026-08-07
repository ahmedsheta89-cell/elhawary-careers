/**
 * Contact Page Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input, Textarea } from '@/app/components/ui/input';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-alternate" dir="rtl">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              تواصل معنا
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              نحن هنا للإجابة على جميع استفساراتك ومساعدتك في رحلتك المهنية
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  معلومات التواصل
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  يمكنك التواصل معنا عبر أي من القنوات التالية، وسنرد عليك في أقرب وقت ممكن
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">العنوان</h3>
                    <p className="text-text-secondary">
                      جمهورية مصر العربية<br />
                      المقر الرئيسي - القاهرة
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">الهاتف</h3>
                    <p className="text-text-secondary">
                      +20 2 XXXX XXXX<br />
                      +20 1XXX XXX XXX
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">البريد الإلكتروني</h3>
                    <p className="text-text-secondary">
                      careers@elhawary.com<br />
                      hr@elhawary.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">ساعات العمل</h3>
                    <p className="text-text-secondary">
                      الأحد - الخميس<br />
                      9:00 صباحاً - 6:00 مساءً
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <Card>
                <CardContent padding="md">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-success-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-text-primary mb-2">
                      تواصل عبر واتساب
                    </h3>
                    <p className="text-sm text-text-secondary mb-4">
                      رد سريع على استفساراتك
                    </p>
                    <Button fullWidth variant="success" className="bg-success-600 hover:bg-success-700">
                      <MessageCircle className="w-4 h-4 ml-2" />
                      ابدأ المحادثة
                    </Button>
                  </div>
                </CardContent>
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
                <CardContent padding="lg">
                  <h2 className="text-2xl font-bold text-text-primary mb-6">
                    أرسل لنا رسالة
                  </h2>

                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
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

                    <div className="grid md:grid-cols-2 gap-6">
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
                        className="w-4 h-4 rounded border-border-default text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="consent" className="text-sm text-text-secondary">
                        أوافق على معالجة بيانات الشخصية وفقاً لسياسة الخصوصية
                      </label>
                    </div>

                    <Button size="lg" fullWidth type="submit">
                      <Send className="w-5 h-5 ml-2 rotate-180" />
                      إرسال الرسالة
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-background-alternate">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              مواقع فروعنا
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              أكثر من 50 فرع منتشرة في جميع أنحاء جمهورية مصر العربية
            </p>
          </motion.div>

          {/* Placeholder Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="aspect-video bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-2xl overflow-hidden relative"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary font-medium">خريطة الفروع</p>
                <p className="text-sm text-text-muted mt-2">
                  قريباً: خريطة تفاعلية لجميع الفروع
                </p>
              </div>
            </div>
            
            {/* Decorative map-like elements */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary-500 rounded-full animate-pulse" />
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-secondary-500 rounded-full animate-pulse delay-300" />
            <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-primary-400 rounded-full animate-pulse delay-500" />
            <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-secondary-400 rounded-full animate-pulse delay-700" />
          </motion.div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              أسئلة شائعة
            </h2>
            <p className="text-text-secondary">
              إجابات سريعة على الأسئلة الأكثر تكراراً
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: 'كيف يمكنني التقدم لوظيفة؟', a: 'يمكنك تصفح الوظائف المتاحة على موقعنا والتقديم مباشرة عبر نموذج التقديم الإلكتروني.' },
              { q: 'ما هي المستندات المطلوبة؟', a: 'السيرة الذاتية، صورة المؤهل الدراسي، وخطاب التوصية (اختياري).' },
              { q: 'كم تستغرق عملية التوظيف؟', a: 'عادة ما تستغرق من 2-4 أسابيع من تقديم الطلب حتى عرض التوظيف.' },
            ].map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-background-alternate rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-text-primary">
                  {faq.q}
                  <svg className="w-5 h-5 text-text-secondary transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-text-secondary leading-relaxed">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </div>

          <div className="text-center mt-8">
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
