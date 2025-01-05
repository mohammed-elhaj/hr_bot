// src/components/vacation/VacationRequest.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { useVacation } from '../../hooks/useVacation';
import { useAuth } from '../../hooks/useAuth';
import { validateVacationRequest } from '../../utils/validation';

interface VacationRequestProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const VacationRequest: React.FC<VacationRequestProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { submitRequest, balance, fetchBalance } = useVacation();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch balance when component mounts
  React.useEffect(() => {
    if (user) {
      fetchBalance(user.id);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !balance) return;

    const validationErrors = validateVacationRequest(
      formData.startDate,
      formData.endDate,
      balance.remaining_balance
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await submitRequest({
        employee_id: user.id,
        start_date: formData.startDate,
        end_date: formData.endDate,
        request_type: 'vacation',
        notes: formData.notes,
      });
      
      onSuccess?.();
    } catch (error) {
      setErrors({ submit: 'فشل في تقديم الطلب. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h3 className="text-xl font-semibold mb-4">طلب إجازة جديد</h3>
      
      {balance && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">الرصيد المتبقي:</span>
            <span className="font-semibold text-lg">{balance.remaining_balance} يوم</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            تاريخ