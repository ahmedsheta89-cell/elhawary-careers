import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { z } from 'zod';
import {
  getFirebaseInstances,
  hasFirebaseConfig,
  isDemoMode,
} from '@/lib/firebase';

const applicationSchema = z.object({
  jobId: z.string().min(1),
  fullName: z.string().trim().min(2, 'الاسم مطلوب').max(120, 'الاسم طويل جداً'),
  birthDate: z.string().min(1, 'تاريخ الميلاد مطلوب'),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح').max(254, 'البريد الإلكتروني طويل جداً').transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(8, 'رقم الهاتف غير صحيح').max(30, 'رقم الهاتف طويل جداً'),
  whatsappNumber: z.string().trim().min(8, 'رقم واتساب غير صحيح').max(30, 'رقم واتساب طويل جداً'),
  address: z.string().trim().min(2, 'العنوان مطلوب').max(300, 'العنوان طويل جداً'),
  bio: z.string().trim().max(2000, 'النبذة طويلة جداً').optional(),
  education: z.object({
    degree: z.string().trim().min(2, 'المؤهل مطلوب').max(160, 'المؤهل طويل جداً'),
    institution: z.string().trim().min(2, 'الجامعة أو المعهد مطلوب').max(200, 'اسم الجامعة طويل جداً'),
    graduationYear: z.coerce
      .number()
      .min(1900)
      .max(new Date().getFullYear() + 5),
    grade: z.string().trim().max(80, 'التقدير طويل جداً').optional(),
  }),
  experience: z.object({
    company: z.string().trim().min(2, 'اسم الشركة مطلوب').max(160, 'اسم الشركة طويل جداً'),
    position: z.string().trim().min(2, 'المسمى الوظيفي مطلوب').max(160, 'المسمى الوظيفي طويل جداً'),
    startDate: z.string().min(1, 'تاريخ البدء مطلوب'),
    endDate: z.string().optional(),
    description: z.string().trim().max(2000, 'وصف الخبرة طويل جداً').optional(),
  }),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: 'يجب الموافقة على سياسة الخصوصية.' }),
  }),
});

export interface CreateApplicationInput {
  jobId: string;
  fullName: string;
  birthDate: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  bio?: string;
  education: {
    degree: string;
    institution: string;
    graduationYear: number;
    grade?: string;
  };
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
  };
  privacyConsent: boolean;
}

async function createDeduplicationKey(jobId: string, email: string) {
  const source = `${jobId.trim().toLowerCase()}:${email.trim().toLowerCase()}`;
  const encoded = new TextEncoder().encode(source);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

class ApplicationsService {
  async createApplication(
    input: CreateApplicationInput
  ): Promise<{ id: string; reference: string }> {
    const validated = applicationSchema.parse(input);
    const dedupeKey = await createDeduplicationKey(validated.jobId, validated.email);

    if (!hasFirebaseConfig()) {
      if (!isDemoMode()) {
        throw new Error('لم يتم إعداد Firebase. لا يمكن إرسال الطلب حالياً.');
      }

      const id = crypto.randomUUID();
      const reference = `ELH-${id.slice(0, 8).toUpperCase()}`;
      const localApplications = JSON.parse(
        localStorage.getItem('elhawary_applications') ?? '[]'
      );
      localApplications.push({
        ...validated,
        dedupeKey,
        id,
        reference,
        status: 'pending',
        cvDelivery: 'whatsapp',
        cvReceived: false,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem(
        'elhawary_applications',
        JSON.stringify(localApplications)
      );
      return { id, reference };
    }

    const { db } = getFirebaseInstances();
    const applicationRef = doc(collection(db, 'applications'), dedupeKey);

    try {
      await setDoc(applicationRef, {
        ...validated,
        dedupeKey,
        status: 'pending',
        cvDelivery: 'whatsapp',
        cvReceived: false,
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'already-exists') {
        throw new Error('يوجد طلب مسجل بهذا البريد الإلكتروني لهذه الوظيفة بالفعل.');
      }
      throw error;
    }

    return {
      id: applicationRef.id,
      reference: `ELH-${applicationRef.id.slice(0, 8).toUpperCase()}`,
    };
  }
}

export const applicationsService = new ApplicationsService();
