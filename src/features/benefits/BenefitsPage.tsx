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
import { Heart, TrendingUp, DollarSign, Clock, Car, Smile, GraduationCap, ShieldCheck, Users, Award } from 'lucide-react';

const benefitIcons: Record<string, React.ReactNode> = {
  health: <Heart className="w-8 h-8" />,
  growth: <TrendingUp className="w-8 h-8" />,
  bonus: <DollarSign className="w-8 h-8" />,
  balance: <Clock className="w-8 h-8" />,
  transport: <Car className="w-8 h-8" />,
  environment: <Smile className="w-8 h-8" />,
};

const BenefitsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-alternate" dir="rtl">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary-600 to-secondary-800 text-white py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" size="lg" className="mb-4 bg-white/20 text-white">
              المزايا والعوائد
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              لماذا نعمل في صيدلية الهواري؟
            </h1>
            <p className="text-xl text-secondary-100 leading-relaxed">
              نقدم حزمة شاملة من المزايا والعوائد لدعمك أنت وعائلتك
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Benefits Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {BENEFITS_LIST.map((benefit, index) => (
              <motion.div key={index} variants={fadeAnimations.fadeInUp}>
                <Card hoverable className="h-full">
                  <div className="p-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center mb-6 shadow-lg">
                      {benefitIcons[benefit.icon] || <Heart className="w-8 h-8" />}
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
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
      <section className="py-20 bg-background-alternate">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              مزايا إضافية
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg">
              المزيد من العوائد التي نقدمها لموظفينا
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: <GraduationCap className="w-6 h-6" />,
                title: 'منح دراسية',
                description: 'دعم مالي للدراسات العليا والدورات المتخصصة',
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: 'تأمين على الحياة',
                description: 'حماية مالية إضافية لك ولعائلتك',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'أنشطة فريق',
                description: 'فعاليات ترفيهية واجتماعية دورية',
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: 'برنامج الإحالة',
                description: 'مكافآت عند ترشيح كوادر متميزة',
              },
              {
                icon: <Smile className="w-6 h-6" />,
                title: 'عيادة داخلية',
                description: 'خدمات طبية مجانية في المقر الرئيسي',
              },
              {
                icon: <DollarSign className="w-6 h-6" />,
                title: 'خصومات خاصة',
                description: 'خصومات على منتجات الصيدلية للموظفين',
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'إجازة أمومة/أبوة',
                description: 'إجازات عائلية مدفوعة الأجر',
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'خطة تقاعد',
                description: 'برنامج ادخار للتقاعد المبكر',
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeAnimations.fadeInUp}>
                <Card className="h-full">
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-secondary-100 text-secondary-600 flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-text-secondary">
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
      <section className="py-20 bg-gradient-to-br from-primary-800 to-primary-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                مسار النمو المهني
              </h2>
              <p className="text-primary-100 text-lg leading-relaxed mb-8">
                نؤمن بالاستثمار في موظفينا ونوفر مسارات ترقية واضحة ومعتمدة. 
                من خلال برامج التدريب والتطوير المستمر، يمكنك التقدم في مسارك 
                المهني وتحقيق أهدافك.
              </p>
              
              <div className="space-y-4">
                {[
                  { level: 'مبتدئ', time: '0-2 سنة', color: 'bg-primary-600' },
                  { level: 'متوسط', time: '2-4 سنوات', color: 'bg-primary-500' },
                  { level: 'خبير', time: '4-6 سنوات', color: 'bg-primary-400' },
                  { level: 'قيادي', time: '6+ سنوات', color: 'bg-secondary-500' },
                ].map((stage, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full ${stage.color}`} />
                    <div className="flex-1 bg-primary-700/50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{stage.level}</span>
                        <span className="text-primary-200 text-sm">{stage.time}</span>
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
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 backdrop-blur-sm border border-white/10 p-8">
                <div className="h-full flex flex-col justify-center items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center mb-6 shadow-2xl">
                    <TrendingUp className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">نمو لا محدود</h3>
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              جاهز للانضمام؟
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              اكتشف الوظائف المتاحة وقدم طلبك اليوم لتصبح جزءاً من عائلتنا
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/careers">
                  تصفح الوظائف
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">
                  تواصل معنا
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export { BenefitsPage };
