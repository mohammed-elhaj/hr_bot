import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Download, 
  Search,
  Filter,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  SortAsc,
  Calendar,
  FileType,
  ArrowUpDown,
  Grid,
  List
} from 'lucide-react';
import Layout from '../components/common/Layout';
import DocumentUpload from '../components/documents/DocumentUpload';
import { useDocuments } from '../hooks/useDocuments';
import { formatDate } from '../utils/data';

const DocumentsPage = () => {
  const { state, fetchDocuments, deleteDocument } = useDocuments();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort documents
  const filteredDocuments = state.documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.fileType === filterType;
    return matchesSearch && matchesType;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'date':
        comparison = new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        break;
      case 'name':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'type':
        comparison = a.fileType.localeCompare(b.fileType);
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const fileTypes = Array.from(new Set(state.documents.map(doc => doc.fileType)));

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
    } catch (error) {
      // Error handled by context
    }
  };

  const getFileTypeIcon = (type: string) => {
    return <FileText className="w-5 h-5" />;
  };

  const toggleSort = (field: 'date' | 'name' | 'type') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Responsive Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">إدارة المستندات</h1>
                <p className="mt-1 text-sm text-gray-500">
                  {state.documents.length} مستند متاح
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-lg bg-white p-1 ml-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">رفع مستند جديد</span>
                  <span className="sm:hidden">رفع</span>
                </motion.button>
              </div>
            </div>

            {/* Responsive Search and Filters */}
            <div className="mt-4 md:mt-6 space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="البحث عن مستند..."
                  className="w-full pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="all">جميع الأنواع</option>
                  {fileTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                <button
                  onClick={() => toggleSort('date')}
                  className={`flex-none flex items-center gap-1 px-3 py-2 rounded-lg border whitespace-nowrap ${
                    sortBy === 'date' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">التاريخ</span>
                  {sortBy === 'date' && <ArrowUpDown className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => toggleSort('name')}
                  className={`flex-none flex items-center gap-1 px-3 py-2 rounded-lg border whitespace-nowrap ${
                    sortBy === 'name' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <SortAsc className="w-4 h-4" />
                  <span className="hidden sm:inline">الاسم</span>
                  {sortBy === 'name' && <ArrowUpDown className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => toggleSort('type')}
                  className={`flex-none flex items-center gap-1 px-3 py-2 rounded-lg border whitespace-nowrap ${
                    sortBy === 'type' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <FileType className="w-4 h-4" />
                  <span className="hidden sm:inline">النوع</span>
                  {sortBy === 'type' && <ArrowUpDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Document Grid/List View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sortedDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary-50 rounded-lg">
                        {getFileTypeIcon(doc.fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {doc.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {(doc.size / 1024 / 1024).toFixed(2)} MB · {doc.fileType.toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(doc.uploadedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 md:px-6 py-3 bg-gray-50 flex justify-between items-center">
                    <button
                      onClick={() => window.open(`/api/documents/${doc.id}/download`)}
                      className="text-gray-600 hover:text-primary-600 flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">تحميل</span>
                    </button>
                    <button
                      onClick={() => setSelectedDocument(doc)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">حذف</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {sortedDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-center gap-4 p-4 ${
                    index !== sortedDocuments.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="p-3 bg-primary-50 rounded-lg">
                    {getFileTypeIcon(doc.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{doc.fileType.toUpperCase()}</span>
                      <span>·</span>
                      <span>{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>·</span>
                      <span>{formatDate(doc.uploadedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(`/api/documents/${doc.id}/download`)}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedDocument(doc)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {sortedDocuments.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد مستندات
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'لا توجد نتائج مطابقة للبحث' : 'ابدأ برفع مستنداتك'}
              </p>
              {!searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                  <Upload className="w-5 h-5" />
                  رفع مستند
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Upload Modal */}
          <AnimatePresence>
            {showUploadModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowUploadModal(false);
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-xl shadow-xl w-full max-w-lg"
                >
                  <div className="flex justify-between items-center p-4 md:p-6 border-b">
                    <h2 className="text-lg md:text-xl font-semibold">رفع مستند جديد</h2>
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4 md:p-6">
                    <DocumentUpload />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {selectedDocument && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setSelectedDocument(null);
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 md:p-6"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      تأكيد الحذف
                    </h3>
                    <p className="text-gray-500 mb-6">
                      هل أنت متأكد من حذف المستند "{selectedDocument.title}"؟
                      لا يمكن التراجع عن هذا الإجراء.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedDocument(null)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm md:text-base"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(selectedDocument.id);
                          setSelectedDocument(null);
                        }}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm md:text-base"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <AnimatePresence>
            {state.error && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-600 px-4 py-3 rounded-lg shadow-lg border border-red-100 flex items-center gap-2 max-w-md mx-auto"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{state.error}</span>
                <button
                  onClick={() => state.clearError?.()}
                  className="ml-2 text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Success Message */}
          <AnimatePresence>
            {state.uploadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-50 text-green-600 px-4 py-3 rounded-lg shadow-lg border border-green-100 flex items-center gap-2 max-w-md mx-auto"
              >
                <CheckCircle className="w-5 h-5" />
                <span>تم رفع المستند بنجاح</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile FAB for Upload */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUploadModal(true)}
            className="fixed right-4 bottom-4 md:hidden bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
          >
            <Upload className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentsPage;