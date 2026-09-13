from flask import Blueprint, request, jsonify
from services.auth_service import authenticate_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'success': False, 'message': 'Email and password required'}), 400
        
    auth_result = authenticate_user(data['email'], data['password'])
    
    if auth_result:
        return jsonify({
            'success': True,
            'data': auth_result,
            'message': 'Login successful'
        }), 200
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
