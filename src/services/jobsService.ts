import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
} from 'firebase/firestore';
import type { Job } from '@/types';
import {
  getFirebaseInstances,
  hasFirebaseConfig,
  isDemoMode,
} from '@/lib/firebase';
import { MOCK_JOBS } from './mockData';

function toDateString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'toDate' in value) {
    const date = (value as { toDate: () => Date }).toDate();
    return date.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

function removeUndefinedDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(removeUndefinedDeep);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, nestedValue]) => nestedValue !== undefined)
        .map(([key, nestedValue]) => [key, removeUndefinedDeep(nestedValue)])
    );
  }
  return value;
}

function mapJob(id: string, data: DocumentData): Job {
  const raw = data as Partial<Job> & Record<string, unknown>;
  return {
    id,
    title: raw.title as Job['title'],
    description: raw.description as Job['description'],
    requirements: raw.requirements as Job['requirements'],
    responsibilities: raw.responsibilities as Job['responsibilities'],
    category: raw.category as Job['category'],
    type: raw.type as Job['type'],
    experienceLevel: raw.experienceLevel as Job['experienceLevel'],
    educationLevel: raw.educationLevel as Job['educationLevel'],
    location: raw.location as Job['location'],
    salaryRange: raw.salaryRange as Job['salaryRange'],
    benefits: Array.isArray(raw.benefits) ? (raw.benefits as string[]) : [],
    postedDate: toDateString(raw.postedDate ?? raw.createdAt),
    expiryDate: toDateString(raw.expiryDate),
    isActive: raw.isActive !== false,
    applicationCount:
      typeof raw.applicationCount === 'number' ? raw.applicationCount : 0,
  };
}

export type JobAdminInput = Omit<Job, 'id' | 'applicationCount'> & {
  applicationCount?: number;
};

class JobsService {
  async getActiveJobs(): Promise<Job[]> {
    if (!hasFirebaseConfig()) {
      if (isDemoMode()) return MOCK_JOBS.filter((job) => job.isActive);
      throw new Error('لم يتم إعداد Firebase. لا يمكن تحميل الوظائف حالياً.');
    }

    const { db } = getFirebaseInstances();
    const jobsQuery = query(
      collection(db, 'jobs'),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(jobsQuery);
    return snapshot.docs
      .map((item) => mapJob(item.id, item.data()))
      .sort((a, b) => b.postedDate.localeCompare(a.postedDate));
  }

  async getAllJobs(): Promise<Job[]> {
    if (!hasFirebaseConfig()) {
      if (isDemoMode()) return MOCK_JOBS;
      throw new Error('لم يتم إعداد Firebase. لا يمكن تحميل الوظائف حالياً.');
    }
    const { db } = getFirebaseInstances();
    const snapshot = await getDocs(collection(db, 'jobs'));
    return snapshot.docs
      .map((item) => mapJob(item.id, item.data()))
      .sort((a, b) => b.postedDate.localeCompare(a.postedDate));
  }

  async saveJob(input: JobAdminInput, id?: string): Promise<string> {
    if (!hasFirebaseConfig())
      throw new Error('أكمل إعداد Firebase قبل إدارة الوظائف.');
    const { db } = getFirebaseInstances();
    const rawPayload = {
      ...input,
      postedDate: input.postedDate || new Date().toISOString().slice(0, 10),
      applicationCount: input.applicationCount ?? 0,
      updatedAt: new Date().toISOString(),
    };
    // Firestore يرفض القيم undefined؛ تظهر خصوصاً عند تعديل وظيفة قديمة
    // لا تحتوي على salaryRange. نزيل الحقول غير المعرفة قبل الكتابة.
    const payload = removeUndefinedDeep(rawPayload) as Record<string, unknown>;
    if (id) {
      await setDoc(doc(db, 'jobs', id), payload, { merge: true });
      return id;
    }
    const created = await addDoc(collection(db, 'jobs'), payload);
    return created.id;
  }

  async setActive(id: string, isActive: boolean) {
    if (!hasFirebaseConfig())
      throw new Error('أكمل إعداد Firebase قبل إدارة الوظائف.');
    const { db } = getFirebaseInstances();
    await updateDoc(doc(db, 'jobs', id), {
      isActive,
      updatedAt: new Date().toISOString(),
    });
  }

  async getJobById(id: string): Promise<Job | null> {
    if (!hasFirebaseConfig()) {
      if (isDemoMode()) return MOCK_JOBS.find((job) => job.id === id) ?? null;
      throw new Error(
        'لم يتم إعداد Firebase. لا يمكن تحميل تفاصيل الوظيفة حالياً.'
      );
    }

    const { db } = getFirebaseInstances();
    const snapshot = await getDoc(doc(db, 'jobs', id));
    return snapshot.exists() ? mapJob(snapshot.id, snapshot.data()) : null;
  }
}

export const jobsService = new JobsService();
