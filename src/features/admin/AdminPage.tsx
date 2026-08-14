import { useEffect, useState, type FormEvent } from 'react';
import type { User } from 'firebase/auth';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input, Textarea } from '@/app/components/ui/input';
import { config } from '@/config';
import { JOB_CATEGORIES, JOB_TYPES } from '@/constants';
import { hasFirebaseConfig } from '@/lib/firebase';
import { adminService, type AdminApplication } from '@/services/adminService';
import { jobsService, type JobAdminInput } from '@/services/jobsService';
import type { Job } from '@/types';

const statusLabels: Record<AdminApplication['status'], string> = {
  pending: 'جديد',
  reviewing: 'قيد المراجعة',
  shortlisted: 'قائمة مختصرة',
  rejected: 'مرفوض',
  hired: 'تم التعيين',
};

const emptyJobForm: JobAdminInput = {
  title: { ar: '', en: '' },
  description: { ar: '', en: '' },
  requirements: { ar: [], en: [] },
  responsibilities: { ar: [], en: [] },
  category: 'pharmacist',
  type: 'full-time',
  experienceLevel: 'entry',
  educationLevel: 'bachelor',
  location: { city: '', governorate: '' },
  benefits: [],
  postedDate: new Date().toISOString().slice(0, 10),
  expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  isActive: true,
};

function formatDate(value: AdminApplication['submittedAt']) {
  if (!value) return '—';
  if (typeof value === 'string') return new Date(value).toLocaleString('ar-EG');
  if (typeof value.toDate === 'function')
    return value.toDate().toLocaleString('ar-EG');
  return '—';
}

function withoutId(job: Job): JobAdminInput {
  const editable = Object.fromEntries(
    Object.entries(job).filter(([key]) => key !== 'id')
  ) as JobAdminInput;
  return editable;
}

