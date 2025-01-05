// src/components/common/PageLoader.tsx
import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface PageLoaderProps {
  message?: string;
  overlay?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = 'جاري التحميل...',
  overlay = false 
}) => {
  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center gap-4 p-4"
    >
      <LoadingSpinner size="lg" />
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-600 text-lg"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      {content}
    </div>
  );
};

export default PageLoader;