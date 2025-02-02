import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  User,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import Layout from '../components/common/Layout';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = '/';

const VACATION_TYPES = [
  { value: 'annual', label: 'إجازة سنوية' },
  { value: 'sick', label: 'إجازة مرضية' },
  { value: 'emergency', label: 'إجازة طارئة' }
];

const VacationPage = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    request_type: 'annual',
    start_date: '',
    end_date: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch balance data
  const fetchBalance = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(`${API_BASE_URL}/api/employee/vacation-balance/${user?.id}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch balance');
      
      if (data.status === 'success') {
        setBalance({
          annual_balance: data.annual_balance || 0,
          used_days: data.used_days || 0,
          remaining_balance: data.remaining_balance || 0,
          name: data.name,
          employee_id: data.employee_id,
          last_updated: data.last_updated
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch balance');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchBalance();
    }
  }, [user?.id]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    const today = new Date();
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (!formData.start_date) {
      errors.start_date = 'تاريخ البداية مطلوب';
    } else if (startDate < today) {
      errors.start_date = 'لا يمكن اختيار تاريخ في الماضي';
    }

    if (!formData.end_date) {
      errors.end_date = 'تاريخ النهاية مطلوب';
    } else if (endDate < startDate) {
      errors.end_date = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
    }

    if (formData.notes && formData.notes.length > 500) {
      errors.notes = 'الملاحظات يجب أن لا تتجاوز 500 حرف';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const requestPayload = {
        type: user?.id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        request_type: formData.request_type,
        notes: formData.notes
      };

      const response = await fetch(`${API_BASE_URL}/api/employee/vacation-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to submit request');

      if (data.status === 'success') {
        setSuccessMessage('تم تقديم طلب الإجازة بنجاح');
        setFormData({
          request_type: 'annual',
          start_date: '',
          end_date: '',
          notes: ''
        });
        fetchBalance();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">إدارة الإجازات</h1>
            <p className="mt-2 text-sm text-gray-600">عرض رصيد الإجازات وتقديم الطلبات</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Balance Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">رصيد الإجازات</h2>
                  <button
                    onClick={fetchBalance}
                    disabled={isRefreshing}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                  </div>
                ) : balance ? (
                  <div className="space-y-6">
                    {/* Balance Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-primary-50 rounded-lg p-4">
                        <div className="text-primary-600 text-sm font-medium">الرصيد السنوي</div>
                        <div className="mt-2 text-2xl sm:text-3xl font-bold text-primary-700">
                          {balance.annual_balance}
                          <span className="text-sm text-primary-600 mr-1">يوم</span>
                        </div>
                      </div>

                      <div className="bg-amber-50 rounded-lg p-4">
                        <div className="text-amber-600 text-sm font-medium">المستخدم</div>
                        <div className="mt-2 text-2xl sm:text-3xl font-bold text-amber-700">
                          {balance.used_days}
                          <span className="text-sm text-amber-600 mr-1">يوم</span>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-green-600 text-sm font-medium">المتبقي</div>
                        <div className="mt-2 text-2xl sm:text-3xl font-bold text-green-700">
                          {balance.remaining_balance}
                          <span className="text-sm text-green-600 mr-1">يوم</span>
                        </div>
                      </div>
                    </div>

                    {/* Employee Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{balance.name}</div>
                          <div className="text-sm text-gray-500">
                            رقم الموظف: {balance.employee_id}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Last Updated */}
                    {balance.last_updated && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        آخر تحديث: {new Date(balance.last_updated).toLocaleDateString('ar-SA')}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    لا توجد معلومات متوفرة عن الرصيد
                  </div>
                )}
              </div>
            </div>

            {/* Request Form */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">طلب إجازة جديد</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Vacation Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع الإجازة
                    </label>
                    <select
                      value={formData.request_type}
                      onChange={(e) => setFormData({ ...formData, request_type: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                    >
                      {VACATION_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ البداية
                      </label>
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => {
                          setFormData({ ...formData, start_date: e.target.value });
                          setFormErrors({ ...formErrors, start_date: null });
                        }}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          formErrors.start_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {formErrors.start_date && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.start_date}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ النهاية
                      </label>
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => {
                          setFormData({ ...formData, end_date: e.target.value });
                          setFormErrors({ ...formErrors, end_date: null });
                        }}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          formErrors.end_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min={formData.start_date || new Date().toISOString().split('T')[0]}
                      />
                      {formErrors.end_date && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.end_date}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ملاحظات
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => {
                        setFormData({ ...formData, notes: e.target.value });
                        setFormErrors({ ...formErrors, notes: null });
                      }}
                      rows={3}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none ${
                        formErrors.notes ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="أضف أي ملاحظات إضافية هنا..."
                    />
                    {formErrors.notes && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.notes}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium
                    className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium
                             hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                             focus:ring-primary-500 transition-colors disabled:opacity-50 
                             disabled:cursor-not-allowed flex items-center justify-center gap-2
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري التقديم...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5" />
                        تقديم الطلب
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Success Message */}
                <AnimatePresence>
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-green-50 text-green-600 rounded-lg flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1">{successMessage}</span>
                      <button
                        onClick={() => setSuccessMessage(null)}
                        className="p-1 hover:bg-green-100 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1">{error}</span>
                      <button
                        onClick={() => setError(null)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Info Card */}
              <div className="border-t border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4 text-primary-500" />
                  <span>
                    تأكد من مراجعة تواريخ الإجازة والرصيد المتاح قبل تقديم الطلب
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View Help Text */}
          <div className="mt-6 lg:hidden">
            <div className="bg-white rounded-lg shadow-sm p-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 text-primary-500" />
                <span>اسحب الشاشة للأعلى لعرض المزيد من المعلومات</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VacationPage;