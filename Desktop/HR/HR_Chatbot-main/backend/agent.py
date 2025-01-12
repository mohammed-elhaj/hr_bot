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
import config



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
        
        self.active_docs = [] # Initialize active_docs


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
    
    def _create_mapping(self, document_id: str, collection_id: str):
        """Creates a new mapping entry in the CSV file."""
        try:
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            new_mapping = pd.DataFrame([{
                'document_id': document_id,
                'collection_id': collection_id,
                'created_at': timestamp
            }])

            if not os.path.exists(config.DOCUMENT_MAPPING_FILE):
                new_mapping.to_csv(config.DOCUMENT_MAPPING_FILE, index=False)
            else:
                mapping_df = pd.read_csv(config.DOCUMENT_MAPPING_FILE)
                mapping_df = pd.concat([mapping_df, new_mapping], ignore_index=True)
                mapping_df.to_csv(config.DOCUMENT_MAPPING_FILE, index=False)

        except Exception as e:
            print(f"Error creating mapping: {str(e)}")

    def _get_collection_id(self, document_id: str) -> str | None:
        """Retrieves the collection_id for a given document_id."""
        try:
            if not os.path.exists(config.DOCUMENT_MAPPING_FILE):
                return None

            mapping_df = pd.read_csv(config.DOCUMENT_MAPPING_FILE)
            mapping = mapping_df[mapping_df['document_id'] == document_id]

            if not mapping.empty:
                return mapping.iloc[0]['collection_id']
            else:
                return None

        except Exception as e:
            print(f"Error getting collection ID: {str(e)}")
            return None

    def _delete_mapping(self, document_id: str):
        """Deletes a mapping entry from the CSV file."""
        try:
            if not os.path.exists(config.DOCUMENT_MAPPING_FILE):
                return

            mapping_df = pd.read_csv(config.DOCUMENT_MAPPING_FILE)
            mapping_df = mapping_df[mapping_df['document_id'] != document_id]
            mapping_df.to_csv(config.DOCUMENT_MAPPING_FILE, index=False)

        except Exception as e:
            print(f"Error deleting mapping: {str(e)}")

    def add_document(self, filepath: str) -> bool:
        """Add a new document to the RAG system."""
        try:
            collection_id = self.rag_tool.rag_system.process_document(filepath)
            if collection_id:
                document_id = os.path.basename(filepath)  # Use filename as document_id
                self._create_mapping(document_id, collection_id)  # Create the mapping
                self.active_docs.append(filepath)
                return True
            return False
        except Exception as e:
            print(f"Error adding document: {str(e)}")
            return False

    def delete_document_and_collection(self, document_id: str) -> bool:
        """Deletes a document and its associated ChromaDB collection.

        Args:
            document_id: The ID of the document to delete (filename).

        Returns:
            True if successful, False otherwise.
        """
        try:
            # 1. Get the collection_id from the mapping
            collection_id = self._get_collection_id(document_id)
            if collection_id is None:
                print(f"No mapping found for document ID: {document_id}")
                return False

            # 2. Delete the ChromaDB collection
            if self.rag_tool.rag_system.remove_collection(collection_id):
                print(f"collection {collection_id} deleted successfully")

            # 3. Delete the mapping
            self._delete_mapping(document_id)
            print(f"Mapping for document {document_id} deleted successfully.")

            # 4. Delete the document file
            document_path = os.path.join(self.rag_tool.rag_system.base_path, 'documents', document_id)
            if os.path.exists(document_path):
                os.remove(document_path)
                print(f"Document file {document_path} deleted successfully.")
            else:
                print(f"Document file not found: {document_path}")

            return True

        except Exception as e:
            print(f"Error deleting document and collection: {str(e)}")
            return False
    

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