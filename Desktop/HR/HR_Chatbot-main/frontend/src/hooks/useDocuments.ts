// src/hooks/useDocuments.ts
import { useContext } from 'react';
import { DocumentContext } from '../context/DocumentContext';

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};