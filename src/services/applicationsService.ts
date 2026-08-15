import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';
import {
  getFirebaseInstances,
  hasFirebaseConfig,
  isDemoMode,
} from '@/lib/firebase';

const applicationSchema = z.object({
  jobId: z.string().min(1),
  fullName: z.string().trim().min(2, 'الاسم مطلوب'),
  birthDate: z.string().min(1, 'تاريخ الميلاد مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().trim().min(8, 'رقم الهاتف غير صحيح'),
  whatsappNumber: z.string().trim().min(8, 'رقم واتساب غير صحيح'),
  address: z.string().trim().min(2, 'العنوان مطلوب'),
  bio: z.string().trim().optional(),
  education: z.object({
    degree: z.string().trim().min(2, 'المؤهل مطلوب'),
    institution: z.string().trim().min(2, 'الجامعة أو المعهد مطلوب'),
    graduationYear: z.coerce
      .number()
      .min(1900)
      .max(new Date().getFullYear() + 5),
    grade: z.string().trim().optional(),
  }),
  experience: z.object({
    company: z.string().trim().min(2, 'اسم الشركة مطلوب'),
    position: z.string().trim().min(2, 'المسمى الوظيفي مطلوب'),
    startDate: z.string().min(1, 'تاريخ البدء مطلوب'),
    endDate: z.string().optional(),
    description: z.string().trim().optional(),
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

class ApplicationsService {
  async createApplication(
    input: CreateApplicationInput
  ): Promise<{ id: string; reference: string }> {
    const validated = applicationSchema.parse(input);

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
    const applicationRef = await addDoc(collection(db, 'applications'), {
      ...validated,
      status: 'pending',
      cvDelivery: 'whatsapp',
      cvReceived: false,
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: applicationRef.id,
      reference: `ELH-${applicationRef.id.slice(0, 8).toUpperCase()}`,
    };
  }
}

export const applicationsService = new ApplicationsService();
