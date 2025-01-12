// src/types/tickets.ts
export interface Ticket {
  ticket_id: string;
  employee_id: string;
  request_type: string | null;
  start_date: string | null;
  end_date: string | null;
  days_count: number | null;
  status: string;
  manager_id: string | null;
  request_date: string | null;
  response_date: string | null;
  notes: string | null;
  summary: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}