# tools/ticket_tool.py
import pandas as pd
from datetime import datetime
from typing import Dict
import json

class TicketTool:
    """Tool for managing vacation request tickets"""
    
    def __init__(self, tickets_file: str):
        """Initialize Ticket Tool with the CSV file path."""
        self.tickets_file = tickets_file
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        """Create tickets file if it doesn't exist."""
        try:
            df = pd.read_csv(self.tickets_file)
        except FileNotFoundError:
            # Create new file with structure
            df = pd.DataFrame(columns=[
                'ticket_id', 'employee_id', 'request_type',
                'start_date', 'end_date', 'days_count',
                'status', 'manager_id', 'request_date',
                'response_date', 'notes'
            ])
            df.to_csv(self.tickets_file, index=False)

    def _generate_ticket_id(self) -> str:
        """Generate a unique ticket ID."""
        try:
            df = pd.read_csv(self.tickets_file)
            if df.empty:
                return f"VT{datetime.now().year}001"
            
            # Get last ticket number and increment
            last_ticket = df['ticket_id'].iloc[-1]
            ticket_num = int(last_ticket[-3:]) + 1
            return f"VT{datetime.now().year}{ticket_num:03d}"
            
        except Exception:
            # Fallback to timestamp-based ID
            return f"VT{datetime.now().strftime('%Y%m%d%H%M%S')}"

    def create_ticket(self, employee_id: str, start_date: str, end_date: str, request_type: str, notes: str = "") -> Dict:
        """Create a new vacation request ticket."""
        try:
            # No need for JSON parsing anymore
            days_count = (datetime.strptime(start_date,'%Y-%m-%d') - datetime.strptime(end_date, '%Y-%m-%d')).days + 1

            new_ticket = {
                'ticket_id': self._generate_ticket_id(),
                'employee_id': employee_id,
                'request_type': request_type,
                'start_date': start_date,
                'end_date': end_date,
                'days_count': days_count,
                'status': 'pending',
                'manager_id': None,
                'request_date': datetime.now().strftime('%Y-%m-%d'),
                'response_date': None,
                'notes': notes
            }
            
            # Add to CSV
            df = pd.read_csv(self.tickets_file)
            df = pd.concat([df, pd.DataFrame([new_ticket])], ignore_index=True)
            df.to_csv(self.tickets_file, index=False)
            
            return {
                "status": "success",
                "message": "تم إنشاء طلب الإجازة بنجاح",
                "ticket_id": new_ticket['ticket_id']
            }
            
        except Exception as e:
            print(f"Error creating ticket: {str(e)}")
            return {
                "error": "حدث خطأ في إنشاء طلب الإجازة",
                "status": "error"
            }

    def update_ticket_status(self, ticket_id: str, status: str, 
                           manager_id: str, notes: str = "") -> Dict:
        """Update the status of a ticket."""
        try:
            df = pd.read_csv(self.tickets_file)
            mask = df['ticket_id'] == ticket_id
            
            if not any(mask):
                return {
                    "error": "لم يتم العثور على الطلب",
                    "status": "not_found"
                }
            
            # Update ticket
            df.loc[mask, 'status'] = status
            df.loc[mask, 'manager_id'] = manager_id
            df.loc[mask, 'response_date'] = datetime.now().strftime('%Y-%m-%d')
            if notes:
                df.loc[mask, 'notes'] = notes
            
            # Save changes
            df.to_csv(self.tickets_file, index=False)
            
            return {
                "status": "success",
                "message": "تم تحديث حالة الطلب بنجاح"
            }
            
        except Exception as e:
            print(f"Error updating ticket: {str(e)}")
            return {
                "error": "حدث خطأ في تحديث حالة الطلب",
                "status": "error"
            }

    def get_employee_tickets(self, employee_id: str) -> Dict:
        """Get all tickets for an employee."""
        try:
            df = pd.read_csv(self.tickets_file)
            employee_tickets = df[df['employee_id'] == employee_id].to_dict('records')
            
            return {
                "status": "success",
                "tickets": employee_tickets
            }
            
        except Exception as e:
            print(f"Error getting tickets: {str(e)}")
            return {
                "error": "حدث خطأ في استرجاع الطلبات",
                "status": "error"
            }