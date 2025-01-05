// src/utils/validation.ts
export interface ValidationError {
  [key: string]: string;
}

export const validateVacationRequest = (
  startDate: string,
  endDate: string,
  balance: number
): ValidationError => {
  const errors: ValidationError = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start < today) {
    errors.startDate = 'لا يمكن اختيار تاريخ في الماضي';
  }

  if (end < start) {
    errors.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
  }

  const days = calculateDaysBetween(startDate, endDate);
  if (days > balance) {
    errors.general = 'عدد الأيام المطلوبة يتجاوز الرصيد المتاح';
  }

  return errors;
};

export const validateLoginCredentials = (
  username: string,
  password: string
): ValidationError => {
  const errors: ValidationError = {};

  if (!username.trim()) {
    errors.username = 'اسم المستخدم مطلوب';
  }

  if (!password) {
    errors.password = 'كلمة المرور مطلوبة';
  } else if (password.length < 6) {
    errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
  }

  return errors;
};