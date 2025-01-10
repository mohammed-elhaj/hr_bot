// src/components/vacation/VacationBalance.tsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  RefreshCcw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock3,
} from "lucide-react";
import { useVacation } from "../../hooks/useVacation";
import { useAuth } from "../../hooks/useAuth";
import { VacationRequest } from "../../types/vacation";
import { formatDate } from "../../utils/data";
import ContentSkeleton from "../common/ContentSkeleton";

export const VacationBalance: React.FC = () => {
  const { user } = useAuth();
  const { state, fetchBalance, fetchRequests } = useVacation();

  useEffect(() => {
    if (user?.id) {
      fetchBalance();
      fetchRequests();
    }
  }, [user, fetchBalance, fetchRequests]);

  const renderStatusBadge = (status: VacationRequest["status"]) => {
    const statusConfig = {
      pending: {
        icon: Clock3,
        class: "bg-yellow-100 text-yellow-800",
        text: "قيد المراجعة",
      },
      approved: {
        icon: CheckCircle,
        class: "bg-green-100 text-green-800",
        text: "تمت الموافقة",
      },
      rejected: {
        icon: XCircle,
        class: "bg-red-100 text-red-800",
        text: "مرفوض",
      },
      cancelled: {
        icon: XCircle,
        class: "bg-gray-100 text-gray-800",
        text: "ملغي",
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${config.class}`}
      >
        <Icon className="w-4 h-4" />
        {config.text}
      </span>
    );
  };

  if (state.isLoading) {
    return <ContentSkeleton type="card" />;
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">رصيد الإجازات</h2>
            <button
              onClick={() => fetchBalance()}
              className="text-gray-500 hover:text-gray-700"
              title="تحديث"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>

          {state.balance ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="text-primary-600 text-sm font-medium">
                  الرصيد السنوي
                </div>
                <div className="mt-2 text-3xl font-bold text-primary-700">
                  {state.balance.annual_balance} يوم
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-purple-600 text-sm font-medium">
                  الإجازات المستخدمة
                </div>
                <div className="mt-2 text-3xl font-bold text-purple-700">
                  {state.balance.used_days} يوم
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-green-600 text-sm font-medium">
                  الرصيد المتبقي
                </div>
                <div className="mt-2 text-3xl font-bold text-green-700">
                  {state.balance.remaining_balance} يوم
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-gray-500">
              لا يوجد معلومات متوفرة عن الرصيد
            </div>
          )}

          {state.balance && (
            <div className="mt-4 text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              آخر تحديث: {formatDate(state.balance.last_updated)}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {state.balance && (
          <div className="px-6 pb-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    (state.balance.used_days / state.balance.annual_balance) *
                    100
                  }%`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-primary-500"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Recent Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          طلبات الإجازة السابقة
        </h2>

        {/* Use isLoading state to show skeleton or requests */}
        {state.isLoading ? (
          <ContentSkeleton type="list" count={3} /> // Adjust count as needed
        ) : state.requests && state.requests.length > 0 ? (
          <div className="space-y-4">
            {state.requests.map((request) => (
              // Add a check for request and request.id
              request && request.id && (
                <motion.div
                  key={request.id} // Use the id as the key
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900 mb-1">
                        {request?.start_date
                          ? formatDate(request.start_date)
                          : ""}{" "}
                        -{" "}
                        {request?.end_date ? formatDate(request.end_date) : ""}
                      </div>
                      <div className="text-sm text-gray-500">
                        نوع الإجازة:{" "}
                        {request?.request_type
                          ? request.request_type === "annual"
                            ? "سنوية"
                            : request.request_type === "sick"
                            ? "مرضية"
                            : "طارئة"
                          : ""}
                      </div>
                    </div>
                    {request?.status && renderStatusBadge(request.status)}
                  </div>
                  {request?.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      {request.notes}
                    </div>
                  )}
                </motion.div>
              )
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            لا توجد طلبات إجازة سابقة
          </div>
        )}
      </motion.div>

      {/* Error Display */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{state.error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VacationBalance;