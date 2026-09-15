import re

def validate_email(email):
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(pattern, email) is not None

def validate_student_data(data):
    errors = {}
    if not data.get('student_id'):
        errors['student_id'] = 'Student ID is required'
    if not data.get('name'):
        errors['name'] = 'Name is required'
    
    attendance = data.get('attendance')
    if attendance is not None:
        try:
            att = float(attendance)
            if att < 0 or att > 100:
                errors['attendance'] = 'Attendance must be between 0 and 100'
        except ValueError:
            errors['attendance'] = 'Attendance must be a number'
            
    return len(errors) == 0, errors
