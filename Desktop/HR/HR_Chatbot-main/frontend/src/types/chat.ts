// src/types/chat.ts

import { VacationRequest, VacationBalance } from './vacation';
import { DocumentMetadata } from './documents';



export type MessageType = 
  | 'text'
  | 'vacation_request'
  | 'vacation_balance'
  | 'document_upload'
  | 'document_shared';

  export interface MessageBase {
    id: string;  // Ensure this exists
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

export interface DocumentMessage extends MessageBase {
    type: 'document_upload' | 'document_shared';
    metadata: {
      document: DocumentMetadata;
    };
  }