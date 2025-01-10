// src/components/documents/DocumentList.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Trash2, 
  Download, 
  AlertCircle
} from 'lucide-react';
import { useDocuments } from '../../hooks/useDocuments';
import { DocumentMetadata, AllowedFileType } from '../../types/documents';
import { formatDate } from '../../utils/data';
import ContentSkeleton from '../common/ContentSkeleton';

const DocumentList: React.FC = () => {
  const { state, fetchDocuments, deleteDocument } = useDocuments();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
    } catch (error) {
      // Error is handled by the context
    }
  };

  const getFileTypeIcon = (type: AllowedFileType) => {
    // Placeholder - replace with actual icons
    return <FileText className="w-5 h-5" />;
  };

  if (state.isLoading && !state.documents.length) {
    return <ContentSkeleton type="list" count={5} />;
  }

  return (
    <div className="space-y-4">
      {/* Documents List */}
      {state.documents.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table Header (Simplified) */}
          <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-50 border-b text-sm font-medium text-gray-500">
            <div>اسم الملف</div>
            <div>النوع</div>
            <div>إجراءات</div>
          </div>

          {/* Document Items */}
          {state.documents.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-3 gap-4 px-4 py-3 border-b last:border-0 items-center hover:bg-gray-50"
            >
              {/* File Name */}
              <div className="flex items-center gap-3">
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
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {doc.fileType ? doc.fileType.toUpperCase() : ''}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open( `/api/documents/${doc.id}/download`)}
                  className="p-1 text-gray-400 hover:text-gray-500"
                  title="تحميل"
                >
                  <Download className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                  title="حذف"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد مستندات</h3>
          <p className="mt-2 text-gray-500">
              ابدأ برفع مستنداتك
          </p>
        </div>
      )}

      {/* Error Message */}
      {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{state.error}</span>
          </motion.div>
        )}
    </div>
  );
};

export default DocumentList;