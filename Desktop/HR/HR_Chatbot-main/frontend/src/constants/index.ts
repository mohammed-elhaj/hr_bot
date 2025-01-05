// src/constants/index.ts
export const API_ENDPOINTS = {
    LOGIN: '/api/auth/login',
    CHAT: '/api/chat',
    VACATION_BALANCE: '/api/employee/vacation-balance',
    VACATION_REQUEST: '/api/employee/vacation-request',
    DOCUMENTS: '/api/admin/documents',
    UPLOAD_DOCUMENT: '/api/admin/upload'
  };
  
  export const VACATION_TYPES = {
    ANNUAL: 'annual',
    SICK: 'sick',
    EMERGENCY: 'emergency'
  } as const;
  
  export const MESSAGE_STATUS = {
    SENDING: 'sending',
    SENT: 'sent',
    ERROR: 'error'
  } as const;
  
  export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'حدث خطأ في الاتصال بالخادم',
    UNAUTHORIZED: 'جلسة العمل منتهية. يرجى تسجيل الدخول مرة أخرى',
    INVALID_CREDENTIALS: 'اسم المستخدم أو كلمة المرور غير صحيحة',
    GENERAL_ERROR: 'حدث خطأ غير متوقع'
  };
  
  export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    CHAT: '/chat',
    PROFILE: '/profile',
    ADMIN: '/admin'
  } as const;