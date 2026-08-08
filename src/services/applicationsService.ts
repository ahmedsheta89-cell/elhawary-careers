import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where,
  serverTimestamp,
  orderBy,
  getDoc,
  type DocumentData
} from 'firebase/firestore';
import { z } from 'zod';
import { db } from '../lib/firebase';
import { authService } from './authService';

const applicationSchema = z.object({
  jobId: z.string().min(1),
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  education: z.string().min(2).max(200),
  graduationYear: z.number().min(1900).max(new Date().getFullYear() + 5),
  experienceYears: z.number().min(0).max(50),
  message: z.string().min(10).max(1000),
  cvUrl: z.string().optional(),
  cvFileName: z.string().optional(),
});

export interface Application {
  id?: string;
  jobId: string;
  jobTitle?: string;
  fullName: string;
  email: string;
  phone: string;
  education: string;
  graduationYear: number;
  experienceYears: number;
  message: string;
  cvUrl?: string;
  cvFileName?: string;
  status: 'pending' | 'under-review' | 'interview' | 'accepted' | 'rejected';
  adminNotes?: string;
  submittedAt?: any;
  updatedAt?: any;
}

class ApplicationsService {
  private collectionName = 'applications';

  async getAllApplications(): Promise<Application[]> {
    if (!await authService.validateAdminAccess()) {
      throw new Error('Access denied');
    }
    try {
      const q = query(collection(db, this.collectionName), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate ? doc.data().submittedAt.toDate() : doc.data().submittedAt,
      } as Application));
    } catch (error) {
      console.error('Error getting applications:', error);
      throw error;
    }
  }

  async getApplicationById(id: string): Promise<Application | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          submittedAt: data.submittedAt?.toDate ? data.submittedAt.toDate() : data.submittedAt,
        } as Application;
      }
      return null;
    } catch (error) {
      console.error('Error getting application:', error);
      throw error;
    }
  }

  async createApplication(applicationData: Omit<Application, 'id' | 'status' | 'submittedAt' | 'updatedAt' | 'adminNotes'>): Promise<string> {
    try {
      const validatedData = applicationSchema.parse(applicationData);
      const jobRef = doc(db, 'jobs', validatedData.jobId);
      const jobSnap = await getDoc(jobRef);
      
      if (!jobSnap.exists() || !jobSnap.data().isActive) {
        throw new Error('الوظيفة غير متاحة للتقديم');
      }

      const cleanData = {
        jobId: validatedData.jobId,
        jobTitle: jobSnap.data().title,
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        education: validatedData.education,
        graduationYear: validatedData.graduationYear,
        experienceYears: validatedData.experienceYears,
        message: validatedData.message,
        cvUrl: validatedData.cvUrl,
        cvFileName: validatedData.cvFileName,
        status: 'pending' as const,
        submittedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.collectionName), cleanData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating application:', error);
      if (error instanceof z.ZodError) {
        throw new Error(`خطأ في التحقق: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  async updateApplicationStatus(id: string, status: Application['status'], adminNotes?: string): Promise<void> {
    if (!await authService.validateAdminAccess()) {
      throw new Error('Access denied');
    }
    try {
      const updateData: any = { 
        status,
        updatedAt: serverTimestamp()
      };
      if (adminNotes !== undefined) {
        updateData.adminNotes = adminNotes;
      }
      await updateDoc(doc(db, this.collectionName, id), updateData);
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  async getApplicationsByJobId(jobId: string): Promise<Application[]> {
    if (!await authService.validateAdminAccess()) {
      throw new Error('Access denied');
    }
    try {
      const q = query(
        collection(db, this.collectionName),
        where('jobId', '==', jobId),
        orderBy('submittedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate ? doc.data().submittedAt.toDate() : doc.data().submittedAt,
      } as Application));
    } catch (error) {
      console.error('Error getting applications by job ID:', error);
      throw error;
    }
  }
}

export const applicationsService = new ApplicationsService();
export default applicationsService;
