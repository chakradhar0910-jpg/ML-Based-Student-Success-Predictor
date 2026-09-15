USE student_success_db;

-- Passwords are hashed using bcrypt. Default is 'password123'
INSERT INTO users (name, email, password_hash, role) VALUES 
('Admin User', 'admin@ssp.edu', '$2b$12$NqK0G9P.QoW9Z9Tqg0W9ZO6V0f.42V7hLp3y10uY1XwD10oYQh71S', 'admin'),
('Faculty Member', 'faculty@ssp.edu', '$2b$12$NqK0G9P.QoW9Z9Tqg0W9ZO6V0f.42V7hLp3y10uY1XwD10oYQh71S', 'faculty');

INSERT INTO students (student_id, name, gender, age, department, semester, attendance, previous_cgpa, mid1, mid2, internal_marks, backlogs) VALUES 
('STU101', 'Aarav Patel', 'Male', 20, 'CSE', 3, 88.0, 8.4, 42.0, 44.0, 18.0, 0),
('STU102', 'Sara Khan', 'Female', 21, 'ECE', 5, 62.0, 5.1, 25.0, 28.0, 12.0, 2),
('STU103', 'Michael Smith', 'Male', 19, 'CSE', 3, 75.0, 7.2, 35.0, 32.0, 15.0, 0),
('STU104', 'Priya Sharma', 'Female', 22, 'IT', 7, 95.0, 9.1, 48.0, 49.0, 20.0, 0),
('STU105', 'David Chen', 'Male', 20, 'EEE', 5, 68.0, 6.4, 30.0, 31.0, 14.0, 1);
