import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  serverTimestamp,
  type DocumentData
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { authService } from './authService';

export interface Job {
  id?: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salaryRange?: string;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

class JobsService {
  private collectionName = 'jobs';

  async getAllActiveJobs(): Promise<Job[]> {
    try {
      const q = query(collection(db, this.collectionName), where('isActive', '==', true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt,
      } as Job));
    } catch (error) {
      console.error('Error getting jobs:', error);
      throw error;
    }
  }

  async getJobById(id: string): Promise<Job | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        } as Job;
      }
      return null;
    } catch (error) {
      console.error('Error getting job:', error);
      throw error;
    }
  }

  async createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!await authService.validateAdminAccess()) {
      throw new Error('Access denied: Only admins can create jobs');
    }
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...jobData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  async updateJob(id: string, jobData: Partial<Job>): Promise<void> {
    if (!await authService.validateAdminAccess()) {
      throw new Error('Access denied: Only admins can update jobs');
    }
    try {
      const jobRef = doc(db, this.collectionName, id);
      await updateDoc(jobRef, {
        ...jobData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  async deleteJob(id: string): Promise<void> {
    if (!await authService.validateAdminAccess()) {
      throw new Error('Access denied: Only admins can delete jobs');
    }
    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  async toggleJobStatus(id: string, isActive: boolean): Promise<void> {
    if (!await authService.validateAdminAccess()) {
      throw new Error('Access denied: Only admins can update job status');
    }
    try {
      await updateDoc(doc(db, this.collectionName, id), {
        isActive,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error toggling job status:', error);
      throw error;
    }
  }
}

import { getDoc } from 'firebase/firestore';

export const jobsService = new JobsService();
export default jobsService;
