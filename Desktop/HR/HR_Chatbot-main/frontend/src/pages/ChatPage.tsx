import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  FileText, 
  Calendar,
  AlertCircle,
  X,
  Image,
  Paperclip,
  ChevronDown,
  HelpCircle,
  AlignJustify
} from 'lucide-react';
import Layout from '../components/common/Layout';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import { useDocuments } from '../hooks/useDocuments';
import { ChatMessage } from '../types/chat';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PageLoader from '../components/common/PageLoader';
import { DocumentChatMessage } from '../components/chat/DocumentMessage';
import DocumentUpload from '../components/documents/DocumentUpload';

const ChatPage = () => {
  const { user } = useAuth();
  const { state, sendMessage } = useChat();
  const { uploadDocument } = useDocuments();
  const [inputMessage, setInputMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Common questions/actions for quick access
  const quickActions = [
    {
      id: 'vacation-balance',
      text: 'ما هو رصيد إجازاتي؟',
      icon: Calendar,
      category: 'إجازات'
    },
    {
      id: 'vacation-request',
      text: 'كيف أقدم طلب إجازة؟',
      icon: Calendar,
      category: 'إجازات'
    },
    {
      id: 'document-upload',
      text: 'مشاركة مستند',
      icon: FileText,
      category: 'مستندات'
    },
    {
      id: 'hr-policies',
      text: 'ما هي سياسات الموارد البشرية؟',
      icon: AlignJustify,
      category: 'سياسات'
    },
    {
      id: 'help',
      text: 'احتاج مساعدة',
      icon: HelpCircle,
      category: 'مساعدة'
    }
  ];

  useEffect(() => {
    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }, [state.messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollHeight, scrollTop, clientHeight } = chatContainerRef.current;
        const isBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
        setIsScrolledToBottom(isBottom);
      }
    };

    chatContainerRef.current?.addEventListener('scroll', handleScroll);
    return () => chatContainerRef.current?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || sendingMessage) return;

    setSendingMessage(true);
    setInputMessage('');
    setShowActions(false);
    
    try {
      await sendMessage(content);
      setIsScrolledToBottom(true);
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
      // Error handled by document context
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
      <div className="h-screen flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">المساعد الافتراضي</h1>
              <p className="text-sm text-gray-500">متصل</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {/* Welcome Message */}
            {state.messages.length === 0 && (
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
                    <Bot className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold">مرحباً {user?.name}</h2>
                  <p className="text-gray-600">كيف يمكنني مساعدتك اليوم؟</p>
                </motion.div>

                {/* Quick Actions Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
                >
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (action.id === 'document-upload') {
                          setShowDocumentUpload(true);
                        } else {
                          handleSendMessage(action.text);
                        }
                      }}
                      className="bg-white p-4 rounded-xl border border-gray-200 hover:border-primary-500 
                               hover:shadow-md transition-all flex items-center gap-3 text-right"
                    >
                      <div className="p-2 rounded-lg bg-primary-50">
                        <action.icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{action.text}</p>
                        <p className="text-sm text-gray-500">{action.category}</p>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Message List */}
            <AnimatePresence>
              {state.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 max-w-[85%]`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                      ${message.type === 'user' ? 'bg-primary-500' : 'bg-gradient-to-r from-primary-500 to-purple-500'}`}
                    >
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`rounded-2xl px-4 py-2.5 ${
                        message.type === 'user' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-white border border-gray-200 shadow-sm'
                      }`}>
                        {message.type === 'document_upload' || message.type === 'document_shared' ? (
                          <DocumentChatMessage
                            message={message}
                            onPreview={(documentId) => window.open(`/api/documents/${documentId}/preview`, '_blank')}
                            onDownload={(documentId) => window.open(`/api/documents/${documentId}/download`)}
                          />
                        ) : (
                          <div className="whitespace-pre-wrap text-[15px]">{message.content}</div>
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

        {/* Scroll to Bottom Button */}
        <AnimatePresence>
          {!isScrolledToBottom && state.messages.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={scrollToBottom}
              className="absolute bottom-24 right-8 bg-gray-900 text-white rounded-full p-2 shadow-lg hover:bg-gray-800"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Document Upload Area */}
        <AnimatePresence>
          {showDocumentUpload && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute inset-x-0 bottom-20 bg-white border-t shadow-lg"
            >
              <div className="max-w-4xl mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">مشاركة مستند</h3>
                  <button 
                    onClick={() => setShowDocumentUpload(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <DocumentUpload onUpload={handleDocumentUpload} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="bg-white border-t px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full bg-gray-50 rounded-2xl border-0 px-4 py-3 max-h-32 focus:ring-1 focus:ring-primary-500 resize-none"
                  rows={1}
                  dir="rtl"
                  disabled={sendingMessage}
                />
                <div className="absolute left-2 bottom-2 flex gap-1">
                  <button
                    onClick={() => setShowDocumentUpload(true)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    title="مشاركة مستند"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim() || sendingMessage}
                className="p-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600 
                         disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0
                         shadow-lg shadow-primary-500/25"
              >
                {sendingMessage ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>

            {/* Typing Indicator */}
            <AnimatePresence>
              {sendingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-4 bottom-20 bg-white rounded-lg shadow-lg border px-4 py-2 flex items-center gap-2"
                >
                  <LoadingSpinner size="sm" color="primary" />
                  <span className="text-sm text-gray-600">المساعد يكتب...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Actions Drawer */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-full left-0 right-0 bg-white border-t shadow-lg rounded-t-xl overflow-hidden"
                >
                  <div className="max-w-4xl mx-auto p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {quickActions.map((action) => (
                        <motion.button
                          key={action.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (action.id === 'document-upload') {
                              setShowDocumentUpload(true);
                            } else {
                              handleSendMessage(action.text);
                            }
                            setShowActions(false);
                          }}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
                        >
                          <action.icon className="w-4 h-4 text-primary-500" />
                          <span className="text-sm text-gray-700">{action.text}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Error Messages */}
        <AnimatePresence>
          {state.error && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-600 px-4 py-2 rounded-lg shadow-lg border border-red-100 flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{state.error}</span>
              <button
                onClick={() => state.clearError?.()}
                className="ml-2 text-red-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default ChatPage;