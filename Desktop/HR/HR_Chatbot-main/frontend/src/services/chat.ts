// src/services/chat.ts
import apiService, { ApiResponse } from './api';

export interface ChatMessage {
  message: string;
  employee_id?: string;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}

export class ChatService {
  async sendMessage(message: string, employee_id?: string): Promise<ApiResponse<ChatResponse>> {
    try {
      // For now, we'll just simulate an API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        data: {
          response: "مرحباً! كيف يمكنني مساعدتك؟",
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

export const chatService = new ChatService();