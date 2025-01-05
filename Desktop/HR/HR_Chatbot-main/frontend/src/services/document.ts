// src/services/documents.ts
import apiService, { ApiResponse } from './api';

export interface Document {
  name: string;
  size: number;
  uploaded: string;
}

export interface DocumentsResponse {
  documents: Document[];
}

export interface UploadResponse {
  message: string;
  filename: string;
}

export class DocumentService {
  async listDocuments(): Promise<ApiResponse<DocumentsResponse>> {
    return apiService.get<DocumentsResponse>('/api/admin/documents');
  }

  async uploadDocument(file: File): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    const instance = apiService.getInstance();
    const response = await instance.post('/api/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return { data: response.data };
  }

  async updateActiveDocuments(documents: string[]): Promise<ApiResponse<any>> {
    return apiService.post('/api/admin/documents', { documents });
  }
}

export const documentService = new DocumentService();