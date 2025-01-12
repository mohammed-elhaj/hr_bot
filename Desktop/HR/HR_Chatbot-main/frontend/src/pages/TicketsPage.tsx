import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  AlertCircle,
  MessageCircle,
  User,
  FileText,
  BarChart3
} from 'lucide-react';
import Layout from '../components/common/Layout';
import { useTickets } from '../hooks/useTickets';
import ContentSkeleton from '../components/common/ContentSkeleton';
import { formatDate } from '../utils/data';

const TicketsPage = () => {
  const { state, fetchTickets } = useTickets();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expandedTickets, setExpandedTickets] = useState<string[]>([]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Filter tickets based on search and filters
  const filteredTickets = state.tickets.filter(ticket => {
    const matchesSearch = 
      ticket.ticket_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesType = typeFilter === 'all' || 
                       (ticket.ticket_id?.startsWith('VT-') ? 'vacation' : 'support') === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate stats
  const stats = {
    total: state.tickets.length,
    vacation: state.tickets.filter(t => t.ticket_id?.startsWith('VT-')).length,
    support: state.tickets.filter(t => t.ticket_id?.startsWith('ST-')).length,
    open: state.tickets.filter(t => t.status === 'open').length,
    pending: state.tickets.filter(t => t.status === 'pending').length,
    approved: state.tickets.filter(t => t.status === 'approved').length,
    rejected: state.tickets.filter(t => t.status === 'rejected').length
  };

  const toggleTicketExpansion = (ticketId: string) => {
    setExpandedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = {
      open: {
        icon: Clock,
        class: 'bg-blue-100 text-blue-800',
        text: 'مفتوح'
      },
      pending: {
        icon: Clock,
        class: 'bg-yellow-100 text-yellow-800',
        text: 'قيد المراجعة'
      },
      approved: {
        icon: CheckCircle,
        class: 'bg-green-100 text-green-800',
        text: 'تمت الموافقة'
      },
      rejected: {
        icon: XCircle,
        class: 'bg-red-100 text-red-800',
        text: 'مرفوض'
      }
    }[status] || {
      icon: Clock,
      class: 'bg-gray-100 text-gray-800',
      text: status
    };

    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        <Icon className="w-4 h-4" />
        {config.text}
      </span>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {/* Header Section */}
        <div className="text-right mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">إدارة التذاكر والطلبات</h1>
          <p className="text-gray-600">عرض وإدارة جميع طلبات وتذاكر الموظفين</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Tickets */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">إجمالي التذاكر</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
            </div>
          </div>

          {/* Open/Pending */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">قيد المعالجة</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.open + stats.pending}
                </p>
              </div>
            </div>
          </div>

          {/* Vacation Requests */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">طلبات الإجازات</p>
                <p className="text-2xl font-bold text-green-600">{stats.vacation}</p>
              </div>
            </div>
          </div>

          {/* Support Tickets */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">تذاكر الدعم</p>
                <p className="text-2xl font-bold text-purple-600">{stats.support}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="بحث في التذاكر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                dir="rtl"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 appearance-none"
                dir="rtl"
              >
                <option value="all">جميع الحالات</option>
                <option value="open">مفتوح</option>
                <option value="pending">قيد المراجعة</option>
                <option value="approved">تمت الموافقة</option>
                <option value="rejected">مرفوض</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 appearance-none"
                dir="rtl"
              >
                <option value="all">جميع الأنواع</option>
                <option value="vacation">طلبات الإجازات</option>
                <option value="support">تذاكر الدعم</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {state.isLoading ? (
            <ContentSkeleton type="list" count={5} />
          ) : filteredTickets.map((ticket) => (
            <motion.div
              key={ticket.ticket_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Ticket Header */}
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleTicketExpansion(ticket.ticket_id)}
              >
                <div className="flex items-center gap-4 flex-grow">
                  {ticket.ticket_id?.startsWith('VT-') ? (
                    <Calendar className="w-5 h-5 text-green-500" />
                  ) : (
                    <MessageCircle className="w-5 h-5 text-purple-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{ticket.ticket_id}</div>
                        <div className="text-sm text-gray-500">{ticket.summary || 'بدون عنوان'}</div>
                      </div>
                      <StatusBadge status={ticket.status} />
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${
                    expandedTickets.includes(ticket.ticket_id) ? 'rotate-180' : ''
                  }`} />
                </div>
              </div>

              {/* Ticket Details */}
              <AnimatePresence>
                {expandedTickets.includes(ticket.ticket_id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Request Info */}
                        <div className="rtl">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">معلومات الطلب</h3>
                          <div className="bg-white rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                معرف الموظف: {ticket.employee_id}
                              </span>
                            </div>
                            {ticket.request_date && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  تاريخ الطلب: {formatDate(ticket.request_date)}
                                </span>
                              </div>
                            )}
                            {ticket.start_date && ticket.end_date && (
                              <div className="text-sm text-gray-600">
                                فترة الإجازة: {formatDate(ticket.start_date)} - {formatDate(ticket.end_date)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        {ticket.description && (
                          <div className="rtl">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">تفاصيل الطلب</h3>
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-sm text-gray-600">{ticket.description}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      {ticket.notes && (
                        <div className="bg-yellow-50 rounded-lg p-3 mt-4 rtl">
                          <h3 className="text-sm font-medium text-yellow-800 mb-1">ملاحظات</h3>
                          <p className="text-sm text-yellow-600">{ticket.notes}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {filteredTickets.length === 0 && !state.isLoading && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-gray-400" />
                </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-500">
                لم يتم العثور على تذاكر تطابق معايير البحث الخاصة بك
              </p>
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  إزالة عوامل التصفية
                </button>
              ) : null}
            </div>
          )}
        </div>

        {/* Mobile Stats Summary (Fixed Bottom) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-2">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-xs text-gray-500">الكل</div>
              <div className="font-bold text-gray-900">{stats.total}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">مفتوح</div>
              <div className="font-bold text-yellow-600">{stats.open + stats.pending}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">إجازات</div>
              <div className="font-bold text-green-600">{stats.vacation}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">دعم</div>
              <div className="font-bold text-purple-600">{stats.support}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add necessary CSS to index.css */}
      <style>{`
        .rtl {
          direction: rtl;
          text-align: right;
        }

        @media (max-width: 768px) {
          .container {
            padding-bottom: 60px; /* Space for fixed stats bar */
          }
        }
      `}</style>
    </Layout>
  );
};

export default TicketsPage;