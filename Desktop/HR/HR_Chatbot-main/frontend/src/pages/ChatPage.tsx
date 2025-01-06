// src/pages/ChatPage.tsx
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  FileText, 
  Calendar,
  AlertCircle,
  X
} from 'lucide-react';
import Layout from '../components/common/Layout';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import { useDocuments } from '../hooks/useDocuments';
import { ChatMessage } from '../types/chat';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PageLoader from '../components/common/PageLoader';
import ContentSkeleton from '../components/common/ContentSkeleton';

import { DocumentChatMessage } from '../components/chat/DocumentMessage';

import DocumentUpload from '../components/documents/DocumentUpload';


const ChatPage = () => {
  const { user } = useAuth();
  const { state, sendMessage } = useChat();
  const { uploadDocument } = useDocuments();
  const [inputMessage, setInputMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick action suggestions
  const quickActions = [
    {
      id: 'vacation',
      text: 'كيف يمكنني تقديم إجازة؟',
      icon: Calendar,
    },
    {
      id: 'document',
      text: 'مشاركة مستند',
      icon: FileText,
    },
    // Add more quick actions as needed
  ];

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || sendingMessage) return;

    setSendingMessage(true);
    setInputMessage('');
    
    try {
      await sendMessage(content);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  const handleDocumentUpload = async (file: File) => {
    try {
      const response = await uploadDocument(file);
      await sendMessage(
        'تم مشاركة مستند',
        'document_upload',
        { document: response.document }
      );
      setShowDocumentUpload(false);
    } catch (error) {
      // Error is handled by the document context
    }
  };

  const renderMessage = (message: ChatMessage) => {
    switch (message.type) {
      case 'document_upload':
      case 'document_shared':
        return (
          <DocumentChatMessage
            message={message}
            onPreview={(documentId) => window.open(`/api/documents/${documentId}/preview`, '_blank')}
            onDownload={(documentId) => window.open(`/api/documents/${documentId}/download`)}
          />
        );
      default:
        return <div className="whitespace-pre-wrap">{message.content}</div>;
    }
  };

  if (state.isLoading && !state.messages.length) {
    return (
      <Layout>
        <PageLoader message="جاري تحميل المحادثة..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Welcome Message */}
            {state.messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-semibold">مرحباً {user?.name}</h2>
                <p className="text-gray-600">كيف يمكنني مساعدتك اليوم؟</p>
              </motion.div>
            )}

            {/* Message List */}
            <AnimatePresence>
              {state.messages.map((message) => (
                <motion.div
                  key={message.id}  // Use just message.id as the key
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 max-w-[80%]`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                      ${message.type === 'user' ? 'bg-primary-500' : 'bg-purple-500'}`}
                    >
                      {message.type === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.type === 'user' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-white border border-gray-200'
                      }`}>
                        {message.type === 'document_upload' || message.type === 'document_shared' ? (
                          <DocumentChatMessage
                            message={message}
                            onPreview={(documentId) => window.open(`/api/documents/${documentId}/preview`, '_blank')}
                            onDownload={(documentId) => window.open(`/api/documents/${documentId}/download`)}
                          />
                        ) : (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString('ar-SA', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {message.status === 'error' && (
                          <span className="text-red-500 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            فشل الإرسال
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Document Upload Area */}
        <AnimatePresence>
          {showDocumentUpload && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white border-t"
            >
              <div className="max-w-3xl mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">مشاركة مستند</h3>
                  <button 
                    onClick={() => setShowDocumentUpload(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <DocumentUpload onUpload={handleDocumentUpload} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        {state.messages.length === 0 && (
          <div className="bg-white border-t">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (action.id === 'document') {
                        setShowDocumentUpload(true);
                      } else {
                        handleSendMessage(action.text);
                      }
                    }}
                    className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 
                             text-sm transition-colors flex items-center gap-2"
                  >
                    <action.icon className="w-4 h-4" />
                    {action.text}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white border-t">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-end gap-4">
              <div className="flex-1 bg-gray-100 rounded-2xl">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full bg-transparent border-none resize-none px-4 py-3 max-h-32 focus:ring-0 focus:outline-none"
                  rows={1}
                  dir="rtl"
                  disabled={sendingMessage}
                />
              </div>
              <button
                onClick={() => setShowDocumentUpload(true)}
                className="p-3 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="مشاركة مستند"
              >
                <FileText className="w-5 h-5" />
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim() || sendingMessage}
                className="flex-shrink-0 p-3 rounded-full bg-primary-500 text-white hover:bg-primary-600 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingMessage ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;