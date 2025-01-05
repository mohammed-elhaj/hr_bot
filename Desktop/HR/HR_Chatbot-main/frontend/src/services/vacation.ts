// src/services/vacation.ts
import apiService, { ApiResponse } from './api';

export interface VacationBalance {
  status: string;
  employee_id: string;
  name: string;
  annual_balance: number;
  used_days: number;
  remaining_balance: number;
  last_updated: string;
}

export interface VacationRequest {
  employee_id: string;
  start_date: string;
  end_date: string;
  request_type: string;
  notes?: string;
}

export interface VacationRequestResponse {
  status: string;
  message: string;
  ticket_id: string;
}

export class VacationService {
  async getBalance(employeeId: string): Promise<ApiResponse<VacationBalance>> {
    return apiService.get<VacationBalance>(`/api/employee/vacation-balance/${employeeId}`);
  }

  async submitRequest(request: VacationRequest): Promise<ApiResponse<VacationRequestResponse>> {
    return apiService.post<VacationRequestResponse>('/api/employee/vacation-request', request);
  }
}

export const vacationService = new VacationService();