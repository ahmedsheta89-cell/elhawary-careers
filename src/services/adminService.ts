import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  type DocumentData,
} from 'firebase/firestore';
import { getFirebaseInstances, hasFirebaseConfig } from '@/lib/firebase';
import {
  DEFAULT_WHATSAPP_NUMBER,
  normalizeWhatsAppNumber,
  type SiteSettings,
} from '@/services/siteSettingsService';

export type StaffRole = 'hr';

export type StaffMember = {
  id: string;
  email: string;
  role: StaffRole;
  updatedAt?: string;
};

export type AdminApplication = DocumentData & {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  jobId: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  cvDelivery?: 'whatsapp';
  cvReceived?: boolean;
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

  async sendPasswordReset(email: string) {
    const { auth } = requireFirebase();
    return sendPasswordResetEmail(auth, email);
  }

  private async writeAuditLog(
    action: string,
    entity: string,
    entityId: string,
    details: Record<string, unknown> = {}
  ) {
    try {
      const { db, auth } = requireFirebase();
      const user = auth.currentUser;
      if (!user) return;
      const logId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await setDoc(doc(db, 'auditLogs', logId), {
        action,
        entity,
        entityId,
        details,
        actorEmail: user.email ?? '',
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Unable to write audit log', error);
    }
  }

  async getStaffRole(email: string): Promise<StaffRole | null> {
    const { db } = requireFirebase();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return null;
    const snapshot = await getDoc(doc(db, 'staffRoles', normalizedEmail));
    return snapshot.data()?.role === 'hr' ? 'hr' : null;
  }

  async getStaffMembers(): Promise<StaffMember[]> {
    const { db } = requireFirebase();
    const snapshot = await getDocs(collection(db, 'staffRoles'));
    return snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }) as StaffMember)
      .filter((item) => item.role === 'hr')
      .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));
  }

  async grantHrRole(email: string): Promise<StaffMember> {
    const { db } = requireFirebase();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      throw new Error('اكتب بريداً إلكترونياً صحيحاً للموظف.');
    }
    const member: StaffMember = {
      id: normalizedEmail,
      email: normalizedEmail,
      role: 'hr',
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'staffRoles', normalizedEmail), member);
    await this.writeAuditLog('grant_hr_role', 'staffRole', normalizedEmail);
    return member;
  }

  async revokeHrRole(email: string) {
    const { db } = requireFirebase();
    const normalizedEmail = email.trim().toLowerCase();
    await deleteDoc(doc(db, 'staffRoles', normalizedEmail));
    await this.writeAuditLog('revoke_hr_role', 'staffRole', normalizedEmail);
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
    await this.writeAuditLog('update_application_status', 'application', id, { status });
  }

  async getSiteSettings(): Promise<SiteSettings> {
    const { db } = requireFirebase();
    try {
      const snapshot = await getDoc(doc(db, 'settings', 'public'));
      const value = snapshot.data()?.whatsappNumber;
      return {
        whatsappNumber:
          typeof value === 'string' && normalizeWhatsAppNumber(value)
            ? normalizeWhatsAppNumber(value)
            : DEFAULT_WHATSAPP_NUMBER,
        ...(typeof snapshot.data()?.updatedAt === 'string'
          ? { updatedAt: snapshot.data()?.updatedAt as string }
          : {}),
      };
    } catch (error) {
      console.error('Unable to load site settings', error);
      return { whatsappNumber: DEFAULT_WHATSAPP_NUMBER };
    }
  }

  async saveSiteSettings(whatsappNumber: string): Promise<SiteSettings> {
    const { db } = requireFirebase();
    const normalized = normalizeWhatsAppNumber(whatsappNumber);
    if (normalized.length < 10 || normalized.length > 15) {
      throw new Error('رقم واتساب يجب أن يتكون من 10 إلى 15 رقماً.');
    }
    const settings: SiteSettings = {
      whatsappNumber: normalized,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'settings', 'public'), settings, { merge: true });
    await this.writeAuditLog('update_whatsapp_number', 'settings', 'public');
    return settings;
  }
}

export const adminService = new AdminService();
