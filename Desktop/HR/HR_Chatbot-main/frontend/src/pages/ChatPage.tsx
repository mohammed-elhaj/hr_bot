import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User,
  Calendar,
  AlertCircle,
  X,
  ChevronDown,
  HelpCircle,
  AlignJustify,
  ArrowRight,
  Plus,
  Minus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import { ChatMessage } from '../types/chat';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PageLoader from '../components/common/PageLoader';

const ChatPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, sendMessage } = useChat();
  const [inputMessage, setInputMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Quick actions
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

  if (state.isLoading && !state.messages.length) {
    return (
      <Layout>
        <PageLoader message="جاري تحميل المحادثة..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">المساعد الافتراضي</h1>
              <p className="text-sm text-gray-500">متصل</p>
            </div>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isMenuOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white border-b md:hidden"
            >
              <div className="p-4 space-y-2">
                {quickActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => {
                      handleSendMessage(action.text);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-right p-3 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <action.icon className="w-5 h-5 text-primary-500" />
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Welcome Message */}
            {state.messages.length === 0 && (
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
                    <Bot className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold">مرحباً {user?.name}</h2>
                  <p className="text-gray-600">كيف يمكنني مساعدتك اليوم؟</p>
                </motion.div>

                {/* Quick Actions Grid - Desktop */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="hidden md:grid grid-cols-2 gap-4 max-w-2xl mx-auto"
                >
                  {quickActions.map(action => (
                    <motion.button
                      key={action.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSendMessage(action.text)}
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
              {state.messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[85%] md:max-w-[75%]`}>
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
                        <div className="whitespace-pre-wrap text-sm md:text-base">{message.content}</div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString('ar-SA', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t px-4 py-3 sticky bottom-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full bg-gray-50 rounded-2xl border-0 px-4 py-3 max-h-32 focus:ring-1 focus:ring-primary-500 resize-none text-sm md:text-base"
                  rows={1}
                  dir="rtl"
                  disabled={sendingMessage}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim() || sendingMessage}
                className="p-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600 
                         disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
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

        {/* Error Messages */}
        <AnimatePresence>
          {state.error && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-600 
                       px-4 py-2 rounded-lg shadow-lg border border-red-100 flex items-center gap-2
                       max-w-[90%] md:max-w-md"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{state.error}</span>
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