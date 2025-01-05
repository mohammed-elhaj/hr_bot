// src/components/chat/VacationMessage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { VacationRequestMessage, VacationBalanceMessage, VacationStatusMessage } from '../../types/chat';
import { formatDate } from '../../utils/data';

interface VacationMessageProps {
  message: VacationRequestMessage | VacationBalanceMessage | VacationStatusMessage;
  onAction?: (action: string) => void;
}

export const VacationMessage: React.FC<VacationMessageProps> = ({ message, onAction }) => {
  switch (message.type) {
    case 'vacation_balance':
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-4 max-w-sm"
        >
          <div className="text-lg font-semibold mb-2">رصيد الإجازات</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">الرصيد السنوي:</span>
              <span className="font-medium">{message.metadata.balance.annual_balance} يوم</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">المستخدم:</span>
              <span className="font-medium">{message.metadata.balance.used_days} يوم</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">المتبقي:</span>
              <span className="font-medium text-primary-600">
                {message.metadata.balance.remaining_balance} يوم
              </span>
            </div>
          </div>
          <button
            onClick={() => onAction?.('request_vacation')}
            className="mt-4 w-full py-2 px-4 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
          >
            تقديم طلب إجازة
          </button>
        </motion.div>
      );

    case 'vacation_request':
      const request = message.metadata.request;
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-4 max-w-sm"
        >
          <div className="text-lg font-semibold mb-2">طلب إجازة</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(request.start_date)} - {formatDate(request.end_date)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>نوع الإجازة: {request.request_type}</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onAction?.('confirm_request')}
              className="flex-1 py-2 px-4 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
            >
              تأكيد
            </button>
            <button
              onClick={() => onAction?.('cancel_request')}
              className="flex-1 py-2 px-4 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </motion.div>
      );

    case 'vacation_status':
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-4 ${
            message.metadata.status === 'approved' 
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.metadata.status === 'approved' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{message.content}</span>
          </div>
        </motion.div>
      );

    default:
      return null;
  }
};

export default VacationMessage;