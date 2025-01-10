// src/components/common/ErrorDisplay.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ErrorDisplayProps {
  error: Error | null;
  onReset?: () => void;
  fullPage?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onReset, fullPage = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReset = () => {
    onReset?.();
  };

  const getErrorMessage = (error: Error | null): string => {
    if (!error) return 'حدث خطأ غير متوقع';

    if (error.message.includes('Network Error')) {
      return 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت الخاص بك.';
    }

    if (error.message.includes('401')) {
      return 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.';
    }

    return error.message || 'حدث خطأ غير متوقع';
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-lg p-6 ${fullPage ? 'max-w-lg mx-auto' : ''}`}
    >
      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
        <AlertCircle className="w-6 h-6 text-red-600" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-center text-gray-900">
        عذراً! حدث خطأ
      </h3>

      <p className="text-center text-gray-600 mb-6">
        {getErrorMessage(error)}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReset}
          className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          إعادة المحاولة
        </motion.button>

        {/* Only show "Home" button if within Router context */}
        {location && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors gap-2"
          >
            <Home className="w-4 h-4" />
            العودة للرئيسية
          </motion.button>
        )}
      </div>
    </motion.div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        {content}
      </div>
    );
  }

  return content;
};

export default ErrorDisplay;