// src/pages/VacationPage.tsx

import React from 'react';
import Layout from '../components/common/Layout';
import VacationBalance from '../components/vacation/VacationBalance';
import VacationRequest from '../components/vacation/VacationRequest';
import { motion } from 'framer-motion';

const VacationPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-4"
        >
          إدارة الإجازات
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-semibold mb-2"
            >
              رصيد الإجازات
            </motion.h2>
            <VacationBalance />
          </div>
          <div>
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-semibold mb-2"
            >
              طلب إجازة جديد
            </motion.h2>
            <VacationRequest />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VacationPage;