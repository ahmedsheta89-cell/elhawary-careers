import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { authService } from './authService';

class StorageService {
  async uploadCV(file: File, applicationId: string): Promise<string> {
    const allowedTypes = [
      'application/pdf',
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('نوع الملف غير مسموح. يُسمح فقط بملفات PDF و Word.');
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('حجم الملف كبير جداً. الحد الأقصى هو 10 ميغابايت.');
    }

    const fileExtension = file.type === 'application/pdf' ? 'pdf' :
                         file.type === 'application/msword' ? 'doc' : 'docx';
                         
    const fileName = `cvs/${applicationId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async getFileURL(path: string): Promise<string> {
    if (!await authService.validateAdminAccess()) {
      throw new Error('Access denied');
    }
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  }

  async deleteFile(path: string): Promise<void> {
    if (!await authService.validateAdminAccess()) {
      throw new Error('Access denied');
    }
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }
}

export const storageService = new StorageService();
export default storageService;
