import { storage } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Platform } from 'react-native';

export interface UploadResult {
  success: boolean;
  downloadURL?: string;
  error?: string;
  localURL?: string;
}

export class StorageService {
  static async uploadImage(
    imageUri: string,
    userId: string,
    fileName?: string
  ): Promise<UploadResult> {
    try {
      if (!imageUri || !userId) {
        throw new Error('Image URI and user ID are required');
      }

      const finalFileName = fileName || `image_${Date.now()}.jpg`;
      
      if (this.useFirebaseStorage) {
        const storageRef = ref(storage, `images/${userId}/${finalFileName}`);
        
        const response = await fetch(imageUri);
        const blob = await response.blob();
        
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return {
          success: true,
          downloadURL: downloadURL
        };
      } else {
        return {
          success: true,
          downloadURL: undefined,
          localURL: imageUri
        };
      }
      
    } catch (error: any) {
      console.error('Storage upload error:', error);
      return {
        success: false,
        error: error.message || 'Upload failed',
        localURL: imageUri
      };
    }
  }

  static getStorageRef(path: string) {
    return ref(storage, path);
  }

  static async getDownloadURL(path: string): Promise<string> {
    if (this.useFirebaseStorage) {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } else {
      return path;
    }
  }

  static validateImageUri(uri: string): boolean {
    if (Platform.OS === 'android') {
      return uri.startsWith('file://') || uri.startsWith('content://') || uri.startsWith('https://');
    }
    return uri.length > 0;
  }

  static generateFileName(originalName?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName?.split('.').pop() || 'jpg';
    return `todo_image_${timestamp}_${random}.${extension}`;
  }

  static get useFirebaseStorage(): boolean {
    return true;
  }
}

export default StorageService; 