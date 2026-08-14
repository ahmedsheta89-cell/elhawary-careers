/**
 * Job Details Page Component
 */

import React from 'react';
import { useJob } from '@/hooks/useJobs';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  CATEGORY_LABELS,
  EXPERIENCE_LABELS,
  JOB_TYPE_LABELS,
} from '@/services/mockData';
import { MapPin, Briefcase, Clock, Users, CheckCircle } from 'lucide-react';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { job, isLoading, error } = useJob(id);

  if (isLoading) {
    return (
      <div
        className="bg-background-alternate flex min-h-screen items-center justify-center"
        dir="rtl"
      >
        <p className="text-text-secondary">جاري تحميل تفاصيل الوظيفة...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div
        className="bg-background-alternate flex min-h-screen items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <h1 className="text-text-primary mb-4 text-2xl font-bold">
            {error || 'الوظيفة غير موجودة'}
          </h1>
          <Button onClick={() => navigate('/careers')}>العودة للوظائف</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-alternate min-h-screen" dir="rtl">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 py-12 text-white md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/careers"
              className="mb-6 inline-flex items-center gap-2 text-primary-200 transition-colors hover:text-white"
            >
              <svg
                className="h-5 w-5 rotate-180"
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
              العودة للوظائف
            </Link>

            <Badge variant="secondary" size="lg" className="mb-4">
              {CATEGORY_LABELS[job.category]?.ar || job.category}
            </Badge>

            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              {job.title.ar}
            </h1>

            <div className="flex flex-wrap gap-4 text-primary-100 md:gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {job.location.city}, {job.location.governorate}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {JOB_TYPE_LABELS[job.type]?.ar || job.type}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                نُشرت منذ {new Date(job.postedDate).toLocaleDateString('ar-EG')}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {job.applicationCount} متقدم
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Description */}
              <Card>
                <div className="p-8">
                  <h2 className="text-text-primary mb-4 text-xl font-semibold">
                    وصف الوظيفة
                  </h2>
                  <p className="text-text-secondary leading-relaxed">
                    {job.description.ar}
                  </p>
                </div>
              </Card>

              {/* Responsibilities */}
              <Card>
                <div className="p-8">
                  <h2 className="text-text-primary mb-4 text-xl font-semibold">
                    المسؤوليات
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities.ar.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-500" />
                        <span className="text-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* Requirements */}
              <Card>
                <div className="p-8">
                  <h2 className="text-text-primary mb-4 text-xl font-semibold">
                    المتطلبات
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.ar.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500" />
                        <span className="text-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card - Sticky */}
              <div className="sticky top-24">
                <Card>
                  <div className="p-8">
                    <h3 className="text-text-primary mb-4 text-lg font-semibold">
                      تفاصيل الوظيفة
                    </h3>

                    <div className="mb-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">نوع الوظيفة</span>
                        <Badge variant="neutral">
                          {JOB_TYPE_LABELS[job.type]?.ar || job.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">
                          مستوى الخبرة
                        </span>
                        <Badge variant="neutral">
                          {EXPERIENCE_LABELS[job.experienceLevel]?.ar ||
                            job.experienceLevel}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">
                          المؤهل المطلوب
                        </span>
                        <Badge variant="neutral">بكالوريوس</Badge>
                      </div>
                      {job.salaryRange && (
                        <div className="flex items-center justify-between border-t pt-4">
                          <span className="text-text-secondary">الراتب</span>
                          <span className="text-text-primary font-semibold">
                            {job.salaryRange.min.toLocaleString()} -{' '}
                            {job.salaryRange.max.toLocaleString()} ج.م
                          </span>
                        </div>
                      )}
                    </div>

                    <Button fullWidth size="lg" asChild>
                      <Link to={`/apply/${job.id}`}>
                        قدم الآن
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

                    <p className="text-text-muted mt-4 text-center text-xs">
                      آخر موعد للتقديم:{' '}
                      {new Date(job.expiryDate).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Benefits */}
              <Card>
                <div className="p-8">
                  <h3 className="text-text-primary mb-4 text-lg font-semibold">
                    المزايا
                  </h3>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="text-text-secondary flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4 text-success-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* Location */}
              <Card>
                <div className="p-8">
                  <h3 className="text-text-primary mb-4 text-lg font-semibold">
                    مقر العمل
                  </h3>
                  <div className="text-text-secondary flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <div>
                      <p>{job.location.address}</p>
                      <p>
                        {job.location.city}, {job.location.governorate}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export { JobDetailsPage };
