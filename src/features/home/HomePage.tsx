/**
 * Home Page Component
 * Premium healthcare landing page with all sections
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '@/hooks/useJobs';
import { useSiteContent } from '@/hooks/useSiteContent';
import { getSiteText } from '@/services/siteContentService';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  TESTIMONIALS,
  HIRING_PROCESS,
  FAQ_ITEMS,
  CATEGORY_LABELS,
} from '@/services/mockData';
import { fadeAnimations, staggerContainer } from '@/styles/tokens.animation';

const HomePage: React.FC = () => {
  const { jobs } = useJobs();
  const { content } = useSiteContent();
  const { home } = content;
  const featuredJobs = jobs.slice(0, 3);

  return (
    <div className="overflow-x-hidden" dir="rtl">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-10 top-20 h-72 w-72 animate-pulse rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-10 h-96 w-96 animate-pulse rounded-full bg-secondary-500 blur-3xl delay-1000" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 animate-pulse rounded-full bg-primary-300 blur-3xl delay-500" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9IkMwIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20" />

        <div className="container relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] }}
            className="max-w-3xl text-center lg:text-right"
          >
            <Badge variant="secondary" size="lg" className="mb-6">
              {getSiteText(home.heroEyebrow)}
            </Badge>

            <h1 className="mb-6 text-4xl font-black leading-[1.15] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {getSiteText(home.heroTitle)}
              <span className="mt-2 block text-secondary-300">
                {getSiteText(home.heroHighlight)}
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-primary-100 sm:text-xl lg:mx-0">
              {getSiteText(home.heroDescription)}
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 text-lg shadow-xl hover:shadow-2xl"
                asChild
              >
                <Link to="/careers">
                  {getSiteText(home.heroPrimaryCta)}
                  <svg
                    className="mr-2 h-5 w-5"
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
              <Button
                size="lg"
                variant="outline"
                className="border-white px-8 text-lg text-white hover:bg-white/10"
                asChild
              >
                <Link to="/about">{getSiteText(home.heroSecondaryCta)}</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="hero-panel relative mx-auto w-full max-w-md lg:mx-0"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="mb-1 text-sm font-semibold text-secondary-200">فرصتك القادمة</p>
                <p className="text-xl font-bold text-white">ابدأ بخطوة واحدة</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20" aria-hidden="true">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2Zm7 14 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              {featuredJobs.slice(0, 2).map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 transition-all hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold text-white">{job.title.ar}</p>
                    <p className="mt-1 text-sm text-primary-100">{job.location.city} · {CATEGORY_LABELS[job.category]?.ar || job.category}</p>
                  </div>
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-secondary-400/90 text-primary-950 transition-transform group-hover:-translate-x-1">←</span>
                </Link>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/15 pt-5">
              {home.stats.slice(0, 2).map((stat) => (
                <div key={stat.label.ar} className="rounded-2xl bg-black/10 p-3">
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-primary-100">{getSiteText(stat.label)}</p>
                </div>
              ))}
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
            className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30 pt-2"
          >
            <motion.div className="h-3 w-1.5 rounded-full bg-white/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
          >
            {home.stats.map((stat) => (
              <motion.div
                key={stat.label.ar}
                variants={fadeAnimations.fadeInUp}
                className="stat-tile"
              >
                <div className="mb-2 text-3xl font-black text-primary-700 sm:text-5xl">
                  {stat.value}
                </div>
                <div className="text-text-secondary font-medium">
                  {getSiteText(stat.label)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="bg-background-alternate py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-text-primary mb-4 text-3xl font-bold sm:text-4xl">
              {getSiteText(home.whyTitle)}
            </h2>
            <p className="text-text-secondary mx-auto max-w-2xl text-lg">
              {getSiteText(home.whyDescription)}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                icon: (
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                ),
                title: 'تأمين صحي شامل',
                description:
                  'تغطية صحية متكاملة لك ولعائلتك في أفضل المستشفيات والمراكز الطبية',
              },
              {
                icon: (
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                ),
                title: 'نمو مهني مستمر',
                description:
                  'برامج تدريبية متطورة وفرص ترقية واضحة لمسارك المهني',
              },
              {
                icon: (
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: 'مكافآت مجزية',
                description: 'نظام مكافآت وحوافز تنافسي يعكس تقديرك وجهودك',
              },
              {
                icon: (
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
                title: 'فريق متميز',
                description: 'انضم إلى عائلة مهنية داعمة تقدر التعاون والإنجاز',
              },
              {
                icon: (
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: 'فروع متعددة',
                description:
                  'فرص عمل في أكثر من 50 فرعاً في جميع أنحاء جمهورية مصر العربية',
              },
              {
                icon: (
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                ),
                title: 'شهادات معتمدة',
                description: 'برامج تدريب معتمدة محلياً ودولياً لتطوير مهاراتك',
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeAnimations.fadeInUp}>
                <Card hoverable className="h-full">
                  <div className="p-8">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                      {feature.icon}
                    </div>
                    <h3 className="text-text-primary mb-2 text-xl font-semibold">
                      {getSiteText(home.whyItems[index]?.title) || feature.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {getSiteText(home.whyItems[index]?.description) || feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
          >
            <div>
              <h2 className="text-text-primary mb-2 text-3xl font-bold sm:text-4xl">
                {getSiteText(home.jobsTitle)}
              </h2>
              <p className="text-text-secondary text-lg">
                {getSiteText(home.jobsDescription)}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/careers">
                {getSiteText(home.jobsCta)}
                <svg
                  className="mr-2 h-4 w-4"
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
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {featuredJobs.map((job) => (
              <motion.div key={job.id} variants={fadeAnimations.fadeInUp}>
                <Card hoverable className="h-full">
                  <div className="p-6">
                    <div className="mb-3 flex items-start justify-between">
                      <Badge variant="primary" size="sm">
                        {CATEGORY_LABELS[job.category]?.ar || job.category}
                      </Badge>
                      <span className="text-text-muted text-xs">
                        {new Date(job.postedDate).toLocaleDateString('ar-EG')}
                      </span>
                    </div>

                    <h3 className="text-text-primary mb-2 text-lg font-semibold">
                      {job.title.ar}
                    </h3>

                    <div className="text-text-secondary mb-4 flex items-center gap-2 text-sm">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {job.location.city}
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                      <Badge variant="neutral" size="sm">
                        دوام كامل
                      </Badge>
                      {job.salaryRange && (
                        <Badge variant="success" size="sm">
                          {job.salaryRange.min.toLocaleString()} -{' '}
                          {job.salaryRange.max.toLocaleString()} ج.م
                        </Badge>
                      )}
                    </div>

                    <Button fullWidth asChild>
                      <Link to={`/jobs/${job.id}`}>تفاصيل الوظيفة</Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Hiring Process Section */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              {getSiteText(home.processTitle)}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-primary-100">
              {getSiteText(home.processDescription)}
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
            <div className="absolute left-0 right-0 top-1/2 hidden h-0.5 -translate-y-1/2 bg-primary-600 lg:block" />

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {HIRING_PROCESS.map((step) => (
                <motion.div
                  key={step.step}
                  variants={fadeAnimations.fadeInUp}
                  className="relative text-center"
                >
                  <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary-500 text-2xl font-bold shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {step.title.ar}
                  </h3>
                  <p className="text-sm text-primary-100">
                    {step.description.ar}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-background-alternate py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-text-primary mb-4 text-3xl font-bold sm:text-4xl">
              قصص نجاح من فريقنا
            </h2>
            <p className="text-text-secondary mx-auto max-w-2xl text-lg">
              اسمع من زملائك عن تجربتهم في صيدلية الهواري
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-8 md:grid-cols-3"
          >
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div key={idx} variants={fadeAnimations.fadeInUp}>
                <Card className="h-full">
                  <div className="p-8">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 font-bold text-white">
                        {testimonial.name.ar.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-text-primary font-semibold">
                          {testimonial.name.ar}
                        </h4>
                        <p className="text-text-secondary text-sm">
                          {testimonial.role.ar}
                        </p>
                      </div>
                    </div>
                    <blockquote className="text-text-secondary leading-relaxed">
                      "{testimonial.content.ar}"
                    </blockquote>
                    <div className="mt-4 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5 text-warning-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
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
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-text-primary mb-4 text-3xl font-bold sm:text-4xl">
              {getSiteText(home.faqTitle)}
            </h2>
            <p className="text-text-secondary mx-auto max-w-2xl text-lg">
              {getSiteText(home.faqDescription)}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="mx-auto max-w-3xl space-y-4"
          >
            {FAQ_ITEMS.map((faq) => (
              <motion.div
                key={faq.question.ar}
                variants={fadeAnimations.fadeInUp}
              >
                <details className="bg-background-alternate group overflow-hidden rounded-xl">
                  <summary className="flex cursor-pointer list-none items-center justify-between p-6">
                    <h3 className="text-text-primary pr-4 text-lg font-semibold">
                      {faq.question.ar}
                    </h3>
                    <svg
                      className="text-text-secondary h-5 w-5 flex-shrink-0 transition-transform group-open:rotate-180"
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
                    {faq.answer.ar}
                  </div>
                </details>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-secondary-600 to-secondary-700 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              {getSiteText(home.finalCtaTitle)}
            </h2>
            <p className="mb-8 text-lg text-secondary-100">
              {getSiteText(home.finalCtaDescription)}
            </p>
            <Button
              size="lg"
              variant="neutral"
              className="px-8 text-lg shadow-xl"
              asChild
            >
              <Link to="/careers">{getSiteText(home.finalCtaButton)}</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export { HomePage };
