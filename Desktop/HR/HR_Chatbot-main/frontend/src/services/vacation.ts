// src/services/vacation.ts

import apiService from './api';
import { 
  VacationBalance, 
  VacationRequest, 
  CreateVacationRequestPayload,
  VacationBalanceResponse,
  VacationRequestResponse,
  VacationRequestListResponse
} from '../types/vacation';
import { API_ENDPOINTS } from '../constants';

class VacationService {
  /**
   * Get vacation balance for an employee
   */
  async getBalance(employeeId: string): Promise<VacationBalanceResponse> {
    try {
      const response = await apiService.get<VacationBalanceResponse>(
        `${API_ENDPOINTS.VACATION_BALANCE}/${employeeId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'حدث خطأ في جلب رصيد الإجازات');
    }
  }

  /**
   * Submit a new vacation request
   */
  async submitRequest(request: CreateVacationRequestPayload): Promise<VacationRequestResponse> {
    try {
      const response = await apiService.post<VacationRequestResponse>(
        API_ENDPOINTS.VACATION_REQUEST,
        request
      );
      return response.data;
    } catch (error) {
        console.log('submitRequest error:', error); // added for debugging
      throw new Error(error instanceof Error ? error.message : 'حدث خطأ في تقديم طلب الإجازة');
    }
  }

  /**
   * Get list of vacation requests for an employee
   */
  async getRequests(employeeId: string): Promise<VacationRequestListResponse> {
    try {
      const response = await apiService.get<VacationRequestListResponse>(
        `${API_ENDPOINTS.VACATION_REQUEST}s/${employeeId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'حدث خطأ في جلب طلبات الإجازة');
    }
  }

  /**
   * Cancel a vacation request
   */
  async cancelRequest(requestId: string): Promise<VacationRequestResponse> {
    try {
      const response = await apiService.post<VacationRequestResponse>(
        `${API_ENDPOINTS.VACATION_REQUEST}/${requestId}/cancel`
      );
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'حدث خطأ في إلغاء طلب الإجازة');
    }
  }
}

export const vacationService = new VacationService();
export default vacationService;