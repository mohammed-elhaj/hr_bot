// src/services/documents.ts
import apiService from './api';
import { 
  DocumentMetadata,
  DocumentListResponse,
  DocumentUploadResponse,
  AllowedFileType 
} from '../types/documents';
import { API_ENDPOINTS } from '../constants';

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
      throw new Error( error instanceof Error ? error.message : 'حدث خطأ في جلب المستندات');
    }
  }

  /**
   * Upload a document
   */
  async uploadDocument(file: File): Promise<DocumentUploadResponse> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileType', file.name.split('.').pop()?.toLowerCase() || '');

        // Use the raw axios instance to handle FormData
        const instance = apiService.getInstance();
        const response = await instance.post<DocumentUploadResponse>(
          API_ENDPOINTS.UPLOAD_DOCUMENT,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        return response.data;

    } catch (error: any) {
        if (error.response && error.response.status === 400) {
            // Assuming backend sends error message in JSON format like { error: '...', message: '...' }
            const errorMessage = error.response.data.message || error.response.data.error || 'حدث خطأ أثناء رفع الملف';
            throw new Error(errorMessage);
          } else {
            throw new Error( error instanceof Error ? error.message : 'حدث خطأ في رفع المستند');
          }
    }
}

  /**
   * Download a document
   */
  async downloadDocument(documentId: string): Promise<Blob> {
      const response = await apiService.getInstance().get(
        `${API_ENDPOINTS.DOCUMENTS}/${documentId}/download`,
        {
          responseType: 'blob'
        }
      );
      return response.data;
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string): Promise<void> {
      await apiService.delete(`${API_ENDPOINTS.DOCUMENTS}/${documentId}`);
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