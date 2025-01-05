// src/services/chat.ts

import apiService from './api';
import { ChatMessage, ChatResponse, MessageType } from '../types/chat';
import { API_ENDPOINTS } from '../constants';

class ChatService {
  async sendMessage(
    content: string,
    type: MessageType = 'text',
    metadata?: any,
    employee_id?: string
  ): Promise<ChatResponse> {
    const response = await apiService.post<ChatResponse>(API_ENDPOINTS.CHAT, {
      message: content,
      type,
      metadata,
      employee_id
    });
    return response.data;
  }

  async getChatHistory(employee_id: string): Promise<ChatMessage[]> {
    const response = await apiService.get<{ history: ChatMessage[] }>(
      `${API_ENDPOINTS.CHAT}/history/${employee_id}`
    );
    return response.data.history.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  }

  async requestVacationBalance(employee_id: string): Promise<ChatResponse> {
    return this.sendMessage(
      'عرض رصيد الإجازات',
      'vacation_balance',
      { employee_id }
    );
  }

  async initiateVacationRequest(employee_id: string): Promise<ChatResponse> {
    return this.sendMessage(
      'تقديم طلب إجازة',
      'vacation_request',
      { employee_id }
    );
  }
}

export const chatService = new ChatService();
export default chatService;