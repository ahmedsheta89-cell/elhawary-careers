/**
 * Careers Page Component
 * Job listings with filters, search, and pagination
 */

import React, { useState, useMemo } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Select } from '@/app/components/ui/select';
import {
  CATEGORY_LABELS,
  EXPERIENCE_LABELS,
  JOB_TYPE_LABELS,
} from '@/services/mockData';
import { fadeAnimations, staggerContainer } from '@/styles/tokens.animation';
import { useSiteContent } from '@/hooks/useSiteContent';
import { getSiteText } from '@/services/siteContentService';
import { Search, MapPin, Briefcase, DollarSign } from 'lucide-react';

const CareersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { jobs, isLoading, error, reload } = useJobs();
  const { content } = useSiteContent();
  const { careers } = content.pages;

  // Extract unique locations
  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(jobs.map((job) => job.location.city))];
    return uniqueLocations;
  }, [jobs]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.ar.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === 'all' || job.category === categoryFilter;
      const matchesLocation =
        locationFilter === 'all' || job.location.city === locationFilter;
      const matchesType = typeFilter === 'all' || job.type === typeFilter;
      const matchesExperience =
        experienceFilter === 'all' || job.experienceLevel === experienceFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesType &&
        matchesExperience
      );
    });
  }, [
    jobs,
    searchTerm,
    categoryFilter,
    locationFilter,
    typeFilter,
    experienceFilter,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    categoryFilter,
    locationFilter,
    typeFilter,
    experienceFilter,
  ]);

  const categoryOptions = [
    { value: 'all', label: 'جميع الأقسام' },
    ...Object.entries(CATEGORY_LABELS).map(([key, value]) => ({
      value: key,
      label: value.ar,
    })),
  ];

  const locationOptions = [
    { value: 'all', label: 'جميع المدن' },
    ...locations.map((city) => ({ value: city, label: city })),
  ];

  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    ...Object.entries(JOB_TYPE_LABELS).map(([key, value]) => ({
      value: key,
      label: value.ar,
    })),
  ];

  const experienceOptions = [
    { value: 'all', label: 'جميع المستويات' },
    ...Object.entries(EXPERIENCE_LABELS).map(([key, value]) => ({
      value: key,
      label: value.ar,
    })),
  ];

  if (isLoading) {
    return (
      <div
        className="bg-background-alternate flex min-h-screen items-center justify-center"
        dir="rtl"
      >
        <p className="text-text-secondary">جاري تحميل الوظائف...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-background-alternate flex min-h-screen flex-col items-center justify-center gap-4"
        dir="rtl"
      >
        <p className="text-danger-600">{error}</p>
        <Button onClick={() => void reload()}>إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div className="bg-background-alternate min-h-screen" dir="rtl">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 py-16 text-white md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              {getSiteText(careers.title)}
            </h1>
            <p className="text-lg text-primary-100">
              {getSiteText(careers.description)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="border-border-default sticky top-16 z-20 border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="ابحث عن وظيفة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-5 w-5" />}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select
                options={categoryOptions}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                placeholder="القسم"
                className="w-full sm:w-40"
              />
              <Select
                options={locationOptions}
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="الموقع"
                className="w-full sm:w-36"
              />
              <Select
                options={typeOptions}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                placeholder="النوع"
                className="w-full sm:w-36"
              />
              <Select
                options={experienceOptions}
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                placeholder="الخبرة"
                className="w-full sm:w-36"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-text-secondary text-sm">
              عرض {paginatedJobs.length} من {filteredJobs.length} وظيفة
            </p>
            {(categoryFilter !== 'all' ||
              locationFilter !== 'all' ||
              typeFilter !== 'all' ||
              experienceFilter !== 'all' ||
              searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setLocationFilter('all');
                  setTypeFilter('all');
                  setExperienceFilter('all');
                }}
              >
                مسح الفلاتر
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Jobs Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {paginatedJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100">
                <Briefcase className="text-text-muted h-12 w-12" />
              </div>
              <h3 className="text-text-primary mb-2 text-xl font-semibold">
                {getSiteText(careers.emptyTitle)}
              </h3>
              <p className="text-text-secondary mb-6">
                {getSiteText(careers.emptyDescription)}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setLocationFilter('all');
                  setTypeFilter('all');
                  setExperienceFilter('all');
                }}
              >
                إعادة تعيين الفلاتر
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {paginatedJobs.map((job) => (
                <motion.div key={job.id} variants={fadeAnimations.fadeInUp}>
                  <Card hoverable className="h-full">
                    <div className="p-6">
                      <div className="mb-3 flex items-start justify-between">
                        <Badge variant="primary" size="sm">
                          {CATEGORY_LABELS[job.category]?.ar || job.category}
                        </Badge>
                        <span className="text-text-muted text-xs">
                          {new Date(job.postedDate).toLocaleDateString(
                            'ar-EG',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                        </span>
                      </div>

                      <h3 className="text-text-primary mb-3 text-lg font-semibold">
                        {job.title.ar}
                      </h3>

                      <div className="mb-4 space-y-2">
                        <div className="text-text-secondary flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4" />
                          {job.location.city}, {job.location.governorate}
                        </div>
                        <div className="text-text-secondary flex items-center gap-2 text-sm">
                          <Briefcase className="h-4 w-4" />
                          {EXPERIENCE_LABELS[job.experienceLevel]?.ar ||
                            job.experienceLevel}
                        </div>
                        {job.salaryRange && (
                          <div className="text-text-secondary flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4" />
                            {job.salaryRange.min.toLocaleString()} -{' '}
                            {job.salaryRange.max.toLocaleString()} ج.م/شهر
                          </div>
                        )}
                      </div>

                      <div className="mb-4 flex flex-wrap gap-2">
                        <Badge variant="neutral" size="sm">
                          {JOB_TYPE_LABELS[job.type]?.ar || job.type}
                        </Badge>
                        <Badge variant="success" size="sm">
                          {job.benefits.length} مزايا
                        </Badge>
                      </div>

                      <Button fullWidth asChild>
                        <Link to={`/jobs/${job.id}`}>تفاصيل الوظيفة</Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 flex items-center justify-center gap-2"
            >
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                السابق
              </Button>

              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                التالي
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export { CareersPage };
