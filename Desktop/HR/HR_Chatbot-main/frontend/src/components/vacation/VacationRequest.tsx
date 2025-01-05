// src/components/vacation/VacationRequest.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, AlertCircle, Loader2, Check } from 'lucide-react';
import { useVacation } from '../../hooks/useVacation';
import { useAuth } from '../../hooks/useAuth';
import { 
  VacationRequestType,
  VacationRequestFormData,
  CreateVacationRequestPayload 
} from '../../types/vacation';
import { calculateDaysBetween } from '../../utils/data';

const VACATION_TYPES: { value: VacationRequestType; label: string }[] = [
  { value: 'annual', label: 'إجازة سنوية' },
  { value: 'sick', label: 'إجازة مرضية' },
  { value: 'emergency', label: 'إجازة طارئة' }
];

const initialFormData: VacationRequestFormData = {
  startDate: '',
  endDate: '',
  requestType: 'annual',
  notes: ''
};

export const VacationRequest: React.FC = () => {
  const { user } = useAuth();
  const { state, submitRequest, fetchBalance } = useVacation();
  const [formData, setFormData] = useState<VacationRequestFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof VacationRequestFormData, string>>>({});

  useEffect(() => {
    if (user?.id) {
      fetchBalance();
    }
  }, [user, fetchBalance]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof VacationRequestFormData, string>> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    // Validate start date
    if (!formData.startDate) {
      errors.startDate = 'تاريخ البداية مطلوب';
    } else if (startDate < today) {
      errors.startDate = 'لا يمكن اختيار تاريخ في الماضي';
    }

    // Validate end date
    if (!formData.endDate) {
      errors.endDate = 'تاريخ النهاية مطلوب';
    } else if (endDate < startDate) {
      errors.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
    }

    // Validate request type
    if (!formData.requestType) {
      errors.requestType = 'نوع الإجازة مطلوب';
    }

    // Check against balance if it's an annual leave
    if (formData.requestType === 'annual' && 
        state.balance && 
        formData.startDate && 
        formData.endDate) {
      const daysRequested = calculateDaysBetween(formData.startDate, formData.endDate);
      if (daysRequested > state.balance.remaining_balance) {
        errors.endDate = 'عدد أيام الإجازة يتجاوز الرصيد المتبقي';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id || !validateForm()) return;

    setIsSubmitting(true);
    try {
      const request: CreateVacationRequestPayload = {
        employee_id: user.id,
        start_date: formData.startDate,
        end_date: formData.endDate,
        request_type: formData.requestType,
        notes: formData.notes
      };

      await submitRequest(request);
      setFormData(initialFormData);
      
      // Show success message (could be enhanced with a toast notification)
    } catch (error) {
      // Error is handled by the context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
    if (formErrors[name as keyof VacationRequestFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto"
    >
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">تقديم طلب إجازة</h2>
        {state.balance && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 rounded-lg p-4 mt-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-600">الرصيد المتبقي:</span>
              <span className="font-semibold text-xl text-primary-600">
                {state.balance.remaining_balance} يوم
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vacation Type */}
        <div>
          <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 mb-1">
            نوع الإجازة
          </label>
          <select
            id="requestType"
            name="requestType"
            value={formData.requestType}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              formErrors.requestType ? 'border-red-500' : 'border-gray-300'
            } p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
          >
            {VACATION_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {formErrors.requestType && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {formErrors.requestType}
            </p>
          )}
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              تاريخ البداية
            </label>
            <div className="relative">
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  formErrors.startDate ? 'border-red-500' : 'border-gray-300'
                } p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            {formErrors.startDate && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.startDate}
              </p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              تاريخ النهاية
            </label>
            <div className="relative">
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  formErrors.endDate ? 'border-red-500' : 'border-gray-300'
                } p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            {formErrors.endDate && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.endDate}
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            ملاحظات
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="أضف أي ملاحظات إضافية هنا..."
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isSubmitting || state.isLoading}
          className="w-full py-3 px-4 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري التقديم...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              تقديم الطلب
            </>
          )}
        </motion.button>

        {/* Error Display */}
        <AnimatePresence>
          {state.error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{state.error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default VacationRequest;