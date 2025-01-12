# tools/rag_tool.py
from typing import Dict, List, Optional
import os
from rag_system import HRRAGSystem

class RAGTool:
    """Tool for handling HR document queries using RAG system"""
    
    def __init__(self, google_api_key: str, openai_api_key: str):
        """Initialize RAG Tool with configurations."""
        self.google_api_key = google_api_key
        self.openai_api_key = openai_api_key
        self.rag_system = HRRAGSystem(google_api_key, openai_api_key)
        self.active_docs = []

    def query(self, question: str) -> str:
        """Query the RAG system with a question."""
        try:
            response = self.rag_system.query(question)
            return response.get('answer', 'عذراً، لم أستطع العثور على إجابة مناسبة.')
        except Exception as e:
            print(f"Error in RAG query: {str(e)}")
            return "عذراً، حدث خطأ في معالجة السؤال."

    def add_document(self, filepath: str) -> bool:
        """Add a new document to the RAG system."""
        try:
            collection_id = self.rag_system.process_document(filepath)
            if collection_id:
                self.active_docs.append(filepath)
                return True
            return False
        except Exception as e:
            print(f"Error adding document: {str(e)}")
            return False

    def update_active_documents(self, document_list: List[str]) -> bool:
        """Update which documents are active in the system."""
        try:
            # Process any new documents
            for doc in document_list:
                if doc not in self.active_docs:
                    self.add_document(doc)
            
            # Update active documents
            self.active_docs = document_list
            return True
        except Exception as e:
            print(f"Error updating active documents: {str(e)}")
            return False
        
    def reinitialize_rag_system(self):
        """Reinitializes the RAG system."""
        self.rag_system = HRRAGSystem(self.google_api_key, self.openai_api_key)
        print("RAG system reinitialized.")