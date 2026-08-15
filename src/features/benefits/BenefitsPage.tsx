/**
 * Benefits Page Component
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
import {
  Heart,
  TrendingUp,
  DollarSign,
  Clock,
  Car,
  Smile,
  GraduationCap,
  ShieldCheck,
  Users,
  Award,
} from 'lucide-react';

const benefitIcons: Record<string, React.ReactNode> = {
  health: <Heart className="h-8 w-8" />,
  growth: <TrendingUp className="h-8 w-8" />,
  bonus: <DollarSign className="h-8 w-8" />,
  balance: <Clock className="h-8 w-8" />,
  transport: <Car className="h-8 w-8" />,
  environment: <Smile className="h-8 w-8" />,
};

const additionalIcons = [
  <GraduationCap className="h-6 w-6" />,
  <ShieldCheck className="h-6 w-6" />,
  <Users className="h-6 w-6" />,
  <Award className="h-6 w-6" />,
  <Smile className="h-6 w-6" />,
  <DollarSign className="h-6 w-6" />,
  <Clock className="h-6 w-6" />,
  <TrendingUp className="h-6 w-6" />,
];

const BenefitsPage: React.FC = () => {
  const { content } = useSiteContent();
  const benefits = content.pages.benefits;
  const appearance = benefits.appearance;

  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: appearance.sectionBackground }}>
      {/* Hero Section */}
      <section
        className="py-20 md:py-28"
        style={{ backgroundImage: `linear-gradient(135deg, ${appearance.heroFrom}, ${appearance.heroTo})` }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-center"
          >
            <Badge
              variant="secondary"
              size="lg"
              className="mb-4 bg-white/20 text-white"
            >
              {getSiteText(benefits.eyebrow)}
            </Badge>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl" style={{ color: appearance.heroText }}>
              {getSiteText(benefits.title)}
            </h1>
            <p className="text-xl leading-relaxed" style={{ color: appearance.heroMuted }}>
              {getSiteText(benefits.description)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Benefits Grid */}
      <section className="py-20" style={{ backgroundColor: appearance.sectionBackground }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {benefits.items.map((benefit, index) => (
              <motion.div key={index} variants={fadeAnimations.fadeInUp}>
                <Card hoverable className="h-full" style={{ backgroundColor: appearance.cardBackground, borderColor: appearance.cardBorder }}>
                  <div className="p-8">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundImage: `linear-gradient(135deg, ${appearance.accent}, ${appearance.heroTo})` }}>
                      {benefitIcons[benefit.icon] || (
                        <Heart className="h-8 w-8" />
                      )}
                    </div>
                    <h3 className="text-text-primary mb-3 text-xl font-semibold">
                      {getSiteText(benefit.title)}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {getSiteText(benefit.description)}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Additional Benefits */}
      {appearance.showAdditional && (
      <section className="py-20" style={{ backgroundColor: appearance.sectionBackground }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-text-primary mb-4 text-3xl font-bold md:text-4xl">
              {getSiteText(benefits.additionalTitle)}
            </h2>
            <p className="text-text-secondary mx-auto max-w-2xl text-lg">
              {getSiteText(benefits.additionalDescription)}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {benefits.additionalItems.map((item, index) => (
              <motion.div key={index} variants={fadeAnimations.fadeInUp}>
                <Card className="h-full" style={{ backgroundColor: appearance.cardBackground, borderColor: appearance.cardBorder }}>
                  <div className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: appearance.cardBorder, color: appearance.accent }}>
                      {additionalIcons[index % additionalIcons.length]}
                    </div>
                    <h3 className="text-text-primary mb-2 text-lg font-semibold">
                      {getSiteText(item.title)}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {getSiteText(item.description)}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      )}

      {/* Career Growth Section */}
      {appearance.showGrowth && (
      <section className="py-20" style={{ backgroundImage: `linear-gradient(135deg, ${appearance.heroTo}, ${appearance.heroFrom})`, color: appearance.heroText }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                {getSiteText(benefits.growthTitle)}
              </h2>
              <p className="mb-8 text-lg leading-relaxed" style={{ color: appearance.heroMuted }}>
                {getSiteText(benefits.growthDescription)}
              </p>

              <div className="space-y-4">
                {benefits.growthStages.map((stage, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`h-4 w-4 rounded-full ${['bg-primary-600', 'bg-primary-500', 'bg-primary-400', 'bg-secondary-500'][index % 4]}`} />
                    <div className="flex-1 rounded-lg bg-primary-700/50 p-4">
                      <div className="flex items-center justify-between">
                          <span className="font-semibold">{getSiteText(stage.level)}</span>
                          <span className="text-sm" style={{ color: appearance.heroMuted }}>
                            {getSiteText(stage.time)}
                          </span>
                      </div>
                    </div>
                  </div>
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
              <div className="aspect-square rounded-2xl border border-white/10 bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 p-8 backdrop-blur-sm">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 shadow-2xl">
                    <TrendingUp className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">{getSiteText(benefits.growthHighlightTitle)}</h3>
                  <p className="text-primary-100">
                    {getSiteText(benefits.growthHighlightDescription)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* CTA Section */}
      {appearance.showCta && (
      <section className="py-20" style={{ backgroundColor: appearance.sectionBackground }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-text-primary mb-4 text-3xl font-bold md:text-4xl">
              {getSiteText(benefits.ctaTitle)}
            </h2>
            <p className="text-text-secondary mb-8 text-lg">
              {getSiteText(benefits.ctaDescription)}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/careers">
                  {getSiteText(benefits.ctaPrimary)}
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
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">{getSiteText(benefits.ctaSecondary)}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      )}
    </div>
  );
};

export { BenefitsPage };
