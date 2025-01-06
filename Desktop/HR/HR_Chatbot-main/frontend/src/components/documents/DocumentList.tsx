// src/components/documents/DocumentList.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Trash2, 
  Download, 
  Search, 
  Filter,
  AlertCircle,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { useDocuments } from '../../hooks/useDocuments';
import { DocumentMetadata, AllowedFileType } from '../../types/documents';
import { formatDate } from '../../utils/data';
import LoadingSpinner from '../common/LoadingSpinner';
import ContentSkeleton from '../common/ContentSkeleton';

interface SortConfig {
  field: keyof DocumentMetadata;
  direction: 'asc' | 'desc';
}

const DocumentList: React.FC = () => {
  const { state, fetchDocuments, deleteDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<AllowedFileType | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    field: 'uploadedAt', 
    direction: 'desc' 
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Filter and sort documents
  const filteredDocuments = state.documents
    .filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || doc.fileType === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const field = sortConfig.field;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      return a[field] > b[field] ? direction : -direction;
    });

  const handleSort = (field: keyof DocumentMetadata) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      setDeleteConfirm(null);
    } catch (error) {
      // Error is handled by the context
    }
  };

  const getFileTypeIcon = (type: AllowedFileType) => {
    // You could add different icons for different file types
    return <FileText className="w-5 h-5" />;
  };

  if (state.isLoading && !state.documents.length) {
    return <ContentSkeleton type="list" count={5} />;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="بحث في المستندات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as AllowedFileType | 'all')}
            className="appearance-none pr-4 pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">جميع الأنواع</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="doc">DOC</option>
            <option value="txt">TXT</option>
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Documents List */}
      {filteredDocuments.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b text-sm font-medium text-gray-500">
            <div className="col-span-5 flex items-center gap-2 cursor-pointer" onClick={() => handleSort('title')}>
              اسم الملف
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <div className="col-span-2">النوع</div>
            <div className="col-span-3 flex items-center gap-2 cursor-pointer" onClick={() => handleSort('uploadedAt')}>
              تاريخ الرفع
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <div className="col-span-2">إجراءات</div>
          </div>

          {/* Document Items */}
          <AnimatePresence>
            {filteredDocuments.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-12 gap-4 px-4 py-3 border-b last:border-0 items-center hover:bg-gray-50"
              >
                {/* File Name */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded">
                    {getFileTypeIcon(doc.fileType)}
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-gray-900 truncate">{doc.title}</p>
                    <p className="text-sm text-gray-500">
                      {(doc.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {/* File Type */}
                <div className="col-span-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {doc.fileType.toUpperCase()}
                  </span>
                </div>

                {/* Upload Date */}
                <div className="col-span-3 text-sm text-gray-500">
                  {formatDate(doc.uploadedAt)}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center gap-2">
                  <button
                    onClick={() => window.open(`/api/documents/${doc.id}/download`)}
                    className="p-1 text-gray-400 hover:text-gray-500"
                    title="تحميل"
                  >
                    <Download className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirm(doc.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد مستندات</h3>
          <p className="mt-2 text-gray-500">
            {searchQuery || selectedType !== 'all' 
              ? 'لا توجد نتائج تطابق معايير البحث'
              : 'ابدأ برفع مستنداتك'}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">تأكيد الحذف</h3>
              <p className="text-gray-500 mb-6">
                هل أنت متأكد من رغبتك في حذف هذا المستند؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  حذف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-4 right-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{state.error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentList;