from database.db import get_db_connection

def get_all_students():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM students ORDER BY created_at DESC"
            cursor.execute(sql)
            students = cursor.fetchall()
            return students
    finally:
        connection.close()

def create_student(data):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO students 
            (student_id, name, gender, age, department, semester, attendance, previous_cgpa, mid1, mid2, internal_marks, backlogs) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                data['student_id'], data['name'], data.get('gender', 'Other'),
                data.get('age'), data['department'], data['semester'],
                data.get('attendance'), data.get('previous_cgpa'),
                data.get('mid1'), data.get('mid2'), data.get('internal_marks'),
                data.get('backlogs', 0)
            ))
            connection.commit()
            return cursor.lastrowid
    finally:
        connection.close()

def get_student_by_id(student_id):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM students WHERE student_id = %s"
            cursor.execute(sql, (student_id,))
            student = cursor.fetchone()
            return student
    finally:
        connection.close()
