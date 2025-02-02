// src/types/chat.ts

import { VacationRequest, VacationBalance } from './vacation';
import { DocumentMetadata } from './documents';

export type MessageType = 
  | 'text'
  | 'vacation_request'
  | 'vacation_balance'
  | 'vacation_action'
  | 'document_upload'
  | 'document_shared';

export type VacationAction = 
  | 'view_balance'
  | 'request_vacation'
  | 'view_requests'
  | 'goto_vacation_page';

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
    actions?: VacationAction[];
  };
}

export interface VacationBalanceMessage extends MessageBase {
  type: 'vacation_balance';
  metadata: {
    balance: VacationBalance;
    actions?: VacationAction[];
  };
}

export interface VacationActionMessage extends MessageBase {
  type: 'vacation_action';
  metadata: {
    action: VacationAction;
    data?: any;
  };
}

export interface VacationStatusMessage extends MessageBase {
  type: 'vacation_status';
  metadata: {
    requestId: string;
    status: string;
    actions?: VacationAction[];
  };
}

export interface DocumentMessage extends MessageBase {
  type: 'document_upload' | 'document_shared';
  metadata: {
    document: DocumentMetadata;
  };
}

export type ChatMessage = 
  | TextMessage 
  | VacationRequestMessage 
  | VacationBalanceMessage 
  | VacationStatusMessage
  | VacationActionMessage
  | DocumentMessage;

export interface ChatResponse {
  response: string;
  type: MessageType;
  metadata?: any;
  timestamp: string;
}