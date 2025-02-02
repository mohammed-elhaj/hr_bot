from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from agent import HRAgent
import pandas as pd
from dotenv import load_dotenv
from datetime import datetime
import json
from tools.support_ticket_tool import SupportTicketTool
import shutil



# Load environment variables
load_dotenv()
app = Flask('__name__', static_folder='static', static_url_path='')
#app = Flask(__name__)
CORS(app)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Configurationag
UPLOAD_FOLDER = 'data/documents'
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'txt'}
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize HR Agent
agent = HRAgent(
    google_api_key=os.getenv('GOOGLE_API_KEY'),
    openai_api_key=os.getenv('OPENAI_API_KEY'),
    vacations_file='data/vacations.csv',
    tickets_file='data/tickets.csv'
)

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")

           
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
    },
    'admin': {
        'id': '9001',
        'name': 'Admin User',
        'role': 'admin',
        'employee_id': '9001'
    },
    'user2': {
        'id': '1002',
        'name': 'سارة احمد',
        'role': 'employee',
        'employee_id': '1002'
    }
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
        employee_id = data.get('type')
        
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

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/admin/upload', methods=['POST'])
def upload_document():
    """Handle document uploads"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'لم يتم توفير ملف', 'message': 'الرجاء إرسال ملف كجزء من الطلب'}), 400

        file = request.files['file']
        file_type = request.form.get('fileType')  # Get file type from form data

        if file.filename == '':
            return jsonify({'error': 'لم يتم اختيار ملف', 'message': 'الرجاء اختيار ملف للرفع'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'نوع الملف غير مسموح به', 'message': 'الأنواع المسموح بها هي: PDF، DOCX، DOC، TXT'}), 400

        # Check file size
        file.seek(0, os.SEEK_END)  # Go to the end of the file
        file_length = file.tell()  # Get the file size
        file.seek(0)  # Rewind to the beginning
        if file_length > app.config['MAX_CONTENT_LENGTH']:
            return jsonify({'error': 'حجم الملف كبير جداً', 'message': f'الحد الأقصى لحجم الملف هو {app.config["MAX_CONTENT_LENGTH"] / (1024 * 1024)} ميجابايت'}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Save the file
        file.save(filepath)
        
        # Get the timestamp when the file was uploaded
        uploaded_at = datetime.now().isoformat()

        # Process the document with RAG system
        agent.add_document(filepath)

        # Prepare document metadata
        document_metadata = {
            'id': filename,  # Using filename as a temporary ID; you might want to generate a unique ID
            'title': filename,
            'fileType': file_type,  # Use the file type from form data
            'size': file_length,
            'uploadedBy': 'user_id',  # Replace with actual user ID if you have authentication
            'uploadedAt': uploaded_at,
            'status': 'processing',  # You can update this status after RAG processing
            'lastModified': uploaded_at
        }

        return jsonify({
            'message': 'تم رفع المستند بنجاح',
            'filename': filename,
            'document': document_metadata,
            'status':'success'
        }), 200

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
        
@app.route('/api/employee/vacation-requests/<employee_id>', methods=['GET'])
def get_vacation_requests(employee_id):
    """Get list of vacation requests for an employee"""
    try:
        requests = agent.get_employee_tickets(employee_id)  # Assuming you have a method like this in your agent
        if requests["status"] == "success":
            return jsonify({
                'status': 'success',
                'data': requests["tickets"] # Assuming your agent returns data in this format
            })
        else:
            return jsonify({'error': requests["error"], 'status': 'error'}), 500

    except Exception as e:
        print(f"Error getting vacation requests: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/api/employee/vacation-request', methods=['POST'])
def submit_vacation_request():
    """Submit a new vacation request"""
    try:
        data = request.json
        employee_id = data.get('type')
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
        
@app.route('/api/admin/tickets', methods=['GET'])
def admin_get_tickets():
    """Endpoint to retrieve all tickets (for admin users)."""
    try:
        tickets = agent.get_all_tickets()
        print("Raw tickets from CSV:", tickets)
        
        # Clean and process the tickets data
        processed_tickets = []
        for ticket in tickets:
            # Convert 'nan' and NaN values to None/null
            processed_ticket = {
                'ticket_id': str(ticket.get('ticket_id', '')),
                'employee_id': str(ticket.get('employee_id', '')),
                'request_type': str(ticket.get('request_type')) if ticket.get('request_type') and ticket.get('request_type') != 'nan' else None,
                'start_date': str(ticket.get('start_date')) if ticket.get('start_date') and ticket.get('start_date') != 'nan' else None,
                'end_date': str(ticket.get('end_date')) if ticket.get('end_date') and ticket.get('end_date') != 'nan' else None,
                'days_count': float(ticket.get('days_count')) if ticket.get('days_count') and not pd.isna(ticket.get('days_count')) else None,
                'status': str(ticket.get('status', 'pending')),
                'manager_id': str(ticket.get('manager_id')) if ticket.get('manager_id') and ticket.get('manager_id') != 'nan' else None,
                'request_date': str(ticket.get('request_date')) if ticket.get('request_date') and ticket.get('request_date') != 'nan' else None,
                'response_date': str(ticket.get('response_date')) if ticket.get('response_date') and ticket.get('response_date') != 'nan' else None,
                'notes': str(ticket.get('notes')) if ticket.get('notes') and ticket.get('notes') != 'nan' else None,
                'summary': str(ticket.get('summary')) if ticket.get('summary') and ticket.get('summary') != 'nan' else None,
                'description': str(ticket.get('description')) if ticket.get('description') and ticket.get('description') != 'nan' else None,
                'created_at': str(ticket.get('created_at')) if ticket.get('created_at') and ticket.get('created_at') != 'nan' else None,
                'updated_at': str(ticket.get('updated_at')) if ticket.get('updated_at') and ticket.get('updated_at') != 'nan' else None
            }
            processed_tickets.append(processed_ticket)

        return jsonify({
            'tickets': processed_tickets,
            'status': 'success'
        })

    except Exception as e:
        print(f"Error getting tickets: {str(e)}")
        return jsonify({
            'error': 'Could not retrieve tickets',
            'status': 'error'
        }), 500
    
@app.route('/api/admin/documents/<document_id>', methods=['DELETE'])
def delete_document(document_id):
    """Endpoint to delete a document and its associated ChromaDB collection."""
    try:
        # In a real app, you'd verify the user's role here (admin).

        # Use the document_id (filename) to delete the document and collection
        if agent.delete_document_and_collection(document_id):
            return jsonify({'message': 'Document and associated collection deleted', 'status': 'success'})
        else:
            return jsonify({'error': 'Could not delete document or collection', 'status': 'error'}), 500

    except Exception as e:
        print(f"Error deleting document: {str(e)}")
        return jsonify({'error': 'Could not delete document', 'status': 'error'}), 500

if __name__ == '__main__':
    # Load initial documents if any exist
    try:
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            if allowed_file(filename):
                print(f"Processing file: {filename}")
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                agent.add_document(filepath)
        print("Initial documents loaded")
    except Exception as e:
        print(f"Error loading initial documents: {str(e)}")
    
    #app.run( port=5000)
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
    
    