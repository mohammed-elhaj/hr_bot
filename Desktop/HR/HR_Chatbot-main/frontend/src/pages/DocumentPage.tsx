// src/pages/DocumentPage.tsx

import React from 'react';
import Layout from '../components/common/Layout';
import DocumentUpload from '../components/documents/DocumentUpload';
import DocumentList from '../components/documents/DocumentList';
import { motion } from 'framer-motion';

const DocumentsPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-4"
        >
          إدارة المستندات
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-semibold mb-2"
            >
              رفع مستند جديد
            </motion.h2>
            <DocumentUpload />
          </div>
          <div>
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-semibold mb-2"
            >
              قائمة المستندات
            </motion.h2>
            <DocumentList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentsPage;