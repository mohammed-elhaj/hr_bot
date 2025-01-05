// src/services/auth.ts
import apiService from './api';
import { User } from '../types/api';

export interface LoginResponse {
  status: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  }

  logout(): void {
    // Clear any stored auth data
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
export default authService;