# tools/support_ticket_tool.py
import pandas as pd
import uuid
from datetime import datetime
from typing import Dict

class SupportTicketTool:
    """Tool for creating general support tickets."""

    def __init__(self, tickets_file: str):
        """Initialize Support Ticket Tool with the CSV file path."""
        self.tickets_file = tickets_file
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        """Create support tickets file if it doesn't exist."""
        try:
            pd.read_csv(self.tickets_file)
        except FileNotFoundError:
            df = pd.DataFrame(columns=[
                'ticket_id', 'employee_id', 'summary', 'description',
                'status', 'created_at', 'updated_at'
            ])
            df.to_csv(self.tickets_file, index=False)

    def _generate_ticket_id(self) -> str:
        """Generate a unique ticket ID using UUID."""
        return f"ST-{uuid.uuid4().hex[:8].upper()}"

    def create_ticket(self, employee_id: str, summary: str, description: str) -> Dict:
        """Create a new support ticket.

        Args:
            employee_id: The ID of the employee creating the ticket.
            summary: A brief summary of the issue.
            description: A more detailed description of the issue.

        Returns:
            A dictionary containing the status of the operation and a message.
        """
        try:
            new_ticket = {
                'ticket_id': self._generate_ticket_id(),
                'employee_id': employee_id,
                'summary': summary,
                'description': description,
                'status': 'open',
                'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'updated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }

            df = pd.read_csv(self.tickets_file)
            new_ticket_df = pd.DataFrame([new_ticket])
            df = pd.concat([df, new_ticket_df], ignore_index=True)
            df.to_csv(self.tickets_file, index=False)

            return {
                "status": "success",
                "message": "Support ticket created successfully.",
                "ticket_id": new_ticket['ticket_id']
            }

        except Exception as e:
            print(f"Error creating support ticket: {str(e)}")
            return {
                "status": "error",
                "message": "Failed to create support ticket."
            }