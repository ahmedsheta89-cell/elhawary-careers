/**
 * Home Page Component
 * Premium healthcare landing page with all sections
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  STATS,
  TESTIMONIALS,
  HIRING_PROCESS,
  FAQ_ITEMS,
  MOCK_JOBS,
  CATEGORY_LABELS,
} from '@/services/mockData';
import { fadeAnimations, staggerContainer } from '@/styles/tokens.animation';

const HomePage: React.FC = () => {
  return (
    <div className="overflow-x-hidden" dir="rtl">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-300 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9IkMwIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" size="lg" className="mb-6">
              🏥 انضم إلى فريقنا الطبي المتميز
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              ابنِ مستقبلك المهني مع
              <span className="block mt-2 text-secondary-300">
                صيدلية الهواري
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              نبحث عن الكوادر الطبية والخدمية الطموحة للانضمام إلى واحدة من 
              أكبر سلاسل الصيدليات في مصر. فرص نمو لا محدودة وبيئة عمل محفزة.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 shadow-xl hover:shadow-2xl"
                asChild
              >
                <Link to="/careers">
                  تصفح الوظائف المتاحة
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/about">
                  اعرف المزيد عنا
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label.ar}
                variants={fadeAnimations.fadeInUp}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-text-secondary font-medium">
                  {stat.label.ar}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-20 bg-background-alternate">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              لماذا تنضم إلينا؟
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg">
              نقدم بيئة عمل استثنائية تدعم نموك المهني والشخصي
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: 'تأمين صحي شامل',
                description: 'تغطية صحية متكاملة لك ولعائلتك في أفضل المستشفيات والمراكز الطبية',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                title: 'نمو مهني مستمر',
                description: 'برامج تدريبية متطورة وفرص ترقية واضحة لمسارك المهني',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'مكافآت مجزية',
                description: 'نظام مكافآت وحوافز تنافسي يعكس تقديرك وجهودك',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'فريق متميز',
                description: 'انضم إلى عائلة مهنية داعمة تقدر التعاون والإنجاز',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'فروع متعددة',
                description: 'فرص عمل في أكثر من 50 فرع across جمهورية مصر العربية',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: 'شهادات معتمدة',
                description: 'برامج تدريب معتمدة محلياً ودولياً لتطوير مهاراتك',
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeAnimations.fadeInUp}>
                <Card hoverable className="h-full">
                  <div className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
                أحدث الوظائف
              </h2>
              <p className="text-text-secondary text-lg">
                اكتشف الفرص المتاحة وانضم لفريقنا
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/careers">
                عرض كل الوظائف
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {MOCK_JOBS.slice(0, 3).map((job) => (
              <motion.div key={job.id} variants={fadeAnimations.fadeInUp}>
                <Card hoverable className="h-full">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="primary" size="sm">
                        {CATEGORY_LABELS[job.category]?.ar || job.category}
                      </Badge>
                      <span className="text-xs text-text-muted">
                        {new Date(job.postedDate).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {job.title.ar}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24/24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location.city}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="neutral" size="sm">
                        دوام كامل
                      </Badge>
                      {job.salaryRange && (
                        <Badge variant="success" size="sm">
                          {job.salaryRange.min.toLocaleString()} - {job.salaryRange.max.toLocaleString()} ج.م
                        </Badge>
                      )}
                    </div>
                    
                    <Button fullWidth asChild>
                      <Link to={`/jobs/${job.id}`}>
                        تفاصيل الوظيفة
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Hiring Process Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900 to-primary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              رحلة التوظيف
            </h2>
            <p className="text-primary-100 max-w-2xl mx-auto text-lg">
              خطوات بسيطة وواضحة للانضمام إلى فريقنا
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="relative"
          >
            {/* Connection Line - Desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary-600 -translate-y-1/2" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {HIRING_PROCESS.map((step) => (
                <motion.div
                  key={step.step}
                  variants={fadeAnimations.fadeInUp}
                  className="relative text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-500 flex items-center justify-center text-2xl font-bold shadow-lg relative z-10">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title.ar}</h3>
                  <p className="text-primary-100 text-sm">{step.description.ar}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background-alternate">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              قصص نجاح من فريقنا
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg">
              اسمع من زملائك عن تجربتهم في صيدلية الهواري
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid md:grid-cols-3 gap-8"
          >
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div key={idx} variants={fadeAnimations.fadeInUp}>
                <Card className="h-full">
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                        {testimonial.name.ar.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">
                          {testimonial.name.ar}
                        </h4>
                        <p className="text-sm text-text-secondary">
                          {testimonial.role.ar}
                        </p>
                      </div>
                    </div>
                    <blockquote className="text-text-secondary leading-relaxed">
                      "{testimonial.content.ar}"
                    </blockquote>
                    <div className="flex gap-1 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-warning-500" fill="currentColor" viewBox="0 0/20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              الأسئلة الشائعة
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg">
              إجابات على أسئلتك الأكثر تكراراً
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="max-w-3xl mx-auto space-y-4"
          >
            {FAQ_ITEMS.map((faq, _index) => (
              <motion.div key={stat.label} variants={fadeAnimations.fadeInUp}>
                <details className="group bg-background-alternate rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="text-lg font-semibold text-text-primary pr-4">
                      {faq.question.ar}
                    </h3>
                    <svg
                      className="w-5 h-5 text-text-secondary transition-transform group-open:rotate-180 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-text-secondary leading-relaxed">
                    {faq.answer.ar}
                  </div>
                </details>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary-600 to-secondary-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              جاهز لبدء رحلتك المهنية؟
            </h2>
            <p className="text-secondary-100 text-lg mb-8">
              تصفح وظائفنا المتاحة وقدم طلبك اليوم. نحن في انتظار انضمامك لعائلتنا
            </p>
            <Button
              size="lg"
              variant="neutral"
              className="text-lg px-8 shadow-xl"
              asChild
            >
              <Link to="/careers">
                شاهد جميع الوظائف
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export { HomePage };
