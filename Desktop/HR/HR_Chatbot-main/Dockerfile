FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the static files (built React app)
COPY static/ static/

# Create the necessary directory structure
RUN mkdir -p /app/backend/data/chroma_db \
    /app/backend/data/documents \
    /app/data/chroma_db \
    /app/data/documents

# Copy the data directories and their contents
# Backend data directory
COPY backend/data/chat_history_1001.json /app/backend/data/
#COPY backend/data/document_mapping.csv /app/backend/data/
COPY backend/data/tickets.csv /app/backend/data/
COPY backend/data/vacations.csv /app/backend/data/
COPY backend/data/chroma_db/ /app/backend/data/chroma_db/
COPY backend/data/documents/ /app/backend/data/documents/

# Root data directory
COPY data/tickets.csv /app/data/
COPY data/vacations.csv /app/data/
COPY data/chroma_db/ /app/data/chroma_db/
COPY data/documents/ /app/data/documents/

# Copy the backend code and tools
COPY backend/tools/ /app/backend/tools/
COPY backend/agent.py /app/backend/
COPY backend/app.py /app/backend/
COPY backend/config.py /app/backend/
COPY backend/hardcode.py /app/backend/
COPY backend/rag_system.py /app/backend/
COPY backend/test_agent.py /app/backend/
COPY backend/tree.py /app/backend/

EXPOSE 8080


# Set environment variables
ENV PYTHONPATH=/app
ENV FLASK_APP=backend/app.py
ENV PORT=8080

# Change to the directory containing app.py
WORKDIR /app/backend

# Run the application
CMD exec gunicorn --bind :$PORT \
    --workers 1 \
    --threads 8 \
    --timeout 0 \
    --chdir /app \
    --access-logfile - \
    --error-logfile - \
    backend.app:app
