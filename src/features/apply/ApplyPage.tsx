/**
 * Apply Page Component
 * Multi-step application form with validation UI
 */

import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input, Textarea } from '@/app/components/ui/input';
import { FileUpload } from '@/app/components/ui/file-upload';
import { MOCK_JOBS } from '@/services/mockData';
import { CheckCircle, Upload, User, Mail, Phone, FileText } from 'lucide-react';

const ApplyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const job = MOCK_JOBS.find(j => j.id === id);

  const totalSteps = 4;

  const steps = [
    { number: 1, title: 'المعلومات الشخصية' },
    { number: 2, title: 'المؤهلات العلمية' },
    { number: 3, title: 'الخبرات العملية' },
    { number: 4, title: 'المستندات' },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    navigate(`/success/${id}`);
  };

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
    <div className="min-h-screen bg-background-alternate py-12" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to={`/jobs/${id}`}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4 transition-colors"
          >
            <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            العودة للتفاصيل
          </Link>
          
          <h1 className="text-3xl font-bold text-text-primary mb-2">التقدم للوظيفة</h1>
          <p className="text-text-secondary">{job.title.ar}</p>
        </motion.div>

        {/* Progress Steps */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                        currentStep >= step.number
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-200 text-text-muted'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 hidden sm:block ${
                        currentStep >= step.number ? 'text-text-primary' : 'text-text-muted'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        currentStep > index + 1 ? 'bg-primary-600' : 'bg-neutral-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Card>

        {/* Form Card */}
        <Card>
          <div className="p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-text-primary mb-6">المعلومات الشخصية</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="الاسم الكامل"
                      placeholder="أحمد محمد علي"
                      required
                      leftIcon={<User className="w-5 h-5" />}
                    />
                    <Input
                      label="تاريخ الميلاد"
                      type="date"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="البريد الإلكتروني"
                      type="email"
                      placeholder="example@email.com"
                      required
                      leftIcon={<Mail className="w-5 h-5" />}
                    />
                    <Input
                      label="رقم الهاتف"
                      type="tel"
                      placeholder="+20 1XX XXX XXXX"
                      required
                      leftIcon={<Phone className="w-5 h-5" />}
                    />
                  </div>

                  <Input
                    label="العنوان"
                    placeholder="المدينة، المحافظة"
                    required
                  />

                  <Textarea
                    label="نبذة عنك"
                    placeholder="اكتب نبذة مختصرة عن نفسك..."
                    rows={4}
                  />
                </motion.div>
              )}

              {/* Step 2: Education */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-text-primary mb-6">المؤهلات العلمية</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="المؤهل الدراسي"
                      placeholder="بكالوريوس الصيدلة"
                      required
                    />
                    <Input
                      label="الجامعة/المعهد"
                      placeholder="جامعة القاهرة"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="سنة التخرج"
                      type="number"
                      placeholder="2023"
                      required
                    />
                    <Input
                      label="التقدير العام"
                      placeholder="جيد جداً"
                    />
                  </div>

                  <div className="border-t pt-6">
                    <Button variant="outline" fullWidth>
                      <Upload className="w-4 h-4 ml-2" />
                      إضافة مؤهل آخر
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Experience */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-text-primary mb-6">الخبرات العملية</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="اسم الشركة"
                      placeholder="صيدلية ..."
                      required
                    />
                    <Input
                      label="المسمى الوظيفي"
                      placeholder="صيدلي"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="تاريخ البدء"
                      type="date"
                      required
                    />
                    <Input
                      label="تاريخ الانتهاء"
                      type="date"
                      hint="اتركه فارغاً إذا كنت تعمل حالياً"
                    />
                  </div>

                  <Textarea
                    label="وصف المهام"
                    placeholder="اكتب وصفًا مختصرًا لمهامك ومسؤولياتك..."
                    rows={4}
                  />

                  <div className="border-t pt-6">
                    <Button variant="outline" fullWidth>
                      <Upload className="w-4 h-4 ml-2" />
                      إضافة خبرة أخرى
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Documents */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-text-primary mb-6">المستندات</h2>
                  
                  <FileUpload
                    label="السيرة الذاتية (CV)"
                    accept=".pdf,.doc,.docx"
                    maxSize={5 * 1024 * 1024}
                    hint="الملفات المسموحة: PDF, DOC, DOCX (الحد الأقصى 5MB)"
                    required
                    leftIcon={<FileText className="w-5 h-5" />}
                  />

                  <FileUpload
                    label="صورة المؤهل الدراسي"
                    accept="image/*"
                    maxSize={2 * 1024 * 1024}
                    hint="الملفات المسموحة: JPG, PNG (الحد الأقصى 2MB)"
                    required
                  />

                  <FileUpload
                    label="خطاب التوصية (اختياري)"
                    accept=".pdf,.doc,.docx"
                    maxSize={5 * 1024 * 1024}
                    hint="الملفات المسموحة: PDF, DOC, DOCX (الحد الأقصى 5MB)"
                  />

                  <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                    <p className="text-sm text-warning-700">
                      ⚠️ تأكد من صحة جميع المعلومات قبل الإرسال. أي معلومات خاطئة قد تؤدي إلى رفض طلبك.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleBack}
                  className="flex-1"
                >
                  السابق
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button
                  fullWidth
                  onClick={handleNext}
                  className="flex-1"
                >
                  التالي
                  <svg className="w-5 h-5 mr-2 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              ) : (
                <Button
                  fullWidth
                  size="lg"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  className="flex-1 bg-success-600 hover:bg-success-700"
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  {!isSubmitting && (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export { ApplyPage };
