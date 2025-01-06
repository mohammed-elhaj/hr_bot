// src/context/DocumentContext.tsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { documentService } from '../services/documents';
import { DocumentMetadata } from '../types/documents';

interface DocumentState {
  documents: DocumentMetadata[];
  isLoading: boolean;
  error: string | null;
}

type DocumentAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DOCUMENTS'; payload: DocumentMetadata[] }
  | { type: 'ADD_DOCUMENT'; payload: DocumentMetadata }
  | { type: 'REMOVE_DOCUMENT'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null };

interface DocumentContextType {
  state: DocumentState;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (file: File) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
  clearError: () => void;
}

// Create and export the context
export const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

const initialState: DocumentState = {
  documents: [],
  isLoading: false,
  error: null
};

const documentReducer = (state: DocumentState, action: DocumentAction): DocumentState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'REMOVE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload)
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState);

  const fetchDocuments = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await documentService.getDocuments();
      dispatch({ type: 'SET_DOCUMENTS', payload: response.documents });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'حدث خطأ في جلب المستندات'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const uploadDocument = useCallback(async (file: File) => {
    //dispatch({ type: 'SET_LOADING', payload: true }); //Loading handled by the component
    try {
      const response = await documentService.uploadDocument(file);
      dispatch({ type: 'ADD_DOCUMENT', payload: response.document });
      return response;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'حدث خطأ في رفع المستند'
      });
      throw error; // Re-throw the error after setting it to the state
    } finally {
      //dispatch({ type: 'SET_LOADING', payload: false }); //Loading handled by the component
    }
  }, []);

  const deleteDocument = useCallback(async (documentId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await documentService.deleteDocument(documentId);
      dispatch({ type: 'REMOVE_DOCUMENT', payload: documentId });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'حدث خطأ في حذف المستند'
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return (
    <DocumentContext.Provider
      value={{
        state,
        fetchDocuments,
        uploadDocument,
        deleteDocument,
        clearError
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
    const context = useContext(DocumentContext);
    if (!context) {
      throw new Error('useDocuments must be used within a DocumentProvider');
    }
    return context;
  };