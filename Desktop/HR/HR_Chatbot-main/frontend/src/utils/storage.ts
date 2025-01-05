// src/utils/storage.ts
export const storage = {
  getUser: (): any | null => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    
    try {
      const parsed = JSON.parse(user);
      if (parsed.messages) {
        parsed.messages = parsed.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
      return parsed;
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
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