// src/services/documents.ts
import apiService from './api';
import { 
  DocumentMetadata,
  DocumentListResponse,
  DocumentUploadResponse,
  AllowedFileType 
} from '../types/documents';
import { API_ENDPOINTS } from '../constants';

const ALLOWED_FILE_TYPES: AllowedFileType[] = ['pdf', 'docx', 'doc', 'txt'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

class DocumentService {
  /**
   * Get list of documents
   */
  async getDocuments(): Promise<DocumentListResponse> {
    try {
      const response = await apiService.get<DocumentListResponse>(
        API_ENDPOINTS.DOCUMENTS
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload a document
   */
  async uploadDocument(file: File): Promise<DocumentUploadResponse> {
    try {
      // Validate file before upload
      this.validateFile(file);

      const formData = new FormData();
      formData.append('file', file);

      // Use the raw axios instance to handle FormData
      const instance = apiService.getInstance();
      const response = await instance.post<DocumentUploadResponse>(
        API_ENDPOINTS.DOCUMENTS,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Download a document
   */
  async downloadDocument(documentId: string): Promise<Blob> {
    try {
      const response = await apiService.getInstance().get(
        `${API_ENDPOINTS.DOCUMENTS}/${documentId}/download`,
        {
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string): Promise<void> {
    try {
      await apiService.delete(`${API_ENDPOINTS.DOCUMENTS}/${documentId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File) {
    if (!file) {
      throw new Error('لم يتم اختيار ملف');
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !ALLOWED_FILE_TYPES.includes(fileExtension as AllowedFileType)) {
      throw new Error('نوع الملف غير مدعوم. الأنواع المدعومة هي: PDF، DOCX، DOC، TXT');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('حجم الملف يتجاوز الحد المسموح به (10 ميجابايت)');
    }
  }

  /**
   * Handle service errors
   */
  private handleError(error: any): Error {
    console.error('Document service error:', error);

    if (error.response) {
      // Handle server errors
      const data = error.response.data;
      const message = data.message || data.error || 'حدث خطأ في معالجة الملف';
      return new Error(message);
    }

    if (error.request) {
      // Handle network errors
      return new Error('فشل الاتصال بالخادم');
    }

    if (error instanceof Error) {
      // Handle validation and other errors
      return error;
    }

    // Handle unknown errors
    return new Error('حدث خطأ غير متوقع');
  }

  /**
   * Get download URL for a document
   */
  getDownloadUrl(documentId: string): string {
    return `${apiService.getInstance().defaults.baseURL}${API_ENDPOINTS.DOCUMENTS}/${documentId}/download`;
  }

  /**
   * Get preview URL for a document (PDF only)
   */
  getPreviewUrl(documentId: string): string {
    return `${apiService.getInstance().defaults.baseURL}${API_ENDPOINTS.DOCUMENTS}/${documentId}/preview`;
  }
}

export const documentService = new DocumentService();
export default documentService;