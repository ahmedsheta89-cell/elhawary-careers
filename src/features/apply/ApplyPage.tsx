import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, FileText, Mail, Phone, User } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { FileUpload } from '@/app/components/ui/file-upload';
import { Input, Textarea } from '@/app/components/ui/input';
import { useJob } from '@/hooks/useJobs';
import {
  applicationsService,
  type CreateApplicationInput,
} from '@/services/applicationsService';

type FormState = Omit<
  CreateApplicationInput,
  'jobId' | 'cvFile' | 'certificateFile' | 'recommendationFile'
>;

const initialForm: FormState = {
  fullName: '',
  birthDate: '',
  email: '',
  phone: '',
  address: '',
  bio: '',
  education: {
    degree: '',
    institution: '',
    graduationYear: new Date().getFullYear(),
    grade: '',
  },
  experience: {
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
  },
};

const steps = [
  { number: 1, title: 'المعلومات الشخصية' },
  { number: 2, title: 'المؤهلات العلمية' },
  { number: 3, title: 'الخبرات العملية' },
  { number: 4, title: 'المستندات' },
];

export function ApplyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { job, isLoading } = useJob(id);
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [recommendationFile, setRecommendationFile] = useState<File | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validateStep = () => {
    if (
      currentStep === 1 &&
      (!form.fullName ||
        !form.birthDate ||
        !form.email ||
        !form.phone ||
        !form.address)
    ) {
      return 'يرجى إكمال جميع البيانات الشخصية المطلوبة.';
    }
    if (
      currentStep === 2 &&
      (!form.education.degree ||
        !form.education.institution ||
        !form.education.graduationYear)
    ) {
      return 'يرجى إكمال بيانات المؤهل العلمي.';
    }
    if (
      currentStep === 3 &&
      (!form.experience.company ||
        !form.experience.position ||
        !form.experience.startDate)
    ) {
      return 'يرجى إكمال بيانات الخبرة العملية.';
    }
    if (currentStep === 4 && !cvFile) {
      return 'السيرة الذاتية مطلوبة لإرسال الطلب.';
    }
    return null;
  };

  const handleNext = () => {
    const validationError = validateStep();
    setError(validationError);
    if (!validationError && currentStep < steps.length)
      setCurrentStep((step) => step + 1);
  };

  const handleSubmit = async () => {
    const validationError = validateStep();
    if (validationError || !id || !cvFile) {
      setError(validationError || 'بيانات التقديم غير مكتملة.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await applicationsService.createApplication({
        ...form,
        jobId: id,
        cvFile,
        certificateFile: certificateFile ?? undefined,
        recommendationFile: recommendationFile ?? undefined,
      });
      navigate(`/success/${id}?ref=${encodeURIComponent(result.reference)}`);
    } catch (submitError) {
      console.error(submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'تعذر إرسال الطلب. حاول مرة أخرى.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="bg-background-alternate flex min-h-screen items-center justify-center"
        dir="rtl"
      >
        <p className="text-text-secondary">جاري تحميل الوظيفة...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div
        className="bg-background-alternate flex min-h-screen flex-col items-center justify-center gap-4"
        dir="rtl"
      >
        <p className="text-text-primary">الوظيفة غير موجودة</p>
        <Button onClick={() => navigate('/careers')}>العودة للوظائف</Button>
      </div>
    );
  }

  return (
    <div className="bg-background-alternate min-h-screen py-12" dir="rtl">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to={`/jobs/${id}`}
            className="text-text-secondary hover:text-text-primary mb-4 inline-flex items-center gap-2"
          >
            العودة للتفاصيل
          </Link>
          <h1 className="text-text-primary mb-2 text-3xl font-bold">
            التقدم للوظيفة
          </h1>
          <p className="text-text-secondary">{job.title.ar}</p>
        </div>

        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${currentStep >= step.number ? 'bg-primary-600 text-white' : 'text-text-muted bg-neutral-200'}`}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span className="text-text-secondary mt-2 hidden text-xs sm:block">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-2 h-1 flex-1 rounded ${currentStep > index + 1 ? 'bg-primary-600' : 'bg-neutral-200'}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-text-primary text-xl font-semibold">
                    المعلومات الشخصية
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Input
                      label="الاسم الكامل"
                      value={form.fullName}
                      onChange={(event) =>
                        updateField('fullName', event.target.value)
                      }
                      placeholder="أحمد محمد علي"
                      required
                      leftIcon={<User className="h-5 w-5" />}
                    />
                    <Input
                      label="تاريخ الميلاد"
                      type="date"
                      value={form.birthDate}
                      onChange={(event) =>
                        updateField('birthDate', event.target.value)
                      }
                      required
                    />
                    <Input
                      label="البريد الإلكتروني"
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField('email', event.target.value)
                      }
                      placeholder="example@email.com"
                      required
                      leftIcon={<Mail className="h-5 w-5" />}
                    />
                    <Input
                      label="رقم الهاتف"
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateField('phone', event.target.value)
                      }
                      placeholder="+20 1XX XXX XXXX"
                      required
                      leftIcon={<Phone className="h-5 w-5" />}
                    />
                  </div>
                  <Input
                    label="العنوان"
                    value={form.address}
                    onChange={(event) =>
                      updateField('address', event.target.value)
                    }
                    placeholder="المدينة، المحافظة"
                    required
                  />
                  <Textarea
                    label="نبذة عنك"
                    value={form.bio}
                    onChange={(event) => updateField('bio', event.target.value)}
                    placeholder="اكتب نبذة مختصرة عن نفسك..."
                    rows={4}
                  />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="education"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-text-primary text-xl font-semibold">
                    المؤهلات العلمية
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Input
                      label="المؤهل الدراسي"
                      value={form.education.degree}
                      onChange={(event) =>
                        updateField('education', {
                          ...form.education,
                          degree: event.target.value,
                        })
                      }
                      placeholder="بكالوريوس الصيدلة"
                      required
                    />
                    <Input
                      label="الجامعة/المعهد"
                      value={form.education.institution}
                      onChange={(event) =>
                        updateField('education', {
                          ...form.education,
                          institution: event.target.value,
                        })
                      }
                      placeholder="جامعة القاهرة"
                      required
                    />
                    <Input
                      label="سنة التخرج"
                      type="number"
                      value={form.education.graduationYear}
                      onChange={(event) =>
                        updateField('education', {
                          ...form.education,
                          graduationYear: Number(event.target.value),
                        })
                      }
                      required
                    />
                    <Input
                      label="التقدير العام"
                      value={form.education.grade}
                      onChange={(event) =>
                        updateField('education', {
                          ...form.education,
                          grade: event.target.value,
                        })
                      }
                      placeholder="جيد جداً"
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="experience"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-text-primary text-xl font-semibold">
                    الخبرات العملية
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Input
                      label="اسم الشركة"
                      value={form.experience.company}
                      onChange={(event) =>
                        updateField('experience', {
                          ...form.experience,
                          company: event.target.value,
                        })
                      }
                      placeholder="صيدلية ..."
                      required
                    />
                    <Input
                      label="المسمى الوظيفي"
                      value={form.experience.position}
                      onChange={(event) =>
                        updateField('experience', {
                          ...form.experience,
                          position: event.target.value,
                        })
                      }
                      placeholder="صيدلي"
                      required
                    />
                    <Input
                      label="تاريخ البدء"
                      type="date"
                      value={form.experience.startDate}
                      onChange={(event) =>
                        updateField('experience', {
                          ...form.experience,
                          startDate: event.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      label="تاريخ الانتهاء"
                      type="date"
                      value={form.experience.endDate}
                      onChange={(event) =>
                        updateField('experience', {
                          ...form.experience,
                          endDate: event.target.value,
                        })
                      }
                      hint="اتركه فارغاً إذا كنت تعمل حالياً"
                    />
                  </div>
                  <Textarea
                    label="وصف المهام"
                    value={form.experience.description}
                    onChange={(event) =>
                      updateField('experience', {
                        ...form.experience,
                        description: event.target.value,
                      })
                    }
                    placeholder="اكتب وصفاً مختصراً لمهامك ومسؤولياتك..."
                    rows={4}
                  />
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-text-primary text-xl font-semibold">
                    المستندات
                  </h2>
                  <FileUpload
                    label="السيرة الذاتية (CV)"
                    accept=".pdf,.doc,.docx"
                    maxSize={5 * 1024 * 1024}
                    hint="PDF, DOC, DOCX — الحد الأقصى 5MB"
                    required
                    leftIcon={<FileText className="h-5 w-5" />}
                    onFileSelect={(files) => setCvFile(files?.[0] ?? null)}
                  />
                  <FileUpload
                    label="صورة المؤهل الدراسي"
                    accept="image/*"
                    maxSize={2 * 1024 * 1024}
                    hint="JPG, PNG — الحد الأقصى 2MB"
                    onFileSelect={(files) =>
                      setCertificateFile(files?.[0] ?? null)
                    }
                  />
                  <FileUpload
                    label="خطاب التوصية (اختياري)"
                    accept=".pdf,.doc,.docx"
                    maxSize={5 * 1024 * 1024}
                    hint="PDF, DOC, DOCX — الحد الأقصى 5MB"
                    onFileSelect={(files) =>
                      setRecommendationFile(files?.[0] ?? null)
                    }
                  />
                  <div className="border-warning-200 rounded-lg border bg-warning-50 p-4 text-sm text-warning-700">
                    تأكد من صحة جميع المعلومات قبل الإرسال. سيتم استخدام بياناتك
                    لغرض التوظيف فقط.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <p
                className="mt-6 rounded-lg bg-danger-50 p-3 text-sm text-danger-700"
                role="alert"
              >
                {error}
              </p>
            )}
            <div className="mt-8 flex gap-4 border-t pt-6">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setError(null);
                    setCurrentStep((step) => step - 1);
                  }}
                >
                  السابق
                </Button>
              )}
              {currentStep < steps.length ? (
                <Button fullWidth onClick={handleNext}>
                  التالي
                </Button>
              ) : (
                <Button
                  fullWidth
                  size="lg"
                  onClick={() => void handleSubmit()}
                  loading={isSubmitting}
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  {!isSubmitting && <CheckCircle className="h-5 w-5" />}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
