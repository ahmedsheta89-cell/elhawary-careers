/**
 * About Page Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { STATS } from '@/services/mockData';
import { staggerContainer, fadeAnimations } from '@/styles/tokens.animation';
import { Award, Target, Heart, Users, TrendingUp, Shield } from 'lucide-react';

const AboutPage: React.FC = () => {
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
              عن صيدلية الهواري
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              من أكبر سلاسل الصيدليات في مصر، نقدم رعاية صحية متميزة منذ أكثر من 15 عاماً
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="primary" size="lg" className="mb-4">قصتنا</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                رحلة النجاح والتميز
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  بدأت صيدلية الهواري رحلتها عام 2008 بفرع واحد صغير، والإيمان بأن الرعاية الصحية 
                  الجيدة حق للجميع. من خلال الالتزام بالجودة والخدمة المتميزة، نمونا لنصبح واحدة من 
                  أكبر سلاسل الصيدليات في جمهورية مصر العربية.
                </p>
                <p>
                  اليوم، نضم أكثر من 50 فرعاً منتشراً في مختلف المحافظات، وفريقاً يتجاوز 200 موظف 
                  متخصص، نخدم يومياً آلاف العملاء بثقة واهتمام.
                </p>
                <p>
                  رؤيتنا واضحة: أن نكون الخيار الأول للرعاية الصحية المجتمعية، وأن نوفر بيئة عمل 
                  محفزة تجذب أفضل الكوادر الطبية والخدمية.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-2xl">
                    <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <p className="text-primary-700 font-semibold text-lg">منذ 2008</p>
                  <p className="text-primary-600">نخدم المجتمع المصري</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {STATS.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeAnimations.fadeInUp}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-100 font-medium text-lg">
                  {stat.label.ar}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              قيمنا الأساسية
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg">
              المبادئ التي نؤمن بها ونطبقها في كل ما نفعله
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
                icon: <Heart className="w-8 h-8" />,
                title: 'الرعاية والإنسانية',
                description: 'نضع صحة وراحة عملائنا في المقام الأول، ونتعامل معهم بكل احترام وتعاطف',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'الجودة والسلامة',
                description: 'نلتزم بأعلى معايير الجودة في المنتجات والخدمات لضمان سلامة الجميع',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'العمل الجماعي',
                description: 'نؤمن بقوة الفريق والتعاون لتحقيق الأهداف المشتركة',
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'التميز المستمر',
                description: 'نسعى دائماً للتطوير والتحسين في جميع جوانب عملنا',
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'النزاهة والشفافية',
                description: 'نتصرف بصدق وشفافية في تعاملاتنا مع الجميع',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'الابتكار والنمو',
                description: 'نشجع الأفكار الجديدة ونستثمر في تطوير مهارات فريقنا',
              },
            ].map((value, index) => (
              <motion.div key={index} variants={fadeAnimations.fadeInUp}>
                <Card hoverable className="h-full">
                  <div className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      {value.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </Card>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              انضم إلى عائلتنا
            </h2>
            <p className="text-secondary-100 text-lg mb-8">
              نحن نبحث دائماً عن المواهب الطموحة للانضمام إلى فريقنا. اكتشف فرص عملك التالية معنا
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="neutral" asChild>
                <Link to="/careers">تصفح الوظائف</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/benefits">اعرف المزايا</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export { AboutPage };
