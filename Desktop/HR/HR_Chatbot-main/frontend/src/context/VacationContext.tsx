// src/context/VacationContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { 
  vacationService, 
  VacationBalance, 
  VacationRequest, 
  VacationRequestResponse 
} from '../services/vacation';
import { getErrorMessage } from '../utils/errors';

interface VacationContextType {
  balance: VacationBalance | null;
  isLoading: boolean;
  error: string | null;
  fetchBalance: (employeeId: string) => Promise<void>;
  submitRequest: (request: VacationRequest) => Promise<VacationRequestResponse>;
  clearError: () => void;
}

const VacationContext = createContext<VacationContextType | undefined>(undefined);

export const VacationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<VacationBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async (employeeId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await vacationService.getBalance(employeeId);
      setBalance(response.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const submitRequest = async (request: VacationRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await vacationService.submitRequest(request);
      // Refresh balance after successful request
      await fetchBalance(request.employee_id);
      return response.data;
    } catch (error) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <VacationContext.Provider
      value={{
        balance,
        isLoading,
        error,
        fetchBalance,
        submitRequest,
        clearError,
      }}
    >
      {children}
    </VacationContext.Provider>
  );
};