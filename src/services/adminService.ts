import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  type DocumentData,
} from 'firebase/firestore';
import { getFirebaseInstances, hasFirebaseConfig } from '@/lib/firebase';

export type AdminApplication = DocumentData & {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  jobId: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  submittedAt?: { toDate?: () => Date } | string;
};

function requireFirebase() {
  if (!hasFirebaseConfig())
    throw new Error('أكمل إعداد Firebase قبل فتح لوحة الإدارة.');
  return getFirebaseInstances();
}

class AdminService {
  subscribe(callback: (user: User | null) => void) {
    if (!hasFirebaseConfig()) return () => undefined;
    const { auth } = getFirebaseInstances();
    return onAuthStateChanged(auth, callback);
  }

  async signIn(email: string, password: string) {
    const { auth } = requireFirebase();
    return signInWithEmailAndPassword(auth, email, password);
  }

  async signOut() {
    const { auth } = requireFirebase();
    return signOut(auth);
  }

  async getApplications(): Promise<AdminApplication[]> {
    const { db } = requireFirebase();
    const applicationsQuery = query(
      collection(db, 'applications'),
      orderBy('submittedAt', 'desc')
    );
    const snapshot = await getDocs(applicationsQuery);
    return snapshot.docs.map(
      (item) => ({ id: item.id, ...item.data() }) as AdminApplication
    );
  }

  async updateApplicationStatus(
    id: string,
    status: AdminApplication['status']
  ) {
    const { db } = requireFirebase();
    await updateDoc(doc(db, 'applications', id), {
      status,
      updatedAt: new Date().toISOString(),
    });
  }
}

export const adminService = new AdminService();
