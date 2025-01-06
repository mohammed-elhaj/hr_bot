// src/components/documents/DocumentUpload.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useDocuments } from '../../hooks/useDocuments';
import { AllowedFileType } from '../../types/documents';

const ALLOWED_TYPES: AllowedFileType[] = ['pdf', 'docx', 'doc', 'txt'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const DocumentUpload: React.FC = () => {
  const { uploadDocument } = useDocuments();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const fileType = file.name.split('.').pop()?.toLowerCase() as AllowedFileType;

    if (!ALLOWED_TYPES.includes(fileType)) {
      return 'نوع الملف غير مدعوم. الأنواع المدعومة هي: PDF، DOCX، DOC، TXT';
    }

    if (file.size > MAX_SIZE) {
      return 'حجم الملف يتجاوز الحد المسموح به (10 ميجابايت)';
    }

    return null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setUploadError('لم يتم اختيار ملف');
      return;
    }

    // Reset states
    setUploadError(null);
    setUploadSuccess(false);
    setSelectedFile(file);

    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('لم يتم اختيار ملف');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      await uploadDocument(selectedFile);
      setUploadSuccess(true);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; 
      }
    } catch (error: any) {
      setUploadError(error.message || 'حدث خطأ في رفع الملف');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <motion.div
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-colors duration-200 ease-in-out
          border-gray-300
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-3 bg-primary-50 rounded-full">
            <Upload className="w-6 h-6 text-primary-600" />
          </div>
          <div className="text-center">
            <p className="text-gray-700 font-medium">قم بسحب وإفلات الملف هنا</p>
            <p className="text-gray-500 text-sm mt-1">أو</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              اختر ملف
            </button>
          </div>
          <p className="text-sm text-gray-500">
            PDF, DOCX, DOC, TXT حتى 10 ميجابايت
          </p>
        </div>
      </motion.div>

      {/* Selected File */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <File className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleUpload}
              disabled={isUploading}
              className="mt-4 w-full py-2 px-4 rounded-lg bg-primary-600 text-white 
                         hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الرفع...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  رفع الملف
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{uploadError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>تم رفع الملف بنجاح</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentUpload;