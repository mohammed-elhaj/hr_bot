// src/components/chat/DocumentMessage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye } from 'lucide-react';
import { DocumentMessage } from '../../types/chat';
import { formatDate } from '../../utils/data';

interface DocumentChatMessageProps {
  message: DocumentMessage;
  onPreview?: (documentId: string) => void;
  onDownload?: (documentId: string) => void;
}

export const DocumentChatMessage: React.FC<DocumentChatMessageProps> = ({
  message,
  onPreview,
  onDownload
}) => {
  const { document } = message.metadata;
  const fileSize = (document.size / 1024 / 1024).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-sm"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <FileText className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{document.title}</p>
            <p className="text-sm text-gray-500">
              {fileSize} MB · {document.fileType.toUpperCase()}
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {formatDate(document.uploadedAt)}
          </span>
          <div className="flex gap-2">
            {document.fileType === 'pdf' && (
              <button
                onClick={() => onPreview?.(document.id)}
                className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                title="معاينة"
              >
                <Eye className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => onDownload?.(document.id)}
              className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
              title="تحميل"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentChatMessage;