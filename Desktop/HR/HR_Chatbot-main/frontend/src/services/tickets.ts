// src/services/tickets.ts
import apiService from './api';
import { Ticket } from '../types/tickets';
import { API_ENDPOINTS } from '../constants';

class TicketService {
  async getAllTickets(): Promise<Ticket[]> {
    try {
      const response = await apiService.get(API_ENDPOINTS.ADMIN_TICKETS);
      console.log("Raw API Response:", response);

      if (response.data.status !== 'success') {
        throw new Error('Failed to fetch tickets');
      }

      // The response.data.tickets is already parsed JSON
      const tickets = response.data.tickets.map((ticket: any) => ({
        ...ticket,
        // Convert any null or undefined dates to null for consistency
        start_date: ticket.start_date || null,
        end_date: ticket.end_date || null,
        request_date: ticket.request_date || null,
        response_date: ticket.response_date || null,
        created_at: ticket.created_at || null,
        updated_at: ticket.updated_at || null,
        // Ensure numbers are properly parsed
        days_count: ticket.days_count ? Number(ticket.days_count) : null
      }));

      return tickets;
    } catch (error) {
      console.error("Error in getAllTickets:", error);
      throw new Error('Failed to fetch tickets');
    }
  }
}

export const ticketService = new TicketService();