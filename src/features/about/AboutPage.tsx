/**
 * About Page Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { staggerContainer, fadeAnimations } from '@/styles/tokens.animation';
import { getSiteText } from '@/services/siteContentService';
import { useSiteContent } from '@/hooks/useSiteContent';
import { Award, Target, Heart, Users, TrendingUp, Shield } from 'lucide-react';

const valueIcons = [
  <Heart className="h-8 w-8" />,
  <Shield className="h-8 w-8" />,
  <Users className="h-8 w-8" />,
  <Target className="h-8 w-8" />,
  <Award className="h-8 w-8" />,
  <TrendingUp className="h-8 w-8" />,
];

const AboutPage: React.FC = () => {
  const { content } = useSiteContent();
  const about = content.pages.about;

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
              {getSiteText(about.title)}
            </h1>
            <p className="text-xl leading-relaxed text-primary-100">
              {getSiteText(about.description)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="primary" size="lg" className="mb-4">
                {getSiteText(about.storyBadge)}
              </Badge>
              <h2 className="text-text-primary mb-6 text-3xl font-bold md:text-4xl">
                {getSiteText(about.storyTitle)}
              </h2>
              <div className="text-text-secondary space-y-4 leading-relaxed">
                {about.storyParagraphs.map((paragraph, index) => (
                  <p key={index}>{getSiteText(paragraph)}</p>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200">
                <div className="p-8 text-center">
                  <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl">
                    <svg
                      className="h-20 w-20 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-primary-700">
                    {getSiteText(about.foundationLabel)}
                  </p>
                  <p className="text-primary-600">{getSiteText(about.foundationDescription)}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-900 py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {content.home.stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeAnimations.fadeInUp}
                className="text-center"
              >
                <div className="mb-2 text-4xl font-bold text-secondary-400 sm:text-5xl lg:text-6xl">
                  {stat.value}
                </div>
                <div className="text-lg font-medium text-primary-100">
                  {getSiteText(stat.label)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-text-primary mb-4 text-3xl font-bold md:text-4xl">
              {getSiteText(about.valuesTitle)}
            </h2>
            <p className="text-text-secondary mx-auto max-w-2xl text-lg">
              {getSiteText(about.valuesDescription)}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {about.values.map((value, index) => (
              <motion.div key={index} variants={fadeAnimations.fadeInUp}>
                <Card hoverable className="h-full">
                  <div className="p-8">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                      {valueIcons[index % valueIcons.length]}
                    </div>
                    <h3 className="text-text-primary mb-2 text-xl font-semibold">
                      {getSiteText(value.title)}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {getSiteText(value.description)}
                    </p>
                  </div>
                </Card>
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
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              {getSiteText(about.ctaTitle)}
            </h2>
            <p className="mb-8 text-lg text-secondary-100">
              {getSiteText(about.ctaDescription)}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="neutral" asChild>
                <Link to="/careers">{getSiteText(about.ctaPrimary)}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/benefits">{getSiteText(about.ctaSecondary)}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export { AboutPage };
