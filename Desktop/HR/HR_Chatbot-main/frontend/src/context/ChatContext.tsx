// src/context/ChatContext.tsx
import React, { createContext, useContext, useReducer } from 'react';
import { chatService, ChatResponse } from '../services/chat';

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_MESSAGE_STATUS'; payload: { id: string; status: Message['status'] } };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'UPDATE_MESSAGE_STATUS':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id
            ? { ...msg, status: action.payload.status }
            : msg
        ),
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

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    isLoading: false,
    error: null,
  });

  const sendMessage = async (content: string) => {
    const messageId = Date.now().toString();
    
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        id: messageId,
        content,
        type: 'user',
        timestamp: new Date(),
        status: 'sending',
      },
    });

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Simulated API call for now
      // Replace with actual API call later
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = { data: { response: "مرحباً! كيف يمكنني مساعدتك؟", timestamp: new Date().toISOString() }};
      
      dispatch({
        type: 'UPDATE_MESSAGE_STATUS',
        payload: { id: messageId, status: 'sent' },
      });

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now().toString(),
          content: response.data.response,
          type: 'bot',
          timestamp: new Date(response.data.timestamp),
          status: 'sent',
        },
      });
    } catch (error) {
      dispatch({
        type: 'UPDATE_MESSAGE_STATUS',
        payload: { id: messageId, status: 'error' },
      });
      dispatch({
        type: 'SET_ERROR',
        payload: 'فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
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
        clearError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Make sure to export both the context and the provider
