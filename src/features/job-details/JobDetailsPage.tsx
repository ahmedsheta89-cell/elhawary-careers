/**
 * Job Details Page Component
 */

import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { MOCK_JOBS, CATEGORY_LABELS, EXPERIENCE_LABELS, JOB_TYPE_LABELS } from '@/services/mockData';
import { MapPin, Briefcase, DollarSign, Clock, Users, CheckCircle } from 'lucide-react';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const job = MOCK_JOBS.find(j => j.id === id);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-alternate" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">الوظيفة غير موجودة</h1>
          <Button onClick={() => navigate('/careers')}>العودة للوظائف</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-alternate" dir="rtl">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-6 transition-colors"
            >
              <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              العودة للوظائف
            </Link>

            <Badge variant="secondary" size="lg" className="mb-4">
              {CATEGORY_LABELS[job.category]?.ar || job.category}
            </Badge>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{job.title.ar}</h1>

            <div className="flex flex-wrap gap-4 md:gap-6 text-primary-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {job.location.city}, {job.location.governorate}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {JOB_TYPE_LABELS[job.type]?.ar || job.type}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                نُشرت منذ {new Date(job.postedDate).toLocaleDateString('ar-EG')}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {job.applicationCount} متقدم
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardContent padding="lg">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">وصف الوظيفة</h2>
                  <p className="text-text-secondary leading-relaxed">{job.description.ar}</p>
                </CardContent>
              </Card>

              {/* Responsibilities */}
              <Card>
                <CardContent padding="lg">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">المسؤوليات</h2>
                  <ul className="space-y-3">
                    {job.responsibilities.ar.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                        <span className="text-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardContent padding="lg">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">المتطلبات</h2>
                  <ul className="space-y-3">
                    {job.requirements.ar.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                        <span className="text-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card - Sticky */}
              <div className="sticky top-24">
                <Card>
                  <CardContent padding="lg">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">تفاصيل الوظيفة</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">نوع الوظيفة</span>
                        <Badge variant="neutral">{JOB_TYPE_LABELS[job.type]?.ar || job.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">مستوى الخبرة</span>
                        <Badge variant="neutral">{EXPERIENCE_LABELS[job.experienceLevel]?.ar || job.experienceLevel}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">المؤهل المطلوب</span>
                        <Badge variant="neutral">بكالوريوس</Badge>
                      </div>
                      {job.salaryRange && (
                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-text-secondary">الراتب</span>
                          <span className="font-semibold text-text-primary">
                            {job.salaryRange.min.toLocaleString()} - {job.salaryRange.max.toLocaleString()} ج.م
                          </span>
                        </div>
                      )}
                    </div>

                    <Button fullWidth size="lg" asChild>
                      <Link to={`/apply/${job.id}`}>
                        قدم الآن
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </Button>

                    <p className="text-xs text-text-muted text-center mt-4">
                      آخر موعد للتقديم: {new Date(job.expiryDate).toLocaleDateString('ar-EG')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Benefits */}
              <Card>
                <CardContent padding="lg">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">المزايا</h3>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-text-secondary">
                        <CheckCircle className="w-4 h-4 text-success-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardContent padding="lg">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">مقر العمل</h3>
                  <div className="flex items-start gap-3 text-text-secondary">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p>{job.location.address}</p>
                      <p>{job.location.city}, {job.location.governorate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export { JobDetailsPage };
