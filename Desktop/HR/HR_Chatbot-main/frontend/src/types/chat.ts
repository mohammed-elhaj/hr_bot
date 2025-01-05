// src/types/chat.ts

import { VacationRequest, VacationBalance } from './vacation';

export type MessageType = 
  | 'text'
  | 'vacation_request'
  | 'vacation_balance'
  | 'vacation_status';

export interface MessageBase {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}

export interface TextMessage extends MessageBase {
  type: 'text';
}

export interface VacationRequestMessage extends MessageBase {
  type: 'vacation_request';
  metadata: {
    request: VacationRequest;
  };
}

export interface VacationBalanceMessage extends MessageBase {
  type: 'vacation_balance';
  metadata: {
    balance: VacationBalance;
  };
}

export interface VacationStatusMessage extends MessageBase {
  type: 'vacation_status';
  metadata: {
    requestId: string;
    status: string;
  };
}

export type ChatMessage = 
  | TextMessage 
  | VacationRequestMessage 
  | VacationBalanceMessage 
  | VacationStatusMessage;

export interface ChatResponse {
  response: string;
  type: MessageType;
  metadata?: any;
  timestamp: string;
}