// src/utils/errors.ts
import { ApiError } from '../types/api';

export const getErrorMessage = (error: ApiError | unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if ((error as ApiError)?.message) {
    return (error as ApiError).message;
  }

  return 'حدث خطأ غير متوقع';
};

export const isApiError = (error: any): error is ApiError => {
  return error && typeof error === 'object' && 'message' in error;
};

// src/utils/storage.ts
export const storage = {
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  removeToken: (): void => {
    localStorage.removeItem('token');
  },

  getUser: (): any | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: any): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem('user');
  },

  clear: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};