// src/types/documents.ts

/**
 * Document statuses
 */
export type DocumentStatus = 'processing' | 'active' | 'error';

/**
 * Allowed file types
 */
export type AllowedFileType = 'pdf' | 'docx' | 'doc' | 'txt';

/**
 * Document metadata
 */
export interface DocumentMetadata {
  id: string;
  title: string;
  fileType: AllowedFileType;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  status: DocumentStatus;
  lastModified?: string;
}

/**
 * Document list response
 */
export interface DocumentListResponse {
  documents: DocumentMetadata[];
  totalCount: number;
}

/**
 * Document upload response
 */
export interface DocumentUploadResponse {
  document: DocumentMetadata;
  message: string;
}

/**
 * Document service errors
 */
export interface DocumentError {
  code: string;
  message: string;
  details?: any;
}