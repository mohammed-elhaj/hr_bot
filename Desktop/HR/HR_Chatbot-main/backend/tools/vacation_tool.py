# tools/vacation_tool.py
import pandas as pd
from typing import Dict
from datetime import datetime

class VacationTool:
    """Tool for checking and managing employee vacation balances"""
    
    def __init__(self, vacations_file: str):
        """Initialize Vacation Tool with the CSV file path."""
        self.vacations_file = vacations_file
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        """Create vacations file if it doesn't exist."""
        try:
            df = pd.read_csv(self.vacations_file)
        except FileNotFoundError:
            # Create new file with structure
            df = pd.DataFrame(columns=[
                'employee_id', 'name', 'position', 'department',
                'annual_balance', 'used_days', 'remaining_balance',
                'last_updated'
            ])
            df.to_csv(self.vacations_file, index=False)

    def check_balance(self, employee_id: str) -> Dict:
        """Check vacation balance for an employee."""
        try:
            df = pd.read_csv(self.vacations_file)
            employee = df[df['employee_id'] == int(employee_id)]
            
            if employee.empty:
                return {
                    "error": "لم يتم العثور على الموظف",
                    "status": "not_found"
                }
            
            return {
                "status": "success",
                "employee_id": str(employee_id),
                "name": employee.iloc[0]['name'],
                "annual_balance": float(employee.iloc[0]['annual_balance']),
                "used_days": float(employee.iloc[0]['used_days']),
                "remaining_balance": float(employee.iloc[0]['remaining_balance']),
                "last_updated": employee.iloc[0]['last_updated']
            }
            
        except Exception as e:
            print(f"Error checking balance: {str(e)}")
            return {
                "error": "حدث خطأ في التحقق من الرصيد",
                "status": "error"
            }

    def update_balance(self, employee_id: str, days_used: float) -> Dict:
        """Update vacation balance after request approval."""
        try:
            df = pd.read_csv(self.vacations_file)
            mask = df['employee_id'] == int(employee_id)
            
            if not any(mask):
                return {
                    "error": "لم يتم العثور على الموظف",
                    "status": "not_found"
                }
            
            # Update balance
            df.loc[mask, 'used_days'] += days_used
            df.loc[mask, 'remaining_balance'] -= days_used
            df.loc[mask, 'last_updated'] = datetime.now().strftime('%Y-%m-%d')
            
            # Save changes
            df.to_csv(self.vacations_file, index=False)
            
            return {
                "status": "success",
                "message": "تم تحديث الرصيد بنجاح"
            }
            
        except Exception as e:
            print(f"Error updating balance: {str(e)}")
            return {
                "error": "حدث خطأ في تحديث الرصيد",
                "status": "error"
            }