// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types/api';
import { authService } from '../services/auth';
import { storage } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    const storedUser = storage.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ username, password });
      const userData = response.user;

      setUser(userData);
      storage.setUser(userData);
    } catch (error: any) {
      setError(error.message || 'فشل تسجيل الدخول');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    storage.clear();
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};