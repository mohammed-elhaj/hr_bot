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
   * Upload a new document
   */
  async uploadDocument(file: File): Promise<DocumentUploadResponse> {
    try {
      // Validate file before upload
      this.validateFile(file);

      const formData = new FormData();
      formData.append('file', file);

      const response = await apiService.post<DocumentUploadResponse>(
        API_ENDPOINTS.UPLOAD_DOCUMENT,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
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
    const fileType = file.name.split('.').pop()?.toLowerCase() as AllowedFileType;
    
    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
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
    const message = error.message || 'حدث خطأ في معالجة الملف';
    return new Error(message);
  }
}

export const documentService = new DocumentService();
export default documentService;