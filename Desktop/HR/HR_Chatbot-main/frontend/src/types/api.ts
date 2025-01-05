// src/types/api.ts
export interface ApiResponse<T = any> {
    data: T;
    error?: ApiError;
  }
  
  export interface ApiError {
    message: string;
    status?: number;
    details?: any;
  }
  
  // Chat Types
  export interface ChatMessage {
    id: string;
    content: string;
    type: 'user' | 'bot';
    timestamp: Date;
    status: 'sending' | 'sent' | 'error';
  }
  
  export interface ChatResponse {
    response: string;
    timestamp: string;
  }
  
  // Vacation Types
  export interface VacationBalance {
    status: string;
    employee_id: string;
    name: string;
    annual_balance: number;
    used_days: number;
    remaining_balance: number;
    last_updated: string;
  }
  
  export interface VacationRequest {
    employee_id: string;
    start_date: string;
    end_date: string;
    request_type: string;
    notes?: string;
  }
  
  export interface VacationRequestResponse {
    status: string;
    message: string;
    ticket_id: string;
  }
  
  // Document Types
  export interface Document {
    name: string;
    size: number;
    uploaded: string;
  }
  
  export interface UploadResponse {
    message: string;
    filename: string;
  }
  
  // User Types
  export interface User {
    id: string;
    name: string;
    role: string;
    employee_id?: string;
  }
  
  // Auth Types
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }