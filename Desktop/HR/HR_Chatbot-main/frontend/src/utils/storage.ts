// src/utils/storage.ts
export const storage = {
    // Token management
    getToken: (): string | null => {
      return localStorage.getItem('token');
    },
  
    setToken: (token: string): void => {
      localStorage.setItem('token', token);
    },
  
    removeToken: (): void => {
      localStorage.removeItem('token');
    },
  
    // User data management
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
  
    // Session management
    clear: (): void => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };
  
  export default storage;