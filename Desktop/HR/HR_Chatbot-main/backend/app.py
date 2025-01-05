from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from agent import HRAgent
import pandas as pd
from dotenv import load_dotenv
from datetime import datetime
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'data/documents'
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'txt'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize HR Agent
agent = HRAgent(
    google_api_key=os.getenv('GOOGLE_API_KEY'),
    vacations_file='data/vacations.csv',
    tickets_file='data/tickets.csv'
)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
           
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # Simple mock users for MVP
    mock_users = {
        'user1': {
            'id': '1001',
            'name': 'محمد احمد',
            'role': 'employee',
            'employee_id': '1001'
        }
        # Add more mock users as needed
    }
    
    if username in mock_users:
        return jsonify({
            'status': 'success',
            'user': mock_users[username]
        })
    else:
        return jsonify({
            'status': 'error',
            'message': 'Invalid credentials'
        }), 401

@app.route('/api/chat/history/<employee_id>', methods=['GET'])
def get_chat_history(employee_id):
    try:
        # Try to load existing history
        history_file = f'data/chat_history_{employee_id}.json'
        try:
            with open(history_file, 'r', encoding='utf-8') as f:
                history = json.load(f)
        except FileNotFoundError:
            history = []
        
        return jsonify({
            'status': 'success',
            'history': history
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500



@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message', '').strip()
        employee_id = data.get('employee_id')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Process message through agent
        response = agent.process_query(message, employee_id)
        
        # Save to chat history if employee_id is provided
        if employee_id:
            history_file = f'data/chat_history_{employee_id}.json'
            try:
                with open(history_file, 'r', encoding='utf-8') as f:
                    history = json.load(f)
            except FileNotFoundError:
                history = []
            
            # Add new messages
            timestamp = datetime.now().isoformat()
            history.append({
                'id': str(len(history) + 1),
                'content': message,
                'type': 'user',
                'timestamp': timestamp,
                'status': 'sent'
            })
            history.append({
                'id': str(len(history) + 2),
                'content': response,
                'type': 'bot',
                'timestamp': timestamp,
                'status': 'sent'
            })
            
            # Save updated history
            with open(history_file, 'w', encoding='utf-8') as f:
                json.dump(history, f, ensure_ascii=False, indent=2)
        
        return jsonify({
            'response': response,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/api/admin/upload', methods=['POST'])
def upload_document():
    """Handle document uploads"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
            
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the file
        file.save(filepath)
        
        # Process the document with RAG system
        agent.add_document(filepath)
        
        return jsonify({
            'message': 'Document uploaded successfully',
            'filename': filename
        })
        
    except Exception as e:
        print(f"Error in upload endpoint: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/api/admin/documents', methods=['GET'])
def list_documents():
    """List all available documents"""
    try:
        files = []
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            if allowed_file(filename):
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                files.append({
                    'name': filename,
                    'size': os.path.getsize(filepath),
                    'uploaded': datetime.fromtimestamp(
                        os.path.getctime(filepath)
                    ).isoformat()
                })
                
        return jsonify({'documents': files})
        
    except Exception as e:
        print(f"Error listing documents: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/api/admin/documents', methods=['POST'])
def update_active_documents():
    """Update which documents are active in the RAG system"""
    try:
        data = request.json
        document_list = data.get('documents', [])
        
        # Update active documents in the agent
        agent.update_active_documents(document_list)
        
        return jsonify({
            'message': 'Active documents updated successfully',
            'active_documents': document_list
        })
        
    except Exception as e:
        print(f"Error updating active documents: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/api/employee/vacation-balance/<employee_id>', methods=['GET'])
def get_vacation_balance(employee_id):
    """Get vacation balance for an employee"""
    try:
        balance = agent.get_vacation_balance(employee_id)
        return jsonify(balance)
        
    except Exception as e:
        print(f"Error getting vacation balance: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/api/employee/vacation-request', methods=['POST'])
def submit_vacation_request():
    """Submit a new vacation request"""
    try:
        data = request.json
        employee_id = data.get('employee_id')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        request_type = data.get('request_type')
        notes = data.get('notes', '')

        if not all([employee_id, start_date, end_date, request_type]):
            return jsonify({'error': 'Missing required fields'}), 400

        ticket = agent.create_vacation_ticket(
            employee_id=employee_id,
            start_date=start_date,
            end_date=end_date,
            request_type=request_type,
            notes=notes
        )
        return jsonify(ticket)

    except Exception as e:
        print(f"Error submitting vacation request: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    # Load initial documents if any exist
    try:
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            if allowed_file(filename):
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                agent.add_document(filepath)
        print("Initial documents loaded")
    except Exception as e:
        print(f"Error loading initial documents: {str(e)}")
    
    app.run(debug=True, port=5000)