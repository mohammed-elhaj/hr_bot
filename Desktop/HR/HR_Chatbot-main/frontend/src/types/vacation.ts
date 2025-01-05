// src/types/vacation.ts

/**
 * Vacation request status types
 */
export type VacationRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

/**
 * Vacation request types
 */
export type VacationRequestType = 'annual' | 'sick' | 'emergency';

/**
 * Vacation balance information
 */
export interface VacationBalance {
  employee_id: string;
  name: string;
  annual_balance: number;
  used_days: number;
  remaining_balance: number;
  last_updated: string;
}

/**
 * Vacation request form data
 */
export interface VacationRequestFormData {
  startDate: string;
  endDate: string;
  requestType: VacationRequestType;
  notes?: string;
}

/**
 * Vacation request data
 */
export interface VacationRequest {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  request_type: VacationRequestType;
  status: VacationRequestStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Vacation request creation payload
 */
export interface CreateVacationRequestPayload {
  employee_id: string;
  start_date: string;
  end_date: string;
  request_type: VacationRequestType;
  notes?: string;
}

/**
 * Vacation service responses
 */
export interface VacationBalanceResponse {
  status: string;
  data: VacationBalance;
}

export interface VacationRequestResponse {
  status: string;
  data: VacationRequest;
}

export interface VacationRequestListResponse {
  status: string;
  data: VacationRequest[];
}