import os
import sys
import pandas as pd

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.db import get_db_connection

def load_students(num_students=50):
    dataset_path = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'raw', 'student_data.csv')
    if not os.path.exists(dataset_path):
        print(f"Dataset not found at {dataset_path}. Please run synthetic_data_generator.py first.")
        return

    df = pd.read_csv(dataset_path).head(num_students)
    conn = get_db_connection()
    inserted_count = 0

    try:
        with conn.cursor() as cursor:
            sql = """
            INSERT IGNORE INTO students 
            (student_id, name, gender, age, department, semester, attendance, previous_cgpa, mid1, mid2, internal_marks, backlogs)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            for _, r in df.iterrows():
                # Provide realistic student names
                student_name = f"Student {r['student_id']}"
                cursor.execute(sql, (
                    str(r['student_id']),
                    student_name,
                    str(r['gender']),
                    int(r['age']),
                    str(r['department']),
                    int(r['semester']),
                    float(r['attendance']),
                    float(r['previous_cgpa']),
                    float(r['mid1']),
                    float(r['mid2']),
                    float(r['internal_marks']),
                    int(r['backlogs'])
                ))
                inserted_count += 1
            conn.commit()
            print(f"Successfully processed {inserted_count} student records into the database!")
    except Exception as e:
        print(f"Error inserting students: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    load_students(50)
