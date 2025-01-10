// src/context/VacationContext.tsx

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { vacationService } from '../services/vacation';
import { 
  VacationBalance, 
  VacationRequest,
  CreateVacationRequestPayload 
} from '../types/vacation';

interface VacationState {
  balance: VacationBalance | null;
  requests: VacationRequest[];
  isLoading: boolean;
  error: string | null;
}

type VacationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_BALANCE'; payload: VacationBalance }
  | { type: 'SET_REQUESTS'; payload: VacationRequest[] }
  | { type: 'ADD_REQUEST'; payload: VacationRequest }
  | { type: 'UPDATE_REQUEST'; payload: VacationRequest }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: VacationState = {
  balance: null,
  requests: [],
  isLoading: false,
  error: null
};

const vacationReducer = (state: VacationState, action: VacationAction): VacationState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };
    case 'SET_BALANCE':
      return { ...state, balance: action.payload };
    case 'SET_REQUESTS':
      return { ...state, requests: action.payload };
    case 'ADD_REQUEST':
      return { ...state, requests: [...state.requests, action.payload] };
    case 'UPDATE_REQUEST':
      return {
        ...state,
        requests: state.requests.map(req =>
          req.id === action.payload.id ? action.payload : req
        )
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

interface VacationContextType {
  state: VacationState;
  fetchBalance: () => Promise<void>;
  fetchRequests: () => Promise<void>;
  submitRequest: (request: CreateVacationRequestPayload) => Promise<void>;
  cancelRequest: (requestId: string) => Promise<void>;
  clearError: () => void;
}

// Correct: Named export
export const VacationContext = createContext<VacationContextType | undefined>(undefined);

export const VacationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(vacationReducer, initialState);
  const { user } = useAuth();

  const fetchBalance = useCallback(async () => {
    if (!user?.id) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await vacationService.getBalance(user.id);
      dispatch({ type: 'SET_BALANCE', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'حدث خطأ في جلب رصيد الإجازات' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user]);

  const fetchRequests = useCallback(async () => {
    if (!user?.id) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await vacationService.getRequests(user.id);
      dispatch({ type: 'SET_REQUESTS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'حدث خطأ في جلب طلبات الإجازة' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user]);

  const submitRequest = async (request: CreateVacationRequestPayload) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // add this line to check if the backend is reciving a valid employee_id
      console.log('Submitting request:', request); 
      const response = await vacationService.submitRequest(request);
      // add this line to check the response from the backend
      console.log('Vacation request response:', response); 
      dispatch({ type: 'ADD_REQUEST', payload: response.data });
      await fetchBalance(); // Refresh balance after successful request
    } catch (error) {
      console.error('Error submitting vacation request:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'حدث خطأ في تقديم طلب الإجازة' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const cancelRequest = async (requestId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await vacationService.cancelRequest(requestId);
      dispatch({ type: 'UPDATE_REQUEST', payload: response.data });
      await fetchBalance(); // Refresh balance after cancellation
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'حدث خطأ في إلغاء طلب الإجازة' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return (
    <VacationContext.Provider
      value={{
        state,
        fetchBalance,
        fetchRequests,
        submitRequest,
        cancelRequest,
        clearError
      }}
    >
      {children}
    </VacationContext.Provider>
  );
};

// No default export