export function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobForm, setJobForm] = useState<JobAdminInput>(emptyJobForm);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasFirebaseConfig()) {
      setIsLoading(false);
      return undefined;
    }
    return adminService.subscribe((nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      try {
        const token = await user.getIdTokenResult();
        if (token.claims.admin !== true) {
          setError(
            'الحساب مسجل، لكنه لا يملك صلاحية مدير. أضف custom claim باسم admin=true.'
          );
          return;
        }
        const [loadedApplications, loadedJobs] = await Promise.all([
          adminService.getApplications(),
          jobsService.getAllJobs(),
        ]);
        setApplications(loadedApplications);
        setJobs(loadedJobs);
      } catch (loadError) {
        console.error(loadError);
        setError(
          'تعذر تحميل لوحة الإدارة. تحقق من صلاحيات Firebase والفهارس المطلوبة.'
        );
      }
    })();
  }, [user]);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await adminService.signIn(email, password);
    } catch (signInError) {
      console.error(signInError);
      setError('بيانات الدخول غير صحيحة أو لم يتم تفعيل حساب المدير.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (
    applicationId: string,
    status: AdminApplication['status']
  ) => {
    try {
      await adminService.updateApplicationStatus(applicationId, status);
      setApplications((current) =>
        current.map((item) =>
          item.id === applicationId ? { ...item, status } : item
        )
      );
    } catch (updateError) {
      console.error(updateError);
      setError('تعذر تحديث حالة الطلب.');
    }
  };

  const saveJob = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await jobsService.saveJob(jobForm, editingJobId ?? undefined);
      setJobs(await jobsService.getAllJobs());
      setJobForm(emptyJobForm);
      setEditingJobId(null);
    } catch (saveError) {
      console.error(saveError);
      setError('تعذر حفظ الوظيفة. تحقق من صلاحيات المدير وقواعد Firestore.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleJob = async (job: Job) => {
    try {
      await jobsService.setActive(job.id, !job.isActive);
      setJobs((current) =>
        current.map((item) =>
          item.id === job.id ? { ...item, isActive: !job.isActive } : item
        )
      );
    } catch (toggleError) {
      console.error(toggleError);
      setError('تعذر تغيير حالة الوظيفة.');
    }
  };

  if (!hasFirebaseConfig()) {
    return (
      <div className="bg-background-alternate min-h-screen p-8" dir="rtl">
        <Card>
          <div className="p-8">
            <h1 className="mb-3 text-2xl font-bold">إعداد لوحة الإدارة</h1>
            <p className="text-text-secondary">
              أضف متغيرات VITE_FIREBASE_* من ملف .env.example ثم أعد تشغيل
              التطبيق.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="bg-background-alternate flex min-h-screen items-center justify-center"
        dir="rtl"
      >
        <p className="text-text-secondary">جاري التحقق من الدخول...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-background-alternate min-h-screen p-8" dir="rtl">
        <div className="mx-auto max-w-md">
          <Card>
            <form
              onSubmit={(event) => void signIn(event)}
              className="space-y-5 p-8"
            >
              <h1 className="text-text-primary text-2xl font-bold">
                دخول الإدارة
              </h1>
              <p className="text-text-secondary text-sm">
                لوحة إدارة الوظائف وطلبات التوظيف في {config.brand.arabicName}
              </p>
              <Input
                label="البريد الإلكتروني"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <Input
                label="كلمة المرور"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {error && <p className="text-sm text-danger-700">{error}</p>}
              <Button fullWidth type="submit" loading={isSubmitting}>
                دخول
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-alternate min-h-screen p-8" dir="rtl">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-text-primary text-3xl font-bold">
              لوحة الإدارة
            </h1>
            <p className="text-text-secondary">
              {jobs.length} وظيفة و{applications.length} طلباً مسجلاً
            </p>
          </div>
          <Button variant="outline" onClick={() => void adminService.signOut()}>
            تسجيل الخروج
          </Button>
        </div>
        {error && (
          <p className="rounded-lg bg-danger-50 p-4 text-danger-700">{error}</p>
        )}

        <Card>
          <form
            onSubmit={(event) => void saveJob(event)}
            className="space-y-4 p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">
                  {editingJobId ? 'تعديل وظيفة' : 'إضافة وظيفة جديدة'}
                </h2>
                <p className="text-text-secondary text-sm">
                  أنشئ الوظيفة أو عدّل بياناتها ثم فعّلها للنشر.
                </p>
              </div>
              {editingJobId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditingJobId(null);
                    setJobForm(emptyJobForm);
                  }}
                >
                  إلغاء التعديل
                </Button>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="اسم الوظيفة بالعربية"
                value={jobForm.title.ar}
                onChange={(event) =>
                  setJobForm((current) => ({
                    ...current,
                    title: { ...current.title, ar: event.target.value },
                  }))
                }
                required
              />
              <Input
                label="اسم الوظيفة بالإنجليزية"
                value={jobForm.title.en}
                onChange={(event) =>
                  setJobForm((current) => ({
                    ...current,
                    title: { ...current.title, en: event.target.value },
                  }))
                }
              />
              <label className="space-y-2 text-sm">
                <span className="font-medium">التصنيف</span>
                <select
                  className="border-border-default w-full rounded-md border bg-white px-3 py-2"
                  value={jobForm.category}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      category: event.target.value as JobAdminInput['category'],
                    }))
                  }
                >
                  {JOB_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm">
                <span className="font-medium">نوع الدوام</span>
                <select
                  className="border-border-default w-full rounded-md border bg-white px-3 py-2"
                  value={jobForm.type}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      type: event.target.value as JobAdminInput['type'],
                    }))
                  }
                >
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <Input
                label="المدينة"
                value={jobForm.location.city}
                onChange={(event) =>
                  setJobForm((current) => ({
                    ...current,
                    location: {
                      ...current.location,
                      city: event.target.value,
                      governorate: event.target.value,
                    },
                  }))
                }
                required
              />
              <Input
                label="تاريخ انتهاء التقديم"
                type="date"
                value={jobForm.expiryDate}
                onChange={(event) =>
                  setJobForm((current) => ({
                    ...current,
                    expiryDate: event.target.value,
                  }))
                }
                required
              />
            </div>
            <Textarea
              label="الوصف بالعربية"
              value={jobForm.description.ar}
              onChange={(event) =>
                setJobForm((current) => ({
                  ...current,
                  description: {
                    ...current.description,
                    ar: event.target.value,
                    en: current.description.en || event.target.value,
                  },
                }))
              }
              required
            />
            <Textarea
              label="المتطلبات، كل متطلب في سطر"
              value={jobForm.requirements.ar.join('\n')}
              onChange={(event) =>
                setJobForm((current) => ({
                  ...current,
                  requirements: {
                    ...current.requirements,
                    ar: event.target.value
                      .split('\n')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  },
                }))
              }
            />
            <Button type="submit" loading={isSubmitting}>
              {editingJobId ? 'حفظ التعديلات' : 'نشر الوظيفة'}
            </Button>
          </form>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="border-b bg-neutral-50">
                <tr>
                  <th className="p-4">الوظيفة</th>
                  <th className="p-4">المكان</th>
                  <th className="p-4">الانتهاء</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{job.title.ar}</td>
                    <td className="p-4">{job.location.city}</td>
                    <td className="p-4">{job.expiryDate}</td>
                    <td className="p-4">{job.isActive ? 'منشورة' : 'مغلقة'}</td>
                    <td className="flex gap-2 p-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingJobId(job.id);
                          setJobForm(withoutId(job));
                        }}
                      >
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant={job.isActive ? 'danger' : 'success'}
                        onClick={() => void toggleJob(job)}
                      >
                        {job.isActive ? 'إغلاق' : 'إعادة فتح'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {jobs.length === 0 && (
              <p className="text-text-secondary p-8 text-center">
                لا توجد وظائف حتى الآن.
              </p>
            )}
          </div>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead className="border-b bg-neutral-50">
                <tr>
                  <th className="p-4">المتقدم</th>
                  <th className="p-4">البريد والهاتف</th>
                  <th className="p-4">الوظيفة</th>
                  <th className="p-4">التاريخ</th>
                  <th className="p-4">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{application.fullName}</td>
                    <td className="p-4">
                      {application.email}
                      <br />
                      {application.phone}
                    </td>
                    <td className="p-4">{application.jobId}</td>
                    <td className="p-4">
                      {formatDate(application.submittedAt)}
                    </td>
                    <td className="p-4">
                      <select
                        className="border-border-default rounded-md border bg-white px-3 py-2"
                        value={application.status}
                        onChange={(event) =>
                          void updateStatus(
                            application.id,
                            event.target.value as AdminApplication['status']
                          )
                        }
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {applications.length === 0 && (
              <p className="text-text-secondary p-8 text-center">
                لا توجد طلبات حتى الآن.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
