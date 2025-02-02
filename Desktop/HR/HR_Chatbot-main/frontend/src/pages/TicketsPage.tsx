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
  Menu,
  X
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
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

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

  const FilterMenu = () => (
    <div className="lg:hidden">
      <button
        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 w-full"
      >
        <Filter className="w-5 h-5" />
        <span>تصفية النتائج</span>
        {isFilterMenuOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {isFilterMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="all">جميع الحالات</option>
                <option value="open">مفتوح</option>
                <option value="pending">قيد المراجعة</option>
                <option value="approved">تمت الموافقة</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="all">جميع الأنواع</option>
                <option value="vacation">طلبات الإجازات</option>
                <option value="support">تذاكر الدعم</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header Section */}
        <div className="text-right mb-6 lg:mb-8">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">إدارة التذاكر والطلبات</h1>
          <p className="text-sm lg:text-base text-gray-600">عرض وإدارة جميع طلبات وتذاكر الموظفين</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          {[
            {
              icon: FileText,
              label: 'إجمالي التذاكر',
              value: stats.total,
              color: 'blue'
            },
            {
              icon: Clock,
              label: 'قيد المعالجة',
              value: stats.open + stats.pending,
              color: 'yellow'
            },
            {
              icon: Calendar,
              label: 'طلبات الإجازات',
              value: stats.vacation,
              color: 'green'
            },
            {
              icon: MessageCircle,
              label: 'تذاكر الدعم',
              value: stats.support,
              color: 'purple'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-3 lg:p-4 border border-gray-200"
            >
              <div className="flex items-center gap-2 lg:gap-3">
                <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                  <stat.icon className={`w-4 h-4 lg:w-6 lg:h-6 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-500">{stat.label}</p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="relative mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="بحث في التذاكر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="open">مفتوح</option>
                <option value="pending">قيد المراجعة</option>
                <option value="approved">تمت الموافقة</option>
                <option value="rejected">مرفوض</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">جميع الأنواع</option>
                <option value="vacation">طلبات الإجازات</option>
                <option value="support">تذاكر الدعم</option>
              </select>
            </div>

            {/* Mobile Filter Menu */}
            <FilterMenu />
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
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleTicketExpansion(ticket.ticket_id)}
              >
                <div className="flex items-start gap-3">
                  {ticket.ticket_id?.startsWith('VT-') ? (
                    <Calendar className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <MessageCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                      <div>
                        <div className="font-medium text-gray-900">{ticket.ticket_id}</div>
                        <div className="text-sm text-gray-500 truncate">
                          {ticket.summary || 'بدون عنوان'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={ticket.status} />
                        <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${
                          expandedTickets.includes(ticket.ticket_id) ? 'rotate-180' : ''
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedTickets.includes(ticket.ticket_id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-4 bg-gray-50 space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">معلومات الطلب</h3>
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
                          </div>
                        </div>

                        {ticket.description && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">تفاصيل ال
                            طلب</h3>
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-sm text-gray-600">{ticket.description}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {ticket.start_date && ticket.end_date && (
                        <div className="bg-white rounded-lg p-3">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">فترة الإجازة</h3>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {formatDate(ticket.start_date)} - {formatDate(ticket.end_date)}
                            </span>
                          </div>
                        </div>
                      )}

                      {ticket.notes && (
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <h3 className="text-sm font-medium text-yellow-800 mb-1">ملاحظات</h3>
                          <p className="text-sm text-yellow-600">{ticket.notes}</p>
                        </div>
                      )}

                      {/* Mobile Actions */}
                      <div className="lg:hidden flex justify-end gap-2">
                        <button className="px-3 py-1.5 text-sm bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100">
                          عرض التفاصيل
                        </button>
                        {ticket.status === 'pending' && (
                          <>
                            <button className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                              موافقة
                            </button>
                            <button className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                              رفض
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Empty State */}
          {filteredTickets.length === 0 && !state.isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 lg:py-12 bg-white rounded-lg border border-gray-200"
            >
              <div className="inline-flex items-center justify-center w-12 lg:w-16 h-12 lg:h-16 bg-gray-100 rounded-full mb-4">
                <AlertCircle className="w-6 lg:w-8 h-6 lg:h-8 text-gray-400" />
              </div>
              <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
              <p className="text-sm lg:text-base text-gray-500 mb-4">
                لم يتم العثور على تذاكر تطابق معايير البحث الخاصة بك
              </p>
              {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                    setIsFilterMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 text-sm"
                >
                  <X className="w-4 h-4" />
                  إزالة عوامل التصفية
                </button>
              )}
            </motion.div>
          )}
        </div>

        {/* Mobile Bottom Stats Bar */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t shadow-lg px-4 py-2 z-20"
        >
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-xs text-gray-500">الكل</div>
              <div className="font-bold text-gray-900">{stats.total}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">قيد المعالجة</div>
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
        </motion.div>

        {/* Add padding at the bottom on mobile to account for fixed stats bar */}
        <div className="h-16 lg:hidden" />
      </div>
    </Layout>
  );
};

export default TicketsPage;