from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import initialize_agent, Tool
from langchain.tools import StructuredTool
from langchain.agents import AgentType , StructuredChatAgent
from langchain.schema import HumanMessage
import pandas as pd
from datetime import datetime
import os
from typing import Dict, List, Optional
from tools.rag_tool import RAGTool
from tools.vacation_tool import VacationTool
from tools.ticket_tool import TicketTool
import json 
from langchain.tools import StructuredTool
from pydantic import BaseModel, Field

class VacationRequestSchema(BaseModel):
    employee_id: str = Field(description="The ID of the employee requesting vacation")
    start_date: str = Field(description="The start date of the vacation (YYYY-MM-DD)")
    end_date: str = Field(description="The end date of the vacation (YYYY-MM-DD)")
    request_type: str = Field(description="The type of request, e.g., 'vacation'")
class HRAgent:
    def __init__(self, google_api_key: str, vacations_file: str, tickets_file: str):
        """Initialize the HR Agent with necessary tools and configurations."""
        self.api_key = google_api_key
        
        # Initialize Tools
        self.rag_tool = RAGTool(google_api_key)
        self.vacation_tool = VacationTool(vacations_file)
        self.ticket_tool = TicketTool(tickets_file)

        # Initialize Gemini LLM
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=google_api_key,
            temperature=0.3,
            convert_system_message_to_human=True
        )

        # Define tools for the agent
        self.tools = [
            StructuredTool.from_function(
                name="PolicyQuery",
                func=self.rag_tool.query,
                description="Useful for answering questions about HR policies and regulations. Input should be the policy-related question as a string."
                ),
            StructuredTool.from_function(
                name="CheckVacationBalance",
                func=self.vacation_tool.check_balance,
                description="Check an employee's vacation balance. Input should be the employee_id as a string."
            ),
            StructuredTool.from_function(
                name="CreateVacationRequest",
                func=self.ticket_tool.create_ticket,
                description="Create a vacation request ticket. Input should be a dictionary with keys: 'employee_id', 'start_date' (YYYY-MM-DD), 'end_date' (YYYY-MM-DD), and 'request_type'."
            )
        ]

        # Initialize the agent
        self.agent = initialize_agent(
            self.tools,
            self.llm,
            agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True,
            handle_parsing_errors=True,
            max_iterations=3
        )

        # Define system prompt for the agent
        self.system_prompt = """أنت مساعد الموارد البشرية. مهمتك هي:
1. الإجابة على أسئلة الموظفين حول سياسات وأنظمة الموارد البشرية
2. مساعدة الموظفين في التحقق من رصيد إجازاتهم
3. مساعدة الموظفين في تقديم طلبات الإجازة

عند الرد على الأسئلة:
- كن ودوداً ومهنياً
- استخدم المعلومات من الوثائق المتاحة فقط
- إذا لم تكن متأكداً، اطلب توضيحاً
- عند التعامل مع الإجازات، تحقق دائماً من الرصيد قبل إنشاء الطلب"""

    def process_query(self, message: str, employee_id: Optional[str] = None) -> str:
        """Process a user query and return the response."""
        try:
            # Add context to the message if employee_id is provided
            if employee_id:
                context_message = f"Employee ID: {employee_id}\nQuery: {message}"
            else:
                context_message = message

            # Get agent response
            result = self.agent.invoke({
                "input": context_message,
                "chat_history": [],  # Could be extended to support chat history
                "system_prompt": self.system_prompt
            })

            return result.get('output', "عذراً، لم أستطع معالجة طلبك. الرجاء المحاولة مرة أخرى.")

        except Exception as e:
            print(f"Error processing query: {str(e)}")
            return "عذراً، حدث خطأ أثناء معالجة طلبك. الرجاء المحاولة مرة أخرى."

    def add_document(self, filepath: str) -> bool:
        """Add a new document to the RAG system."""
        try:
            return self.rag_tool.add_document(filepath)
        except Exception as e:
            print(f"Error adding document: {str(e)}")
            return False

    def update_active_documents(self, document_list: List[str]) -> bool:
        """Update the list of active documents in the RAG system."""
        try:
            return self.rag_tool.update_active_documents(document_list)
        except Exception as e:
            print(f"Error updating active documents: {str(e)}")
            return False

    def get_vacation_balance(self, employee_id: str) -> Dict:
        """Get vacation balance for an employee."""
        try:
            return self.vacation_tool.check_balance(employee_id)
        except Exception as e:
            print(f"Error getting vacation balance: {str(e)}")
            return {"error": "Could not retrieve vacation balance"}

    def create_vacation_ticket(self, employee_id: str, start_date: str, end_date: str, request_type: str, notes: str = "") -> Dict:
        """Create a new vacation request ticket."""
        return self.ticket_tool.create_ticket(employee_id, start_date, end_date, request_type, notes)

def main():
    """Test the HR Agent"""
    try:
        # Initialize agent
        agent = HRAgent(
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            vacations_file="data/vacations.csv",
            tickets_file="data/tickets.csv"
        )

        # Test queries
        test_queries = [
            "ما هي سياسة الإجازات السنوية؟",
            "كم رصيد إجازاتي المتبقي؟",
            "أريد تقديم طلب إجازة لمدة 5 أيام"
        ]

        for query in test_queries:
            print(f"\nQuery: {query}")
            response = agent.process_query(query, employee_id="1001")
            print(f"Response: {response}")

    except Exception as e:
        print(f"Error in main: {str(e)}")

if __name__ == "__main__":
    main()