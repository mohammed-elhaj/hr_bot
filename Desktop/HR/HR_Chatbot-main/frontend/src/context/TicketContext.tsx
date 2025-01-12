// src/context/TicketContext.tsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Ticket } from '../types/tickets';
import { ticketService } from '../services/tickets';

interface TicketState {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
}

type TicketAction =
  | { type: 'FETCH_TICKETS_START' }
  | { type: 'FETCH_TICKETS_SUCCESS'; payload: Ticket[] }
  | { type: 'FETCH_TICKETS_FAILURE'; payload: string };

const initialState: TicketState = {
  tickets: [],
  isLoading: false,
  error: null,
};

const ticketReducer = (state: TicketState, action: TicketAction): TicketState => {
  switch (action.type) {
    case 'FETCH_TICKETS_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_TICKETS_SUCCESS':
      return { ...state, isLoading: false, tickets: action.payload };
    case 'FETCH_TICKETS_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

interface TicketContextType {
  state: TicketState;
  fetchTickets: () => Promise<void>;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const fetchTickets = useCallback(async () => {
    dispatch({ type: 'FETCH_TICKETS_START' });
    try {
      const tickets = await ticketService.getAllTickets();
      // Add console log here to verify fetched data
      console.log("Tickets fetched in context:", tickets); 
      dispatch({ type: 'FETCH_TICKETS_SUCCESS', payload: tickets });
    } catch (error) {
      console.error("Error fetching tickets (in context):", error);
      dispatch({
        type: 'FETCH_TICKETS_FAILURE',
        payload: error instanceof Error ? error.message : 'Failed to fetch tickets',
      });
    }
  }, []);

  return (
    <TicketContext.Provider value={{ state, fetchTickets }}>
      {children}
    </TicketContext.Provider>
  );
};

export { TicketContext, TicketProvider };

// Make useTickets available for import
export const useTickets = () => {
    const context = useContext(TicketContext);
    if (!context) {
        throw new Error('useTickets must be used within a TicketProvider');
    }
    return context;
};