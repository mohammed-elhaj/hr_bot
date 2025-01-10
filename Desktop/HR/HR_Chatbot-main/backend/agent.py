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
from tools.support_ticket_tool import SupportTicketTool
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI



class VacationRequestSchema(BaseModel):
    employee_id: str = Field(description="The ID of the employee requesting vacation")
    start_date: str = Field(description="The start date of the vacation (YYYY-MM-DD)")
    end_date: str = Field(description="The end date of the vacation (YYYY-MM-DD)")
    request_type: str = Field(description="The type of request, e.g., 'vacation'")
class HRAgent:
    def __init__(self, google_api_key: str, openai_api_key: str, vacations_file: str, tickets_file: str):
        """Initialize the HR Agent with necessary tools and configurations."""
        self.google_api_key = google_api_key
        self.openai_api_key = openai_api_key
        
        # Initialize Tools
        self.rag_tool = RAGTool(
            google_api_key=self.google_api_key,
            openai_api_key=self.openai_api_key
        )
        
        self.vacation_tool = VacationTool(vacations_file)
        self.ticket_tool = TicketTool(tickets_file)
        self.support_ticket_tool = SupportTicketTool(tickets_file)

        # Initialize Gemini LLM
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            temperature=0.3,
            google_api_key=self.google_api_key
        )

        # Define tools for the agent
        self.tools = [
            StructuredTool.from_function(
                name="PolicyQuery",
                func=self.rag_tool.query,
                description="Useful for answering questions about HR policies and regulations. Input should be the policy-related question in arabic langauge as a string."
            ),
            StructuredTool.from_function(
                name="CheckVacationBalance",
                func=self.vacation_tool.check_balance,
                description="Check an employee's vacation balance. Input should be the employee_id as a string."
            ),
            StructuredTool.from_function(
                name="CreateVacationRequest",
                func=self.ticket_tool.create_ticket,
                description="""Create a vacation request ticket.
                Input should be a dictionary with keys:
                'employee_id' (string), 'start_date' (YYYY-MM-DD),
                'end_date' (YYYY-MM-DD), and 'request_type' (string, must be one of: 'annual', 'sick', 'emergency')."""
            ),
            # Add the new CreateSupportTicket tool
            StructuredTool.from_function(
                name="CreateSupportTicket",
                func=self.support_ticket_tool.create_ticket,
                description="""Creates a support ticket for HR assistance when the chatbot cannot answer a question or when the user is not satisfied with the answer.
                Input should be a dictionary with keys:
                'employee_id' (string): The ID of the employee,
                'summary' (string): A brief summary of the user's issue or question,
                'description' (string): A more detailed description, potentially including the user's original question and the chatbot's previous answer."""
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

        self.system_prompt = """أنت مساعد الموارد البشرية. مهمتك هي:

        1. الإجابة على أسئلة الموظفين حول سياسات وأنظمة الموارد البشرية باستخدام أداة "PolicyQuery".
        2. مساعدة الموظفين في التحقق من رصيد إجازاتهم باستخدام أداة "CheckVacationBalance".
        3. مساعدة الموظفين في تقديم طلبات الإجازة باستخدام أداة "CreateVacationRequest".
        4. إنشاء تذكرة دعم  باستخدام أداة "CreateSupportTicket" إذا لم تتمكن من الإجابة على سؤال ، أو إذا لم يكن المستخدم راضيًا عن الإجابة المقدمة من أداة "PolicyQuery".

        تعليمات:

        - كن ودوداً ومهنياً.
        - استخدم المعلومات من الوثائق المتاحة فقط عبر أداة "PolicyQuery".
        - إذا لم تجد المعلومات في الوثائق باستخدام "PolicyQuery" ، اعتذر بوضوح وأخبر المستخدم أنه سيتم إنشاء تذكرة دعم لطلب المساعدة من الموارد البشرية باستخدام أداة "CreateSupportTicket".
        - إذا لم تكن متأكداً من طلب المستخدم، اطلب توضيحاً بطريقة مهذبة. على سبيل المثال: "هل يمكنك إعادة صياغة سؤالك؟" أو "هل تقصد ...؟".
        - عند التعامل مع الإجازات، تحقق دائماً من الرصيد باستخدام أداة "CheckVacationBalance" قبل إنشاء طلب الإجازة باستخدام أداة "CreateVacationRequest".
        - إذا كان طلب المستخدم يتعلق بالتحقق من رصيد الإجازة أو تقديم طلب إجازة، فاستخدم الأدوات المخصصة لذلك ("CheckVacationBalance" و "CreateVacationRequest") قبل أي إجراء آخر.
        - إذا أعرب المستخدم عن عدم رضاه عن إجابة "PolicyQuery" ، فاعرض إنشاء تذكرة دعم باستخدام "CreateSupportTicket". قم بتضمين ملخص لسؤال المستخدم والجواب المقدم في التذكرة.
        - إذا كانت الأداة تتطلب "employee_id" ولم يتم توفيره، فاطلب من المستخدم "employee_id" الخاص به قبل استخدام الأداة. لا تتابع استخدام الاداة بدون 'employee_id'. مثال: "يرجى تقديم رقم الموظف الخاص بك حتى أتمكن من التحقق من رصيد إجازتك."
        - إذا كان المستخدم يطلب إنشاء طلب إجازة، فاستخرج تاريخ البدء وتاريخ الانتهاء ونوع الطلب. قم بتأكيد هذه التفاصيل مع المستخدم قبل إنشاء التذكرة. مثال: "أنت تطلب إجازة من نوع 'سنوية' ، من تاريخ: 2025-07-01 إلى تاريخ: 2025-07-10. هل هذا صحيح؟"
        - عند توفرها، استخدم البيانات الوصفية metadata المقدمة، وخاصة "documentId" لتضييق نطاق البحث باستخدام أداة "PolicyQuery".

        أوصاف الأداة:
        - PolicyQuery: مفيد للإجابة على الأسئلة المتعلقة بسياسات وأنظمة الموارد البشرية. الإدخال: السؤال (سلسلة نصية).
        - CheckVacationBalance: يتحقق من رصيد إجازات الموظف. الإدخال: employee_id (سلسلة نصية).
        - CreateVacationRequest: ينشئ تذكرة طلب إجازة. الإدخال: قاموس يحتوي على المفاتيح: 'employee_id' (سلسلة نصية) ، 'start_date' (YYYY-MM-DD) ، 'end_date' (YYYY-MM-DD) ، 'request_type' (سلسلة نصية ، يجب أن تكون واحدة من: 'annual' ، 'sick' ، 'طارئة').
        - CreateSupportTicket: ينشئ تذكرة دعم لمساعدة الموارد البشرية عندما لا يستطيع chatbot الإجابة على سؤال أو عندما لا يكون المستخدم راضيًا عن الإجابة.
                        الإدخال: قاموس يحتوي على المفاتيح:
                        'employee_id' (سلسلة نصية): معرف الموظف،
                        'summary' (سلسلة نصية): ملخص موجز لمشكلة المستخدم أو سؤاله،
                        'description' (سلسلة نصية): وصف أكثر تفصيلاً، من المحتمل أن يتضمن سؤال المستخدم الأصلي وإجابة chatbot السابقة.
        """

    def process_query(self, message: str, employee_id: Optional[str] = None, metadata: Optional[Dict] = None) -> str:
        """Process a user query and return the response."""
        try:
            # Check if the user is asking for vacation balance and employee_id is not provided
            if not employee_id and any(
                    keyword in message.lower() for keyword in ["رصيد اجازتي", "كم يوم باقي"]
            ):
                return "يرجى تقديم رقم الموظف الخاص بك حتى أتمكن من التحقق من رصيد إجازتك."

            # Add context to the message if employee_id is provided
            if employee_id:
                context_message = f"Employee ID: {employee_id}\nQuery: {message}"
            else:
                context_message = message

            # Get agent response
            result = self.agent.invoke({
                "input": context_message,
                "chat_history": [],
                "system_prompt": self.system_prompt,
                "metadata": metadata or {}
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
    
    def get_employee_tickets(self, employee_id: str) -> Dict:
        """Get all tickets for an employee."""
        try:
            return self.ticket_tool.get_employee_tickets(employee_id)
        except Exception as e:
            print(f"Error getting tickets: {str(e)}")
            return {"error": "Could not retrieve tickets"}

def main():
    load_dotenv()
    UPLOAD_FOLDER = 'data/documents'
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'txt'}
    google_api_key = os.getenv('GOOGLE_API_KEY')
    openai_api_key = os.getenv('OPENAI_API_KEY')
    

    """Test the HR Agent"""
    try:
        # Initialize agent
        agent = HRAgent(
    google_api_key=google_api_key,
    openai_api_key=openai_api_key,
    vacations_file='data/vacations.csv',
    tickets_file='data/tickets.csv'
)

        # Test queries
        test_queries = [
            " يقسم المعينون على بند الأجور إلى المجموعات الآتية؟",  # Should use PolicyQuery
            "ما هو نص المادة الاولى  ",  # Should use CheckVacationBalance
            " ما هي مجموعة العاديين  ",  # Should use CreateVacationRequest
            "ما هي سياسة العمل عن بعد؟",  # Should use PolicyQuery, then offer ticket
            "لا, هذا غير مفيد",  # Should offer to create a ticket after a previous query
            "اريد التحدث مع احد موظفي الموارد البشرية",  # Should create a support ticket
            "اريد تقديم طلب اجازة من 2025-10-11 الى 2025-10-15 نوعها سنوية", # Should extract info and use CreateVacationRequest,
            "My employee id is 1001, what is my vacation balance?", # Should use CheckVacationBalance with the extracted ID
            "Please tell me my remaining vacation days?", # Should ask for employee ID if not provided
        ]

        for query in test_queries:
            print(f"\nQuery: {query}")
            response = agent.process_query(query, employee_id="1001") # Provide a test employee ID for now
            print(f"Response: {response}")

    except Exception as e:
        print(f"Error in main: {str(e)}")

if __name__ == "__main__":
    main()