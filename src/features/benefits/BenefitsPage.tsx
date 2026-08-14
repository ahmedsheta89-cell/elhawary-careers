/**
 * Benefits Page Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { BENEFITS_LIST } from '@/services/mockData';
import { staggerContainer, fadeAnimations } from '@/styles/tokens.animation';
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

const BenefitsPage: React.FC = () => {
  return (
    <div className="bg-background-alternate min-h-screen" dir="rtl">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary-600 to-secondary-800 py-20 text-white md:py-28">
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
              المزايا والعوائد
            </Badge>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              لماذا نعمل في صيدلية الهواري؟
            </h1>
            <p className="text-xl leading-relaxed text-secondary-100">
              نقدم حزمة شاملة من المزايا والعوائد لدعمك أنت وعائلتك
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Benefits Grid */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {BENEFITS_LIST.map((benefit, index) => (
              <motion.div key={index} variants={fadeAnimations.fadeInUp}>
                <Card hoverable className="h-full">
                  <div className="p-8">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg">
                      {benefitIcons[benefit.icon] || (
                        <Heart className="h-8 w-8" />
                      )}
                    </div>
                    <h3 className="text-text-primary mb-3 text-xl font-semibold">
                      {benefit.title.ar}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {benefit.description.ar}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Additional Benefits */}
      <section className="bg-background-alternate py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-text-primary mb-4 text-3xl font-bold md:text-4xl">
              مزايا إضافية
            </h2>
            <p className="text-text-secondary mx-auto max-w-2xl text-lg">
              المزيد من العوائد التي نقدمها لموظفينا
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                icon: <GraduationCap className="h-6 w-6" />,
                title: 'منح دراسية',
                description: 'دعم مالي للدراسات العليا والدورات المتخصصة',
              },
              {
                icon: <ShieldCheck className="h-6 w-6" />,
                title: 'تأمين على الحياة',
                description: 'حماية مالية إضافية لك ولعائلتك',
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: 'أنشطة فريق',
                description: 'فعاليات ترفيهية واجتماعية دورية',
              },
              {
                icon: <Award className="h-6 w-6" />,
                title: 'برنامج الإحالة',
                description: 'مكافآت عند ترشيح كوادر متميزة',
              },
              {
                icon: <Smile className="h-6 w-6" />,
                title: 'عيادة داخلية',
                description: 'خدمات طبية مجانية في المقر الرئيسي',
              },
              {
                icon: <DollarSign className="h-6 w-6" />,
                title: 'خصومات خاصة',
                description: 'خصومات على منتجات الصيدلية للموظفين',
              },
              {
                icon: <Clock className="h-6 w-6" />,
                title: 'إجازة أمومة/أبوة',
                description: 'إجازات عائلية مدفوعة الأجر',
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: 'خطة تقاعد',
                description: 'برنامج ادخار للتقاعد المبكر',
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeAnimations.fadeInUp}>
                <Card className="h-full">
                  <div className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600">
                      {item.icon}
                    </div>
                    <h3 className="text-text-primary mb-2 text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Career Growth Section */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                مسار النمو المهني
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-primary-100">
                نؤمن بالاستثمار في موظفينا ونوفر مسارات ترقية واضحة ومعتمدة. من
                خلال برامج التدريب والتطوير المستمر، يمكنك التقدم في مسارك
                المهني وتحقيق أهدافك.
              </p>

              <div className="space-y-4">
                {[
                  { level: 'مبتدئ', time: '0-2 سنة', color: 'bg-primary-600' },
                  {
                    level: 'متوسط',
                    time: '2-4 سنوات',
                    color: 'bg-primary-500',
                  },
                  { level: 'خبير', time: '4-6 سنوات', color: 'bg-primary-400' },
                  {
                    level: 'قيادي',
                    time: '6+ سنوات',
                    color: 'bg-secondary-500',
                  },
                ].map((stage, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`h-4 w-4 rounded-full ${stage.color}`} />
                    <div className="flex-1 rounded-lg bg-primary-700/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{stage.level}</span>
                        <span className="text-sm text-primary-200">
                          {stage.time}
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
                  <h3 className="mb-2 text-2xl font-bold">نمو لا محدود</h3>
                  <p className="text-primary-100">
                    فرص الترقية متاحة للجميع بناءً على الأداء والكفاءة
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-text-primary mb-4 text-3xl font-bold md:text-4xl">
              جاهز للانضمام؟
            </h2>
            <p className="text-text-secondary mb-8 text-lg">
              اكتشف الوظائف المتاحة وقدم طلبك اليوم لتصبح جزءاً من عائلتنا
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/careers">
                  تصفح الوظائف
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
                <Link to="/contact">تواصل معنا</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export { BenefitsPage };
