import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { z } from 'zod';
import { getFirebaseInstances, hasFirebaseConfig } from '@/lib/firebase';

const applicationSchema = z.object({
  jobId: z.string().min(1),
  fullName: z.string().trim().min(2, 'الاسم مطلوب'),
  birthDate: z.string().min(1, 'تاريخ الميلاد مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().trim().min(8, 'رقم الهاتف غير صحيح'),
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
});

export interface CreateApplicationInput {
  jobId: string;
  fullName: string;
  birthDate: string;
  email: string;
  phone: string;
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
  cvFile: File;
  certificateFile?: File;
  recommendationFile?: File;
}

async function uploadAttachment(
  storage: ReturnType<typeof getFirebaseInstances>['storage'],
  jobId: string,
  file: File,
  kind: string
) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const fileRef = ref(
    storage,
    `applications/${jobId}/${crypto.randomUUID()}-${kind}-${safeName}`
  );
  await uploadBytes(fileRef, file, {
    contentType: file.type || 'application/octet-stream',
  });
  return {
    path: fileRef.fullPath,
    name: file.name,
    contentType: file.type || 'application/octet-stream',
    size: file.size,
  };
}

class ApplicationsService {
  async createApplication(
    input: CreateApplicationInput
  ): Promise<{ id: string; reference: string }> {
    const validated = applicationSchema.parse(input);

    if (!hasFirebaseConfig()) {
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
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem(
        'elhawary_applications',
        JSON.stringify(localApplications)
      );
      return { id, reference };
    }

    const { db, storage } = getFirebaseInstances();
    const [cv, certificate, recommendation] = await Promise.all([
      uploadAttachment(storage, input.jobId, input.cvFile, 'cv'),
      input.certificateFile
        ? uploadAttachment(
            storage,
            input.jobId,
            input.certificateFile,
            'certificate'
          )
        : Promise.resolve(null),
      input.recommendationFile
        ? uploadAttachment(
            storage,
            input.jobId,
            input.recommendationFile,
            'recommendation'
          )
        : Promise.resolve(null),
    ]);

    const applicationRef = await addDoc(collection(db, 'applications'), {
      ...validated,
      jobId: input.jobId,
      cv,
      certificate,
      recommendation,
      status: 'pending',
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
