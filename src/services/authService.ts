import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'manager';
  createdAt: Date;
}

class AuthService {
  private currentUser: User | null = null;
  private isAdmin = false;
  private adminRole: 'admin' | 'manager' | null = null;

  constructor() {
    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      if (user) {
        await this.checkAdminStatus(user.uid);
      } else {
        this.isAdmin = false;
        this.adminRole = null;
      }
    });
  }

  private async checkAdminStatus(userId: string): Promise<void> {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', userId));
      if (adminDoc.exists()) {
        const adminData = adminDoc.data();
        if (adminData.role === 'admin' || adminData.role === 'manager') {
          this.isAdmin = true;
          this.adminRole = adminData.role;
        } else {
          this.isAdmin = false;
          this.adminRole = null;
        }
      } else {
        this.isAdmin = false;
        this.adminRole = null;
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      this.isAdmin = false;
      this.adminRole = null;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAdminUser(): boolean {
    return this.isAdmin;
  }

  getAdminRole(): 'admin' | 'manager' | null {
    return this.adminRole;
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await this.checkAdminStatus(userCredential.user.uid);
      return { success: true };
    } catch (error: any) {
      let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'لم يتم العثور على مستخدم بهذا البريد الإلكتروني';
          break;
        case 'auth/wrong-password':
          errorMessage = 'كلمة المرور غير صحيحة';
          break;
        case 'auth/invalid-email':
          errorMessage = 'البريد الإلكتروني غير صحيح';
          break;
      }
      return { success: false, error: errorMessage };
    }
  }

  async logout(): Promise<void> {
    await signOut(auth);
    this.isAdmin = false;
    this.adminRole = null;
  }

  async validateAdminAccess(): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) return false;
    await this.checkAdminStatus(user.uid);
    return this.isAdmin;
  }
}

export const authService = new AuthService();
export default authService;
