import { useEffect, useState, type FormEvent } from 'react';
import type { User } from 'firebase/auth';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input, Textarea } from '@/app/components/ui/input';
import { config } from '@/config';
import {
  EDUCATION_LEVELS,
  EXPERIENCE_LEVELS,
  JOB_CATEGORIES,
  JOB_TYPES,
} from '@/constants';
import { hasFirebaseConfig } from '@/lib/firebase';
import {
  adminService,
  type AdminApplication,
  type StaffMember,
} from '@/services/adminService';
import { jobsService, type JobAdminInput } from '@/services/jobsService';
import {
  defaultSiteContent,
  getPublicSiteContent,
  mergeSiteContent,
  saveSiteContent,
  type SiteContent,
} from '@/services/siteContentService';
import type { Job } from '@/types';
import { PageContentEditor } from './PageContentEditor';

const statusLabels: Record<AdminApplication['status'], string> = {
  pending: 'جديد',
  reviewing: 'قيد المراجعة',
  shortlisted: 'قائمة مختصرة',
  rejected: 'مرفوض',
  hired: 'تم التعيين',
};

type AccessRole = 'admin' | 'hr' | 'denied';
type AdminTab = 'overview' | 'jobs' | 'applications' | 'content' | 'team';

const statusStyles: Record<AdminApplication['status'], string> = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  reviewing: 'bg-sky-50 text-sky-700 ring-sky-200',
  shortlisted: 'bg-violet-50 text-violet-700 ring-violet-200',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
  hired: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
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

