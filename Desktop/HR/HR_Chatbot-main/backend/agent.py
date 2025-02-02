from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_structured_chat_agent, AgentExecutor
from langchain.tools import StructuredTool
from langchain.schema import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import pandas as pd
from datetime import datetime
import os
from typing import Dict, List, Optional
from tools.rag_tool import RAGTool
from tools.vacation_tool import VacationTool
from tools.ticket_tool import TicketTool
import json
from pydantic import BaseModel, Field
from tools.support_ticket_tool import SupportTicketTool
from dotenv import load_dotenv
import config

class VacationRequestSchema(BaseModel):
    employee_id: str = Field(description="The ID of the employee requesting vacation")
    start_date: str = Field(description="The start date of the vacation (YYYY-MM-DD)")
    end_date: str = Field(description="The end date of the vacation (YYYY-MM-DD)")
    request_type: str = Field(description="The type of request, e.g., 'vacation'")

class HRAgent:
    def __init__(self, google_api_key: str, openai_api_key: str, vacations_file: str, tickets_file: str):
        """Initialize the HR Agent with structured chat format"""
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

        # Define tools with improved descriptions
        self.tools = [
            StructuredTool.from_function(
                name="PolicyQuery",
                func=self.rag_tool.query,
                description="يستخدم للإجابة عن أسئلة سياسات الموارد البشرية. المدخلات: سؤال (نص باللغة العربية)"
            ),
            StructuredTool.from_function(
                name="CheckVacationBalance",
                func=self.vacation_tool.check_balance,
                description="يتحقق من رصيد الإجازات. المدخلات: employee_id (نص)"
            ),
            StructuredTool.from_function(
                name="CreateVacationRequest",
                func=self.ticket_tool.create_ticket,
                description="""ينشئ طلب إجازة. المدخلات: قاموس يحتوي على:
                'employee_id': نص
                'start_date': YYYY-MM-DD
                'end_date': YYYY-MM-DD
                'request_type': 'سنوية'/'مرضية'/'طارئة'"""
            ),
            StructuredTool.from_function(
                name="CreateSupportTicket",
                func=self.support_ticket_tool.create_ticket,
                description="""ينشئ تذكرة دعم (بعد موافقة المستخدم). المدخلات: قاموس يحتوي على:
                'employee_id': نص
                'summary': ملخص المشكلة
                'description': تفاصيل المشكلة"""
            )
        ]

        # Create structured chat prompt
        system_template = """أنت مساعد الموارد البشرية. لديك الأدوات التالية:

{tools}

استخدم تنسيق JSON للتحديد الأداة من خلال توفير مفتاح action (اسم الأداة) ومفتاح action_input (مدخلات الأداة).

القيم الصالحة لـ "action": "Final Answer" أو {tool_names}

قدم إجراءً واحداً فقط لكل JSON_BLOB كما يلي:

```
{{
  "action": $TOOL_NAME,
  "action_input": $INPUT
}}
```

تعليمات مهمة:
1. تحقق من رصيد الإجازة قبل إنشاء طلب إجازة
2. احصل على موافقة صريحة قبل إنشاء تذكرة دعم
3. تأكد من صحة جميع التفاصيل قبل إنشاء أي تذكرة
4. استخدم المعلومات من سجل المحادثة عند توفرها

تنسيق التذاكر:
- تذاكر الدعم: ST-XXXX
- تذاكر الإجازة: VT-XXXX"""

        human_template = """{input}

{agent_scratchpad}"""

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", system_template),
            MessagesPlaceholder(variable_name="chat_history", optional=True),
            ("human", human_template),
        ])

        # Initialize structured chat agent
        agent = create_structured_chat_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=self.prompt,
            stop_sequence=True
        )

        # Create agent executor
        self.agent_executor = AgentExecutor(
            agent=agent,
            tools=self.tools,
            verbose=True,
            handle_parsing_errors=True,
            max_iterations=5
        )

        self.active_docs = []

    def process_query(self, message: str, employee_id: Optional[str] = None, metadata: Optional[Dict] = None) -> str:
        """Process user query with structured chat format and history"""
        try:
            # Load chat history
            history = []
            formatted_history = []
            if employee_id:
                history_file = f'data/chat_history_{employee_id}.json'
                try:
                    with open(history_file, 'r', encoding='utf-8') as f:
                        history = json.load(f)
                        formatted_history = [
                            HumanMessage(content=msg["content"]) if msg["type"] == "user"
                            else AIMessage(content=msg["content"])
                            for msg in history
                        ]
                except FileNotFoundError:
                    pass

            # Handle vacation-related queries without employee_id
            if not employee_id and any(
                    keyword in message.lower() for keyword in ["رصيد اجازتي", "كم يوم باقي"]
            ):
                return "يرجى تقديم رقم الموظف الخاص بك للمتابعة"

            # Prepare context for the agent
            context = {
                "input": f"[المستخدم: {employee_id or 'غير معروف'}]\n{message}",
                "chat_history": formatted_history,
                "metadata": metadata or {}
            }

            # Get agent response
            result = self.agent_executor.invoke(context)

            # Save chat history
            if employee_id:
                new_history = history + [
                    {"type": "user", "content": message},
                    {"type": "bot", "content": result['output']}
                ]
                with open(history_file, 'w', encoding='utf-8') as f:
                    json.dump(new_history, f, ensure_ascii=False, indent=2)

            return result.get('output', "عذراً، حدث خطأ أثناء المعالجة. يرجى إعادة المحاولة")

        except Exception as e:
            print(f"Error processing query: {str(e)}")
            return "عذراً، حدث خطأ أثناء معالجة طلبك. الرجاء المحاولة مرة أخرى."

    def add_document(self, filepath: str) -> bool:
        """Add a new document to the RAG system"""
        try:
            result = self.rag_tool.add_document(filepath)
            if result:
                self.active_docs.append(filepath)
            return result
        except Exception as e:
            print(f"Error adding document: {str(e)}")
            return False
        
    def get_all_tickets(self):

        """Reads and returns all tickets from the CSV file, handling NaN values."""

        try:

            df = pd.read_csv(self.ticket_tool.tickets_file)



            # Replace NaN values with appropriate defaults

            df = df.fillna({'description': '', 'manager_id': '', 'response_date': '', 'updated_at': ''})



            tickets = df.to_dict('records')

            return tickets

        except Exception as e:

            print(f"Error reading tickets: {str(e)}")

            return []

    def update_active_documents(self, document_list: List[str]) -> bool:
        """Update the list of active documents"""
        try:
            success = self.rag_tool.update_active_documents(document_list)
            if success:
                self.active_docs = document_list
            return success
        except Exception as e:
            print(f"Error updating active documents: {str(e)}")
            return False

    def get_vacation_balance(self, employee_id: str) -> Dict:
        """Get vacation balance for an employee"""
        try:
            return self.vacation_tool.check_balance(employee_id)
        except Exception as e:
            print(f"Error getting vacation balance: {str(e)}")
            return {"error": "Could not retrieve vacation balance"}

    def create_vacation_ticket(self, employee_id: str, start_date: str, end_date: str, request_type: str, notes: str = "") -> Dict:
        """Create a new vacation request ticket"""
        try:
            return self.ticket_tool.create_ticket(employee_id, start_date, end_date, request_type, notes)
        except Exception as e:
            print(f"Error creating vacation ticket: {str(e)}")
            return {"error": "Could not create vacation ticket"}

    def get_employee_tickets(self, employee_id: str) -> Dict:
        """Get all tickets for an employee"""
        try:
            return self.ticket_tool.get_employee_tickets(employee_id)
        except Exception as e:
            print(f"Error getting employee tickets: {str(e)}")
            return {"error": "Could not retrieve tickets"}

