from flask import Blueprint, request, jsonify
from services.student_service import get_all_students, create_student
from utils.validators import validate_student_data

students_bp = Blueprint('students', __name__)

@students_bp.route('', methods=['GET'])
def list_students():
    try:
        students = get_all_students()
        return jsonify({
            'success': True,
            'data': students,
            'message': 'Students retrieved successfully'
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@students_bp.route('', methods=['POST'])
def add_student():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400
        
    is_valid, errors = validate_student_data(data)
    if not is_valid:
        return jsonify({'success': False, 'message': 'Validation failed', 'errors': errors}), 422
        
    try:
        student_id = create_student(data)
        return jsonify({
            'success': True,
            'data': {'id': student_id},
            'message': 'Student created successfully'
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@students_bp.route('/<student_id>', methods=['GET'])
def get_student(student_id):
    try:
        from services.student_service import get_student_by_id
        student = get_student_by_id(student_id)
        if not student:
            return jsonify({'success': False, 'message': 'Student not found'}), 404
            
        return jsonify({
            'success': True,
            'data': student,
            'message': 'Student retrieved successfully'
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
