import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import Layout from '../components/common/Layout';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  rated?: 'up' | 'down' | null;
}

interface SuggestionButton {
  id: string;
  text: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string>(Date.now().toString());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const initialSuggestions: SuggestionButton[] = [
    { id: '1', text: 'كيف يمكنني تقديم إجازة؟' },
    { id: '2', text: 'ما هي سياسة العمل عن بعد؟' },
    { id: '3', text: 'كيف يمكنني تحديث معلوماتي الشخصية؟' },
    { id: '4', text: 'ما هي إجراءات تقييم الأداء؟' },
  ];

  const [suggestions, setSuggestions] = useState<SuggestionButton[]>(initialSuggestions);

  const scrollToBottom = () => {
    // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Update conversation ID if provided
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى. 🚫",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  const handleRateMessage = (messageId: string, rating: 'up' | 'down') => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, rated: rating } : msg
      )
    );
  };

  return (
    <Layout>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Chat Header */}
        {/* <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">مساعد الموارد البشرية</h1>
                <p className="text-sm text-gray-500">متصل دائماً لمساعدتك</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-semibold">مرحباً بك في مساعد الموارد البشرية</h2>
                <p className="text-gray-600">كيف يمكنني مساعدتك اليوم؟</p>
              </motion.div>
            )}

            {/* Message List */}
            <AnimatePresence>
              {messages.map((message) => (
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
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.type === 'user' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-white border border-gray-200'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString('ar-SA', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {message.type === 'bot' && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleRateMessage(message.id, 'up')}
                              className={`p-1 rounded hover:bg-gray-100 ${
                                message.rated === 'up' ? 'text-green-500' : 'text-gray-400'
                              }`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRateMessage(message.id, 'down')}
                              className={`p-1 rounded hover:bg-gray-100 ${
                                message.rated === 'down' ? 'text-red-500' : 'text-gray-400'
                              }`}
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
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
        {messages.length === 0 && (
          <div className="bg-white border-t">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
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
                disabled={!inputMessage.trim() || isTyping}
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