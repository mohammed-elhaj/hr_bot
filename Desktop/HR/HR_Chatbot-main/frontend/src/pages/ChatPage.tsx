// src/pages/ChatPage.tsx
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import Layout from '../components/common/Layout';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';

const ChatPage = () => {
  const { state, sendMessage } = useChat();
  const { user } = useAuth();
  const [inputMessage, setInputMessage] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const initialSuggestions = [
    { id: '1', text: 'كيف يمكنني تقديم إجازة؟' },
    { id: '2', text: 'ما هي سياسة العمل عن بعد؟' },
    { id: '3', text: 'كيف يمكنني تحديث معلوماتي الشخصية؟' },
    { id: '4', text: 'ما هي إجراءات تقييم الأداء؟' },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || state.isLoading) return;

    setInputMessage('');
    await sendMessage(content);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

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
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 max-w-[80%]`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                      ${message.type === 'user' ? 'bg-primary-500' : 'bg-purple-500'}`}>
                      {message.type === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div 
                        className={`rounded-2xl px-4 py-2 ${
                          message.type === 'user' 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString('ar-SA', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {message.status === 'error' && (
                          <span className="text-xs text-red-500">
                            فشل في الإرسال
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Indicator */}
            <AnimatePresence>
              {state.isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">جاري الكتابة...</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions */}
        {state.messages.length === 0 && (
          <div className="bg-white border-t">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <div className="flex flex-wrap gap-2">
                {initialSuggestions.map((suggestion) => (
                  <motion.button
                    key={suggestion.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendMessage(suggestion.text)}
                    className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-colors"
                  >
                    {suggestion.text}
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
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full bg-transparent border-none resize-none px-4 py-3 max-h-32 focus:ring-0 focus:outline-none"
                  rows={1}
                  dir="rtl"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim() || state.isLoading}
                className="flex-shrink-0 p-3 rounded-full bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;