function csvCell(value: unknown) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function downloadApplicationsCsv(rows: AdminApplication[], jobs: Job[]) {
  const header = ['الاسم', 'البريد الإلكتروني', 'الهاتف', 'واتساب', 'الوظيفة', 'الحالة', 'تاريخ التقديم', 'السيرة الذاتية'];
  const lines = rows.map((application) => {
    const jobTitle = jobs.find((job) => job.id === application.jobId)?.title.ar ?? application.jobId;
    return [
      application.fullName,
      application.email,
      application.phone,
      application.whatsappNumber ?? application.phone,
      jobTitle,
      statusLabels[application.status],
      formatDate(application.submittedAt),
      application.cvReceived ? 'تم الاستلام' : 'بانتظار الإرسال',
    ].map(csvCell).join(',');
  });
  const blob = new Blob([`\\ufeff${[header.map(csvCell).join(','), ...lines].join('\\n')}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `elhawary-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function downloadJsonFile(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function withoutId(job: Job): JobAdminInput {
  return Object.fromEntries(
    Object.entries(job).filter(([key]) => key !== 'id')
  ) as JobAdminInput;
}

function Icon({
  name,
  className = 'h-5 w-5',
}: {
  name: 'briefcase' | 'users' | 'trend' | 'plus' | 'arrow' | 'phone';
  className?: string;
}) {
  const paths = {
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    trend: (
      <>
        <path d="M3 17l6-6 4 4 7-8" />
        <path d="M14 7h6v6" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    phone: (
      <>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-semibold text-slate-700">{label}</span>
      <select
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
    </label>
  );
}

export function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AccessRole | null>(null);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [staffEmail, setStaffEmail] = useState('');
  const [staffSaved, setStaffSaved] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobForm, setJobForm] = useState<JobAdminInput>(emptyJobForm);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('0201000753375');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [contentJson, setContentJson] = useState(() =>
    JSON.stringify(defaultSiteContent, null, 2)
  );
  const [contentSaved, setContentSaved] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [applicationSearch, setApplicationSearch] = useState('');
  const [applicationStatusFilter, setApplicationStatusFilter] = useState<'all' | AdminApplication['status']>('all');
  const [applicationJobFilter, setApplicationJobFilter] = useState('all');
  const [newApplicationCount, setNewApplicationCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  useEffect(() => {
    if (!hasFirebaseConfig()) {
      setIsLoading(false);
      return undefined;
    }
    return adminService.subscribe((nextUser) => {
      setUser(nextUser);
      setRole(null);
      setError(null);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setRole(null);
      return;
    }
    void (async () => {
      try {
        const token = await user.getIdTokenResult(true);
        const isAdmin = token.claims.admin === true;
        const claimIsHr = token.claims.hr === true;
        const storedRole = user.email
          ? await adminService.getStaffRole(user.email)
          : null;
        const isHr = claimIsHr || storedRole === 'hr';
        if (!isAdmin && !isHr) {
          setRole('denied');
          setError(
            'الحساب مسجل، لكنه لا يملك صلاحية المدير أو موظف الموارد البشرية.'
          );
          return;
        }
        const nextRole: AccessRole = isAdmin ? 'admin' : 'hr';
        setRole(nextRole);
        setActiveTab(nextRole === 'admin' ? 'overview' : 'applications');
        const loadedApplications = await adminService.getApplications();
        setApplications(loadedApplications);
        if (nextRole === 'admin') {
          const [loadedJobs, loadedSettings, loadedStaff, loadedContent] = await Promise.all([
            jobsService.getAllJobs(),
            adminService.getSiteSettings(),
            adminService.getStaffMembers(),
            getPublicSiteContent(),
          ]);
          setJobs(loadedJobs);
          setWhatsappNumber(loadedSettings.whatsappNumber);
          setStaffMembers(loadedStaff);
          setSiteContent(loadedContent);
          setContentJson(JSON.stringify(loadedContent, null, 2));
        } else {
          setJobs([]);
          setStaffMembers([]);
        }
      } catch (loadError) {
        console.error(loadError);
        setError(
          'تعذر تحميل لوحة الإدارة. تحقق من صلاحيات Firebase وقواعد الوصول.'
        );
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!user || !role || role === 'denied') return undefined;
    let knownApplicationIds: Set<string> | null = null;
    let cancelled = false;

    const refreshApplications = async () => {
      try {
        const latest = await adminService.getApplications();
        if (cancelled) return;
        const latestIds = new Set(latest.map((application) => application.id));
        if (knownApplicationIds) {
          const added = latest.filter((application) => !knownApplicationIds?.has(application.id));
          if (added.length > 0) {
            setNewApplicationCount((current) => current + added.length);
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              new Notification('طلب توظيف جديد - El Hawary Careers', {
                body: `وصل ${added.length} طلب جديد إلى لوحة الإدارة.`,
              });
            }
          }
        }
        knownApplicationIds = latestIds;
        setApplications(latest);
      } catch (refreshError) {
        console.error('Application refresh failed', refreshError);
      }
    };

    void refreshApplications();
    const intervalId = window.setInterval(() => void refreshApplications(), 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [role, user]);

  const enableBrowserNotifications = async () => {
    if (typeof Notification === 'undefined') {
      setError('هذا المتصفح لا يدعم تنبيهات سطح المكتب.');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationsEnabled(permission === 'granted');
    if (permission !== 'granted') {
      setError('لم يتم السماح بتنبيهات المتصفح. يمكنك تفعيلها من إعدادات المتصفح.');
    }
  };

  const saveSiteContentSettings = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setContentSaved(false);
    setError(null);
    try {
      const parsed = JSON.parse(contentJson) as Partial<SiteContent>;
      const normalized = mergeSiteContent(parsed);
      const saved = await saveSiteContent(normalized);
      setSiteContent(saved);
      setContentJson(JSON.stringify(saved, null, 2));
      setContentSaved(true);
    } catch (saveError) {
      console.error(saveError);
      setError(
        saveError instanceof SyntaxError
          ? 'صيغة المحتوى غير صحيحة. راجع الأقواس والفواصل في محرر JSON.'
          : 'تعذر حفظ محتوى الموقع. تحقق من الصلاحيات وصحة البيانات.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveStructuredSiteContent = async () => {
    setIsSubmitting(true);
    setContentSaved(false);
    setError(null);
    try {
      const saved = await saveSiteContent(siteContent);
      setSiteContent(saved);
      setContentJson(JSON.stringify(saved, null, 2));
      setContentSaved(true);
      await adminService.recordContentUpdate('pages.about,pages.benefits');
    } catch (saveError) {
      console.error(saveError);
      setError('تعذر حفظ محتوى الصفحتين. تحقق من الصلاحيات وصحة البيانات.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSiteContentEditor = () => {
    const next = JSON.stringify(siteContent, null, 2);
    setContentJson(next);
    setContentSaved(false);
  };

  const saveWhatsAppSettings = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSettingsSaved(false);
    setError(null);
    try {
      const saved = await adminService.saveSiteSettings(whatsappNumber);
      setWhatsappNumber(saved.whatsappNumber);
      setSettingsSaved(true);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'تعذر حفظ رقم واتساب.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const credential = await adminService.signIn(email, password);
      await credential.user.getIdToken(true);
    } catch (signInError) {
      console.error(signInError);
      const code =
        typeof signInError === 'object' &&
        signInError !== null &&
        'code' in signInError
          ? String((signInError as { code?: unknown }).code)
          : '';
      const messages: Record<string, string> = {
        'auth/invalid-credential':
          'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
        'auth/invalid-login-credentials':
          'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
        'auth/user-not-found': 'لا يوجد حساب بهذا البريد الإلكتروني.',
        'auth/wrong-password': 'كلمة المرور غير صحيحة.',
        'auth/too-many-requests':
          'تم إيقاف المحاولات مؤقتاً. انتظر قليلاً ثم حاول مرة أخرى.',
        'auth/network-request-failed':
          'تعذر الاتصال بـ Firebase. تحقق من الإنترنت ثم حاول مرة أخرى.',
      };
      setError(
        messages[code] ??
          'تعذر تسجيل الدخول. تحقق من تفعيل Email/Password وصحة بيانات حساب المدير.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError('اكتب البريد الإلكتروني أولاً ثم اضغط «نسيت كلمة المرور».');
      return;
    }
    setIsSubmitting(true);
    setResetSent(false);
    setError(null);
    try {
      await adminService.sendPasswordReset(normalizedEmail);
      setResetSent(true);
    } catch (resetError) {
      console.error(resetError);
      const code =
        typeof resetError === 'object' &&
        resetError !== null &&
        'code' in resetError
          ? String((resetError as { code?: unknown }).code)
          : '';
      const messages: Record<string, string> = {
        'auth/invalid-email': 'اكتب بريداً إلكترونياً صحيحاً.',
        'auth/too-many-requests':
          'تم إيقاف المحاولات مؤقتاً. انتظر قليلاً ثم حاول مرة أخرى.',
        'auth/network-request-failed':
          'تعذر الاتصال بـ Firebase. تحقق من الإنترنت ثم حاول مرة أخرى.',
      };
      setError(messages[code] ?? 'تعذر إرسال رابط إعادة تعيين كلمة المرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveStaffRole = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStaffSaved(false);
    setError(null);
    try {
      const member = await adminService.grantHrRole(staffEmail);
      setStaffMembers((current) => [
        member,
        ...current.filter((item) => item.email !== member.email),
      ]);
      setStaffEmail('');
      setStaffSaved(true);
    } catch (saveError) {
      console.error(saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'تعذر منح صلاحية موظف الموارد البشرية.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const revokeStaffRole = async (member: StaffMember) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await adminService.revokeHrRole(member.email);
      setStaffMembers((current) =>
        current.filter((item) => item.email !== member.email)
      );
    } catch (revokeError) {
      console.error(revokeError);
      setError('تعذر سحب صلاحية موظف الموارد البشرية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadAdminBackup = () => {
    downloadJsonFile(`elhawary-backup-${new Date().toISOString().slice(0, 10)}.json`, {
      exportedAt: new Date().toISOString(),
      project: 'elhawary-careers-2026',
      note: 'نسخة احتياطية محلية أنشأها المدير من لوحة الإدارة.',
      jobs,
      applications,
      settings: { whatsappNumber },
      siteContent: role === 'admin' ? siteContent : undefined,
      staffMembers: role === 'admin' ? staffMembers : undefined,
    });
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

  if (!hasFirebaseConfig())
    return (
      <div className="min-h-screen bg-slate-950 p-6" dir="rtl">
        <div className="mx-auto max-w-xl pt-20">
          <Card>
            <div className="p-8">
              <p className="mb-3 text-sm font-bold text-sky-600">
                EL HAWARY CAREERS
              </p>
              <h1 className="mb-3 text-3xl font-black text-slate-900">
                إعداد لوحة الإدارة
              </h1>
              <p className="text-slate-500">
                أضف متغيرات VITE_FIREBASE_* من ملف .env.example ثم أعد تشغيل
                التطبيق.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  if (isLoading)
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-950 text-white"
        dir="rtl"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-sky-400" />
          <p className="text-white/70">جاري تأمين مساحة الإدارة...</p>
        </div>
      </div>
    );
  if (!user)
    return (
      <div
        className="min-h-screen bg-slate-950 px-4 py-10 text-slate-900"
        dir="rtl"
      >
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-sky-600 via-cyan-700 to-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative">
              <div className="mb-10 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-sky-700 shadow-lg">
                  <Icon name="briefcase" />
                </span>
                <div>
                  <p className="text-lg font-black">الهواري</p>
                  <p className="text-xs text-white/70">
                    CAREERS CONTROL CENTER
                  </p>
                </div>
              </div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[.2em] text-cyan-200">
                مساحة الفريق
              </p>
              <h2 className="max-w-md text-5xl font-black leading-[1.15]">
                أدر المواهب التي تصنع الفرق.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-8 text-white/75">
                تحكم في الوظائف، راجع الطلبات، وتابع المرشحين من مساحة واحدة
                منظمة.
              </p>
            </div>
            <div className="relative flex items-center gap-3 text-sm text-white/70">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />{' '}
              النظام متصل وآمن عبر Firebase
            </div>
          </div>
          <form
            onSubmit={(event) => void signIn(event)}
            className="flex flex-col justify-center p-7 sm:p-12"
          >
            <div className="mb-10 lg:hidden">
              <p className="text-sm font-black tracking-wide text-sky-600">
                EL HAWARY CAREERS
              </p>
              <h1 className="mt-3 text-3xl font-black">دخول الإدارة</h1>
            </div>
            <p className="mb-3 text-sm font-bold text-sky-600">مرحباً بعودتك</p>
            <h1 className="text-4xl font-black tracking-tight text-slate-950">
              دخول الإدارة
            </h1>
            <p className="mt-3 max-w-sm leading-7 text-slate-500">
              لوحة إدارة الوظائف وطلبات التوظيف في {config.brand.arabicName}.
            </p>
            <div className="mt-9 space-y-5">
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
            </div>
            {error && (
              <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </p>
            )}
            <Button
              fullWidth
              type="submit"
              loading={isSubmitting}
              className="mt-7 h-12 rounded-xl bg-sky-600 text-base shadow-lg shadow-sky-200 hover:bg-sky-700"
            >
              دخول آمن إلى اللوحة <Icon name="arrow" className="mr-2 h-4 w-4" />
            </Button>
            <button
              type="button"
              onClick={() => void resetPassword()}
              disabled={isSubmitting}
              className="mt-4 text-sm font-bold text-sky-700 transition hover:text-sky-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              نسيت كلمة المرور؟
            </button>
            {resetSent && (
              <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700">
                إذا كان البريد مسجلاً، سيصل رابط إعادة التعيين قريباً.
              </p>
            )}
            <p className="mt-6 text-center text-xs text-slate-400">
              هذه المنطقة مخصصة لفريق التوظيف المعتمد فقط.
            </p>
          </form>
        </div>
      </div>
    );

  if (user && !role)
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-950 text-white"
        dir="rtl"
      >
        <p className="text-white/70">جاري التحقق من صلاحيات الحساب...</p>
      </div>
    );

  if (role === 'denied')
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-900"
        dir="rtl"
      >
        <Card className="max-w-lg text-center">
          <div className="p-8">
            <h1 className="text-2xl font-black text-slate-950">
              لا توجد صلاحية للوصول
            </h1>
            <p className="mt-3 leading-7 text-slate-500">
              هذا الحساب لا يملك صلاحية المدير أو موظف الموارد البشرية.
            </p>
            <Button
              type="button"
              className="mt-6 bg-sky-600 hover:bg-sky-700"
              onClick={() => void adminService.signOut()}
            >
              تسجيل الخروج
            </Button>
          </div>
        </Card>
      </div>
    );

  const activeJobs = jobs.filter((job) => job.isActive).length;
  const pendingApplications = applications.filter(
    (application) => application.status === 'pending'
  ).length;
  const normalizedApplicationSearch = applicationSearch.trim().toLowerCase();
  const filteredApplications = applications.filter((application) => {
    const jobTitle = jobs.find((job) => job.id === application.jobId)?.title.ar ?? application.jobId;
    const matchesSearch = !normalizedApplicationSearch || [
      application.fullName,
      application.email,
      application.phone,
      application.whatsappNumber,
      jobTitle,
    ].some((value) => value?.toLowerCase().includes(normalizedApplicationSearch));
    const matchesStatus = applicationStatusFilter === 'all' || application.status === applicationStatusFilter;
    const matchesJob = applicationJobFilter === 'all' || application.jobId === applicationJobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });
  return (
    <div className="min-h-screen bg-[#f4f8fb] text-slate-900" dir="rtl">
      <header className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,.28),transparent_34%),radial-gradient(circle_at_85%_0%,rgba(20,184,166,.2),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-500 shadow-lg shadow-sky-500/30">
                <Icon name="briefcase" className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xl font-black">مركز الهواري للتوظيف</p>
                <p className="text-xs font-semibold tracking-[.18em] text-sky-300">
                  CAREERS CONTROL CENTER
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 sm:inline-flex">
                <span className="ml-2 h-2 w-2 rounded-full bg-emerald-400" />{' '}
                {role === 'hr' ? 'موظف موارد بشرية' : 'مدير النظام'}
              </span>
              <Button
                variant="outline"
                onClick={() => void adminService.signOut()}
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                تسجيل الخروج
              </Button>
            </div>
          </div>
          <div className="mt-12 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[.18em] text-cyan-300">
              إدارة المواهب والفرص
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              لوحة تحكم تمنحك رؤية كاملة.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              أنشئ وظائفك، راجع المرشحين، وتابع كل خطوة من رحلة التوظيف بدون
              فوضى.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 font-semibold text-rose-700">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-rose-100">
              !
            </span>
            {error}
          </div>
        )}
        {newApplicationCount > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 font-semibold text-emerald-800">
            <span>وصلت {newApplicationCount} طلبات جديدة منذ فتح اللوحة.</span>
            <Button
              type="button"
              variant="outline"
              className="border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-100"
              onClick={() => setNewApplicationCount(0)}
            >
              فهمت
            </Button>
          </div>
        )}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'إجمالي الوظائف',
              value: jobs.length,
              hint: `${activeJobs} منشورة الآن`,
              icon: 'briefcase' as const,
              color: 'bg-sky-50 text-sky-600',
            },
            {
              label: 'الطلبات الواردة',
              value: applications.length,
              hint: `${pendingApplications} تحتاج مراجعة`,
              icon: 'users' as const,
              color: 'bg-violet-50 text-violet-600',
            },
            {
              label: 'الوظائف النشطة',
              value: activeJobs,
              hint: 'مرئية للمتقدمين',
              icon: 'trend' as const,
              color: 'bg-emerald-50 text-emerald-600',
            },
            {
              label: 'بانتظار الإجراء',
              value: pendingApplications,
              hint: 'تابعها اليوم',
              icon: 'trend' as const,
              color: 'bg-amber-50 text-amber-600',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl ${stat.color}`}
                >
                  <Icon name={stat.icon} />
                </span>
                <span className="text-xs font-bold text-slate-400">LIVE</span>
              </div>
              <p className="mt-5 text-sm font-semibold text-slate-500">
                {stat.label}
              </p>
              <div className="mt-1 flex items-end justify-between">
                <p className="text-3xl font-black text-slate-950">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold text-slate-400">
                  {stat.hint}
                </p>
              </div>
            </div>
          ))}
        </section>

        {role && (
          <nav
            aria-label="أقسام لوحة الإدارة"
            className="sticky top-3 z-20 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-lg shadow-slate-200/50 backdrop-blur"
          >
            <div className="flex gap-2 overflow-x-auto" role="tablist">
              {(role === 'admin'
                ? [
                    ['overview', 'نظرة عامة'],
                    ['jobs', 'الوظائف'],
                    ['applications', 'الطلبات'],
                    ['content', 'المحتوى والمظهر'],
                    ['team', 'فريق HR'],
                  ]
                : [['applications', 'الطلبات']]
              ).map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab as AdminTab)}
                  className={`min-w-max rounded-xl px-4 py-3 text-sm font-bold transition ${
                    activeTab === tab
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {label}
                  {tab === 'applications' && pendingApplications > 0 && (
                    <span className={`mr-2 rounded-full px-2 py-0.5 text-[11px] ${activeTab === tab ? 'bg-white/15 text-white' : 'bg-amber-100 text-amber-700'}`}>
                      {pendingApplications}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>
        )}

        {role === 'admin' && (activeTab === 'jobs' || activeTab === 'content') && (
          <section className="grid gap-7 xl:grid-cols-[1.15fr_.85fr]">
          <Card
            padding="none"
            className={`${activeTab === 'content' ? 'hidden ' : ''}border-0 shadow-[0_18px_60px_rgba(15,23,42,.08)]`}
          >
            <div className="border-b border-slate-100 bg-gradient-to-l from-sky-50 to-white px-6 py-6 sm:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                    <Icon
                      name={editingJobId ? 'briefcase' : 'plus'}
                      className="h-3.5 w-3.5"
                    />{' '}
                    {editingJobId ? 'وضع التعديل' : 'إنشاء إعلان'}
                  </div>
                  <h2 className="text-2xl font-black text-slate-950">
                    {editingJobId ? 'تعديل وظيفة' : 'إضافة وظيفة جديدة'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    أنشئ إعلاناً واضحاً ثم فعّله ليظهر للمتقدمين.
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
            </div>
            <form
              onSubmit={(event) => void saveJob(event)}
              className="space-y-6 p-6 sm:p-8"
            >
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[.16em] text-slate-400">
                  معلومات أساسية
                </p>
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
                  <FieldSelect
                    label="التصنيف"
                    value={jobForm.category}
                    onChange={(value) =>
                      setJobForm((current) => ({
                        ...current,
                        category: value as JobAdminInput['category'],
                      }))
                    }
                  >
                    {JOB_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </FieldSelect>
                  <FieldSelect
                    label="نوع الدوام"
                    value={jobForm.type}
                    onChange={(value) =>
                      setJobForm((current) => ({
                        ...current,
                        type: value as JobAdminInput['type'],
                      }))
                    }
                  >
                    {JOB_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </FieldSelect>
                  <FieldSelect
                    label="الخبرة"
                    value={jobForm.experienceLevel}
                    onChange={(value) =>
                      setJobForm((current) => ({
                        ...current,
                        experienceLevel:
                          value as JobAdminInput['experienceLevel'],
                      }))
                    }
                  >
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </FieldSelect>
                  <FieldSelect
                    label="المؤهل"
                    value={jobForm.educationLevel}
                    onChange={(value) =>
                      setJobForm((current) => ({
                        ...current,
                        educationLevel:
                          value as JobAdminInput['educationLevel'],
                      }))
                    }
                  >
                    {EDUCATION_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </FieldSelect>
                  <Input
                    label="المدينة"
                    value={jobForm.location.city}
                    onChange={(event) =>
                      setJobForm((current) => ({
                        ...current,
                        location: {
                          ...current.location,
                          city: event.target.value,
                        },
                      }))
                    }
                    required
                  />
                  <Input
                    label="المحافظة"
                    value={jobForm.location.governorate}
                    onChange={(event) =>
                      setJobForm((current) => ({
                        ...current,
                        location: {
                          ...current.location,
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
              </div>
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[.16em] text-slate-400">
                  تفاصيل الإعلان
                </p>
                <div className="space-y-4">
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
                  <Textarea
                    label="المسؤوليات، كل مسؤولية في سطر"
                    value={jobForm.responsibilities.ar.join('\n')}
                    onChange={(event) =>
                      setJobForm((current) => ({
                        ...current,
                        responsibilities: {
                          ...current.responsibilities,
                          ar: event.target.value
                            .split('\n')
                            .map((item) => item.trim())
                            .filter(Boolean),
                        },
                      }))
                    }
                  />
                  <Textarea
                    label="المزايا، كل ميزة في سطر"
                    value={jobForm.benefits.join('\n')}
                    onChange={(event) =>
                      setJobForm((current) => ({
                        ...current,
                        benefits: event.target.value
                          .split('\n')
                          .map((item) => item.trim())
                          .filter(Boolean),
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <p className="text-xs leading-5 text-slate-400">
                  ستظهر الوظيفة للعامة فور تفعيلها ونشرها.
                </p>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="h-12 rounded-xl bg-sky-600 px-7 shadow-lg shadow-sky-200 hover:bg-sky-700"
                >
                  {editingJobId ? 'حفظ التعديلات' : 'نشر الوظيفة'}{' '}
                  <Icon name="arrow" className="mr-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>

          <div className="space-y-7">
            <div className={`${activeTab === 'content' ? 'hidden ' : ''}rounded-3xl bg-gradient-to-br from-sky-600 to-cyan-700 p-7 text-white shadow-xl shadow-sky-200`}>
              <p className="text-sm font-bold text-cyan-100">إرشاد سريع</p>
              <h3 className="mt-3 text-2xl font-black leading-tight">
                إعلان واضح = مرشح أفضل
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/75">
                اكتب وصفاً مختصراً، حدّد المدينة بدقة، وأضف المتطلبات الأساسية
                لتقليل الأسئلة وتحسين جودة الطلبات.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-sm">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
                  <Icon name="trend" />
                </span>
                <span>راجع الإعلانات النشطة أسبوعياً</span>
              </div>
            </div>
            <div className={`${activeTab === 'content' ? 'hidden ' : ''}rounded-3xl border border-slate-200 bg-white p-7 shadow-sm`}>
              <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">
                ملخص النشر
              </p>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-sm text-slate-500">
                    الوظائف المنشورة
                  </span>
                  <strong className="text-2xl font-black text-slate-950">
                    {activeJobs}
                  </strong>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-sm text-slate-500">إجمالي الطلبات</span>
                  <strong className="text-2xl font-black text-slate-950">
                    {applications.length}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">حالة النظام</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    يعمل بشكل جيد
                  </span>
                </div>
              </div>
            </div>

            <form
              onSubmit={(event) => void saveWhatsAppSettings(event)}
              className={`${activeTab === 'content' ? 'hidden ' : ''}rounded-3xl border border-emerald-100 bg-emerald-50/70 p-7 shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white">
                  <Icon name="phone" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">
                    إعدادات التواصل
                  </p>
                  <h3 className="mt-1 text-xl font-black text-slate-950">
                    رقم واتساب استقبال السير الذاتية
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    غيّر الرقم من هنا، وسيظهر تلقائياً في رسالة المتقدم بعد إرسال الطلب.
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <Input
                  label="رقم واتساب الصيدلية"
                  value={whatsappNumber}
                  inputMode="numeric"
                  onChange={(event) => {
                    setWhatsappNumber(event.target.value);
                    setSettingsSaved(false);
                  }}
                  placeholder="0201000753375"
                  required
                />
                <p className="mt-2 text-xs text-slate-500">
                  استخدم الأرقام فقط، ويمكن تغييره لاحقاً دون تعديل الموقع.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                {settingsSaved ? (
                  <span className="text-sm font-bold text-emerald-700">
                    تم حفظ رقم واتساب بنجاح.
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">
                    الإعداد محمي ويُعدّله المدير فقط.
                  </span>
                )}
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="rounded-xl bg-emerald-600 px-5 shadow-lg shadow-emerald-200 hover:bg-emerald-700"
                >
                  حفظ الرقم
                </Button>
              </div>
            </form>

            {activeTab === 'content' && <PageContentEditor
              value={siteContent}
              onChange={(next) => {
                setSiteContent(next);
                setContentJson(JSON.stringify(next, null, 2));
                setContentSaved(false);
              }}
              onSave={() => void saveStructuredSiteContent()}
              onReset={resetSiteContentEditor}
              saving={isSubmitting}
              saved={contentSaved}
            />}

            <form
              onSubmit={(event) => void saveSiteContentSettings(event)}
              className={`${activeTab === 'content' ? '' : 'hidden '}rounded-3xl border border-violet-100 bg-violet-50/60 p-7 shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-violet-600 text-white">
                  <Icon name="briefcase" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[.16em] text-violet-700">
                    تحكم شامل بالمحتوى والمظهر
                  </p>
                  <h3 className="mt-1 text-xl font-black text-slate-950">
                    محرر الموقع الكامل
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    عدّل أي نص أو زر أو اسم صفحة أو لون من هذا المحرر. التغييرات تُحفظ في Firestore وتظهر للزوار بعد تحديث الصفحة.
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <Textarea
                  label="محتوى الموقع بصيغة JSON"
                  value={contentJson}
                  onChange={(event) => {
                    setContentJson(event.target.value);
                    setContentSaved(false);
                  }}
                  spellCheck={false}
                  className="min-h-[420px] bg-slate-950 font-mono text-xs leading-6 text-emerald-200"
                  aria-label="محرر محتوى الموقع"
                />
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  حافظ على أسماء الحقول والأقواس. يمكنك تعديل النص العربي والإنجليزي، الروابط، ألوان الهوية، الشعار، وCSS المخصص.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                {contentSaved ? (
                  <span className="text-sm font-bold text-emerald-700">
                    تم حفظ محتوى الموقع والمظهر بنجاح.
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">
                    هذا المحرر متاح للمدير فقط.
                  </span>
                )}
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetSiteContentEditor}
                    disabled={isSubmitting}
                    className="rounded-xl"
                  >
                    تراجع عن التغييرات
                  </Button>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    className="rounded-xl bg-violet-600 px-5 shadow-lg shadow-violet-200 hover:bg-violet-700"
                  >
                    حفظ محتوى الموقع
                  </Button>
                </div>
              </div>
            </form>
          </div>
          </section>
        )}

        {role === 'admin' && activeTab === 'team' && (
          <section className="rounded-3xl border border-indigo-100 bg-indigo-50/50 p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[.16em] text-indigo-600">
                  صلاحيات الفريق
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  إدارة موظفي الموارد البشرية
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  امنح حساباً موجوداً في Firebase صلاحية مراجعة الطلبات فقط. لا يستطيع موظف HR إدارة الوظائف أو إعدادات التواصل أو منح صلاحيات لغيره.
                </p>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700">
                المدير فقط
              </span>
            </div>
            <form
              onSubmit={(event) => void saveStaffRole(event)}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <div className="flex-1">
                <Input
                  label="بريد حساب الموظف"
                  type="email"
                  value={staffEmail}
                  onChange={(event) => {
                    setStaffEmail(event.target.value);
                    setStaffSaved(false);
                  }}
                  placeholder="hr@elhawarypharmacy.com"
                  required
                />
              </div>
              <Button
                type="submit"
                loading={isSubmitting}
                className="h-11 rounded-xl bg-indigo-600 px-5 hover:bg-indigo-700"
              >
                منح صلاحية HR
              </Button>
            </form>
            {staffSaved && (
              <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                تم منح الصلاحية بنجاح. يجب أن يسجل الموظف الدخول بالحساب نفسه.
              </p>
            )}
            <div className="mt-6 overflow-x-auto rounded-2xl border border-indigo-100 bg-white">
              <table className="min-w-full text-right text-sm">
                <thead>
                  <tr className="border-b border-indigo-100 text-xs font-black text-slate-400">
                    <th className="px-4 py-3">الحساب</th>
                    <th className="px-4 py-3">الدور</th>
                    <th className="px-4 py-3">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {staffMembers.map((member) => (
                    <tr key={member.email} className="border-b border-slate-50">
                      <td className="px-4 py-4 font-semibold text-slate-700">
                        {member.email}
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                          موظف موارد بشرية
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <Button
                          type="button"
                          size="sm"
                          variant="danger"
                          loading={isSubmitting}
                          onClick={() => void revokeStaffRole(member)}
                        >
                          سحب الصلاحية
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {staffMembers.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-slate-400">
                  لم تتم إضافة موظفي موارد بشرية بعد.
                </p>
              )}
            </div>
          </section>
        )}

        {role === 'admin' && activeTab === 'jobs' && (
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">
                  المحتوى المنشور
                </p>
                <h2 className="mt-2 text-2xl font-black">إدارة الوظائف</h2>
            </div>
            <p className="text-sm text-slate-500">
              {jobs.length} وظيفة في قاعدة البيانات
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-black text-slate-400">
                  <th className="px-4 py-4">الوظيفة</th>
                  <th className="px-4 py-4">المكان</th>
                  <th className="px-4 py-4">الانتهاء</th>
                  <th className="px-4 py-4">الحالة</th>
                  <th className="px-4 py-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-slate-50 transition hover:bg-sky-50/40"
                  >
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-sky-600">
                          <Icon name="briefcase" className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-black text-slate-900">
                            {job.title.ar}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {job.title.en || 'بدون عنوان إنجليزي'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5 font-semibold text-slate-600">
                      {job.location.city}
                    </td>
                    <td className="px-4 py-5 text-slate-500">
                      {job.expiryDate}
                    </td>
                    <td className="px-4 py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${job.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                      >
                        {job.isActive ? 'منشورة' : 'مغلقة'}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex gap-2">
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {jobs.length === 0 && (
              <p className="p-10 text-center text-slate-400">
                لا توجد وظائف حتى الآن.
              </p>
            )}
          </div>
          </section>
        )}

        {activeTab === 'applications' && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">
                آخر التفاعلات
              </p>
              <h2 className="mt-2 text-2xl font-black">طلبات التوظيف</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>تابع المرشحين وتواصل معهم عبر واتساب</span>
              <div className="flex flex-wrap items-center gap-2">
                {role === 'admin' && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={downloadAdminBackup}
                  >
                    تنزيل نسخة احتياطية
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void enableBrowserNotifications()}
                  disabled={notificationsEnabled}
                >
                  {notificationsEnabled ? 'تنبيهات المتصفح مفعّلة' : 'تفعيل التنبيهات المجانية'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => downloadApplicationsCsv(filteredApplications, jobs)}
                  disabled={filteredApplications.length === 0}
                >
                  تصدير CSV
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[minmax(0,1.5fr)_minmax(180px,1fr)_minmax(180px,1fr)_auto] md:items-end">
            <Input
              label="بحث في الطلبات"
              value={applicationSearch}
              onChange={(event) => setApplicationSearch(event.target.value)}
              placeholder="الاسم، البريد، الهاتف أو الوظيفة"
            />
            <FieldSelect
              label="الحالة"
              value={applicationStatusFilter}
              onChange={(value) => setApplicationStatusFilter(value as 'all' | AdminApplication['status'])}
            >
              <option value="all">كل الحالات</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </FieldSelect>
            <FieldSelect
              label="الوظيفة"
              value={applicationJobFilter}
              onChange={setApplicationJobFilter}
            >
              <option value="all">كل الوظائف</option>
              {jobs.map((job) => <option key={job.id} value={job.id}>{job.title.ar}</option>)}
            </FieldSelect>
            <div className="flex items-center justify-between gap-3 md:justify-end">
              <span className="whitespace-nowrap text-xs font-bold text-slate-500">
                عرض {filteredApplications.length} من {applications.length}
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setApplicationSearch('');
                  setApplicationStatusFilter('all');
                  setApplicationJobFilter('all');
                }}
              >
                مسح
              </Button>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-black text-slate-400">
                  <th className="px-4 py-4">المتقدم</th>
                  <th className="px-4 py-4">بيانات التواصل</th>
                  <th className="px-4 py-4">الوظيفة</th>
                  <th className="px-4 py-4">التاريخ</th>
                  <th className="px-4 py-4">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr
                    key={application.id}
                    className="border-b border-slate-50 hover:bg-slate-50"
                  >
                    <td className="px-4 py-5">
                      <p className="font-black text-slate-900">
                        {application.fullName}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        طلب رقم {application.id.slice(0, 8)}
                      </p>
                    </td>
                    <td className="px-4 py-5">
                      <p className="text-slate-500">{application.email}</p>
                      <p className="mt-1 text-slate-500">{application.phone}</p>
                      <a
                        className="mt-2 inline-flex font-bold text-emerald-600 hover:text-emerald-700"
                        href={`https://wa.me/${(application.whatsappNumber ?? application.phone).replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        واتساب:{' '}
                        {application.whatsappNumber ?? application.phone}
                      </a>
                    </td>
                    <td className="px-4 py-5 font-semibold text-slate-600">
                      {jobs.find((job) => job.id === application.jobId)?.title
                        .ar ?? application.jobId}
                    </td>
                    <td className="px-4 py-5">
                      <p className="text-slate-500">
                        {formatDate(application.submittedAt)}
                      </p>
                      <p className="mt-2 text-xs text-amber-600">
                        السيرة الذاتية:{' '}
                        {application.cvReceived
                          ? 'تم الاستلام'
                          : 'بانتظار الإرسال'}
                      </p>
                    </td>
                    <td className="px-4 py-5">
                      <select
                        className={`rounded-full px-3 py-2 text-xs font-bold outline-none ring-1 ${statusStyles[application.status]}`}
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
            {filteredApplications.length === 0 && (
              <div className="py-12 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                  <Icon name="users" />
                </div>
                  <p className="mt-4 font-bold text-slate-600">
                  {applications.length === 0 ? 'لا توجد طلبات حتى الآن' : 'لا توجد نتائج مطابقة'}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {applications.length === 0 ? 'ستظهر طلبات المرشحين هنا بعد التقديم.' : 'جرّب تغيير البحث أو عوامل التصفية.'}
                </p>
              </div>
            )}
          </div>
        </section>
        )}
      </main>
    </div>
  );
}
