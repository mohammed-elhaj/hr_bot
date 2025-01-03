# config.py

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Keys
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Base Paths
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"

# Document paths
DOCUMENTS_DIR = DATA_DIR / "documents"
CHROMA_DIR = DATA_DIR / "chroma_db"

# CSV file paths
VACATIONS_FILE = DATA_DIR / "vacations.csv"
TICKETS_FILE = DATA_DIR / "tickets.csv"

# Ensure directories exist
DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)
CHROMA_DIR.mkdir(parents=True, exist_ok=True)

# RAG Configuration
RAG_CONFIG = {
    "chunk_size": 500,
    "chunk_overlap": 50,
    "model_name": "gemini-pro",
    "temperature": 0.3
}

# Default admin credentials (for demo purposes)
DEFAULT_ADMIN = {
    "username": "admin",
    "password": "admin123"  # In production, use proper authentication
}

# File upload settings
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'txt'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size