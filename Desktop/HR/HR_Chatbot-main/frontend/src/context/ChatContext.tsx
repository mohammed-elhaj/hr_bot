// src/context/ChatContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { chatService } from '../services/chat';
import { Message } from '../types/api';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

type ChatAction =
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_MESSAGE_STATUS'; payload: { id: string; status: Message['status'] } };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'UPDATE_MESSAGE_STATUS':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id
            ? { ...msg, status: action.payload.status }
            : msg
        )
      };
    default:
      return state;
  }
};

interface ChatContextType {
  state: ChatState;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (user?.employee_id) {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
          const history = await chatService.getChatHistory(user.employee_id);
          const historyWithDates = history.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          dispatch({ type: 'SET_MESSAGES', payload: historyWithDates });
        } catch (error) {
          dispatch({ 
            type: 'SET_ERROR', 
            payload: 'فشل في تحميل سجل المحادثات' 
          });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    loadChatHistory();
  }, [user]);

  const sendMessage = async (content: string) => {
    const currentUser = user; // Store user in variable to avoid closure issues
    
    if (!currentUser?.employee_id) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'يجب تسجيل الدخول لإرسال الرسائل' 
      });
      return;
    }

    const messageId = Date.now().toString();
    
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        id: messageId,
        content,
        type: 'user',
        timestamp: new Date(),
        status: 'sending'
      }
    });

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await chatService.sendMessage(content, currentUser.employee_id);
      
      dispatch({
        type: 'UPDATE_MESSAGE_STATUS',
        payload: { id: messageId, status: 'sent' }
      });

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          content: response.response,
          type: 'bot',
          timestamp: new Date(response.timestamp),
          status: 'sent'
        }
      });
    } catch (error) {
      dispatch({
        type: 'UPDATE_MESSAGE_STATUS',
        payload: { id: messageId, status: 'error' }
      });
      dispatch({
        type: 'SET_ERROR',
        payload: 'فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        sendMessage,
        clearError
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};