def main():
    """Test the improved HR Agent"""
    load_dotenv()
    google_api_key = os.getenv('GOOGLE_API_KEY')
    openai_api_key = os.getenv('OPENAI_API_KEY')

    try:
        # Initialize agent
        agent = HRAgent(
            google_api_key=google_api_key,
            openai_api_key=openai_api_key,
            vacations_file='data/vacations.csv',
            tickets_file='data/tickets.csv'
        )

        # Test conversation flows
        test_conversations = [
            # Vacation request flow
            [
                ("اريد ان اقدم طلب اجازة", "1001"),
                ("تاريخ البدء 2025-07-01", "1001"),
                ("تاريخ الانتهاء 2025-07-10 ونوعها سنوية", "1001"),
                ("نعم", "1001")
            ],
            # Support ticket flow
            [
                ("ما هي سياسة العمل عن بعد؟", "1001"),
                ("لا هذا غير مفيد", "1001"),
                ("نعم أريد التحدث مع موظف", "1001")
            ]
        ]

        for conversation in test_conversations:
            print("\nTesting new conversation flow:")
            for message, emp_id in conversation:
                print(f"\nUser ({emp_id}): {message}")
                response = agent.process_query(message, employee_id=emp_id)
                print(f"Agent: {response}")

    except Exception as e:
        print(f"Test failed: {str(e)}")

if __name__ == "__main__":
    main()