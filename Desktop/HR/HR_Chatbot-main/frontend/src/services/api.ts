// src/services/api.ts
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// Types
export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

export interface ApiResponse<T = any> {
  data: T;
  error?: ApiError;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: 'حدث خطأ في الاتصال',
          status: error.response?.status,
        };

        if (error.response) {
          // Server responded with error
          const data = error.response.data as any;
          apiError.message = data.error || data.message || 'حدث خطأ في الخادم';
          apiError.details = data;
        } else if (error.request) {
          // Request made but no response
          apiError.message = 'لا يمكن الوصول إلى الخادم';
        }

        return Promise.reject(apiError);
      }
    );
  }

  // Generic GET request
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get<T>(url, { params });
      return { data: response.data };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic POST request
  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<T>(url, data);
      return { data: response.data };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic PUT request
  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put<T>(url, data);
      return { data: response.data };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic DELETE request
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete<T>(url);
      return { data: response.data };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  private handleError(error: any): ApiError {
    if (error.status === 401) {
      // Handle unauthorized access
      // You might want to redirect to login or refresh token
      console.log('Unauthorized access');
    }
    return error;
  }

  // Get the underlying axios instance
  getInstance(): AxiosInstance {
    return this.api;
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export default apiService;