import pandas as pd
import numpy as np
import os

def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    
    # Generate features
    student_id = [f'STU{i:04d}' for i in range(1, num_samples + 1)]
    gender = np.random.choice(['Male', 'Female'], size=num_samples)
    age = np.random.randint(18, 25, size=num_samples)
    department = np.random.choice(['CSE', 'ECE', 'IT', 'MECH', 'CIVIL'], size=num_samples)
    semester = np.random.randint(1, 9, size=num_samples)
    
    attendance = np.random.normal(80, 15, size=num_samples)
    attendance = np.clip(attendance, 0, 100)
    
    previous_cgpa = np.random.normal(7.5, 1.5, size=num_samples)
    previous_cgpa = np.clip(previous_cgpa, 0, 10)
    
    mid1 = np.random.normal(40, 10, size=num_samples)
    mid1 = np.clip(mid1, 0, 50)
    
    mid2 = np.random.normal(40, 10, size=num_samples)
    mid2 = np.clip(mid2, 0, 50)
    
    internal_marks = np.random.normal(15, 5, size=num_samples)
    internal_marks = np.clip(internal_marks, 0, 20)
    
    backlogs = np.random.choice([0, 1, 2, 3, 4], size=num_samples, p=[0.7, 0.15, 0.08, 0.05, 0.02])
    
    # Target variable generation (with some logical correlations)
    # CGPA = base + w1*(prev) + w2*(att) + w3*(mid1+mid2+internal) - w4*(backlogs) + noise
    base = 1.0
    w_prev = 0.5
    w_att = 0.02
    w_marks = 0.02
    w_back = 0.3
    
    predicted_cgpa = (
        base + 
        w_prev * previous_cgpa + 
        w_att * attendance + 
        w_marks * (mid1 + mid2 + internal_marks) - 
        w_back * backlogs +
        np.random.normal(0, 0.5, size=num_samples)
    )
    predicted_cgpa = np.clip(predicted_cgpa, 0, 10)
    predicted_cgpa = np.round(predicted_cgpa, 2)
    
    df = pd.DataFrame({
        'student_id': student_id,
        'gender': gender,
        'age': age,
        'department': department,
        'semester': semester,
        'attendance': np.round(attendance, 1),
        'previous_cgpa': np.round(previous_cgpa, 2),
        'mid1': np.round(mid1, 1),
        'mid2': np.round(mid2, 1),
        'internal_marks': np.round(internal_marks, 1),
        'backlogs': backlogs,
        'cgpa': predicted_cgpa
    })
    
    # Save to dataset/raw
    os.makedirs(os.path.dirname(__file__), exist_ok=True)
    file_path = os.path.join(os.path.dirname(__file__), 'student_data.csv')
    df.to_csv(file_path, index=False)
    print(f"Generated {num_samples} records and saved to {file_path}")

if __name__ == "__main__":
    generate_synthetic_data(1000)
