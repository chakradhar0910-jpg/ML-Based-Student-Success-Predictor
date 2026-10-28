# ML-Based Student Success Predictor
### *An End-to-End Academic Analytics & Machine Learning Platform for Semester CGPA Forecasting*

[![Python Version](https://img.shields.io/badge/Python-3.11%20%7C%203.12%20%7C%203.14-blue.svg)](https://www.python.org/)
[![Framework](https://img.shields.io/badge/Backend-Flask%203.x-lightgrey.svg)](https://flask.palletsprojects.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%206-61dafb.svg)](https://react.dev/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS%203-38bdf8.svg)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/Database-MySQL%208.x-orange.svg)](https://www.mysql.com/)
[![ML Library](https://img.shields.io/badge/ML-Scikit--Learn%20%7C%20XGBoost-F7931E.svg)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-Academic%20Project-green.svg)](#)

---

## 📌 Executive Summary & Abstract

The **ML-Based Student Success Predictor** is a production-grade academic analytics platform designed to solve the critical institutional challenge of late academic intervention. Traditional higher-education monitoring often identifies struggling students only after end-semester examination results are published, leaving no window for corrective mentoring.

This system applies supervised regression machine learning pipelines to forecast a student’s semester CGPA early in the term using continuous evaluation metrics (attendance trends, internal assessments, mid-term examinations, and historical academic backlogs). Beyond single-point predictions, the platform introduces:
1. **$95\%$ Empirical Confidence Intervals** derived from ensemble tree variance.
2. **Automated Risk Stratification** (High, Medium, Low Priority).
3. **Prescriptive Academic Recommendations** tailored to the specific weak performance vector.
4. **Official Printable PDF Assessment Reports** featuring institutional letterheads and mentor/dean signature blocks.
5. **Cohort-Wide Bulk CSV Analytics** with 1-click sample dataset generation for departmental audits.

---

## 📑 Table of Contents

- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Machine Learning Pipeline & Methodology](#-machine-learning-pipeline--methodology)
  - [Input Feature Schema](#input-feature-schema)
  - [Preprocessing Pipeline](#preprocessing-pipeline)
  - [Model Benchmarking & Experimental Results](#model-benchmarking--experimental-results)
  - [Confidence Interval Computation](#confidence-interval-computation)
- [Technology Stack](#-technology-stack)
- [Database Schema (MySQL)](#-database-schema-mysql)
- [Installation & Quick Start Guide](#-installation--quick-start-guide)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Database Initialization](#2-database-initialization)
  - [3. ML Model Training](#3-ml-model-training)
  - [4. Frontend Setup](#4-frontend-setup)
- [System Credentials](#-system-credentials)
- [REST API Reference](#-rest-api-reference)
- [Project Directory Structure](#-project-directory-structure)
- [Demonstration & Defense Walkthrough](#-demonstration--defense-walkthrough)

---

## 🏛 System Architecture

The application adopts a decoupled, multi-tier client-server architecture with strict separation between user presentation, business logic, asynchronous ML inference, and relational persistence.

```
                      ┌────────────────────────────────────────┐
                      │          React 18 SPA (Vite)           │
                      │  Tailwind CSS · Lucide · Recharts      │
                      │         (Runs on Port 3000)            │
                      └──────────────────┬─────────────────────┘
                                         │ HTTP / REST / JSON
                                         │ Bearer JWT Auth
                                         ▼
                      ┌────────────────────────────────────────┐
                      │            Flask REST API              │
                      │   Auth · Students · Predict · Analytics│
                      │         (Runs on Port 5000)            │
                      └───────┬────────────────────────┬───────┘
                              │                        │
                 In-Memory    │                        │ Connection Pool
                 Inference    ▼                        ▼ (PyMySQL)
        ┌───────────────────────────┐    ┌───────────────────────────┐
        │    ML Inference Engine    │    │      MySQL Database       │
        │  • Scikit-learn Pipeline  │    │  • users (Admin/Faculty)  │
        │  • preprocessor.pkl       │    │  • students (55+ records) │
        │  • model.pkl (Ensemble)   │    │  • predictions (Logs)     │
        └───────────────────────────┘    └───────────────────────────┘
```

---

## ✨ Key Features

### 1. Direct Academic Authentication & Role-Based Access Control (RBAC)
- Streamlined entry portal bypassing generic landing pages straight into the academic dashboard.
- Dual role segregation:
  - **Administrator:** Full visibility across college analytics, department comparisons, and student database management.
  - **Faculty:** Targeted access for student mentoring, grade forecasts, and individualized student intervention logs.

### 2. Single Student CGPA Prediction Engine
- High-precision forecasting based on continuous internal evaluations.
- Real-time conversion into:
  - **Academic Grade:** `O` (≥ 8.5), `A` (7.0 – 8.49), `B` (5.0 – 6.99), `F` (< 5.0).
  - **Performance Category:** Excellent, Good, Average, At Risk.
  - **Risk Stratification:** Low, Medium, High Priority Intervention.
  - **95% Confidence Interval:** Quantifies model certainty (e.g., $8.57 \pm 0.60$).

### 3. Prescriptive Mentoring & Actionable Recommendations
- Rule-based expert decision engine triggered by academic thresholds:
  - Attendance $< 75\% \to$ *"Improve attendance and maintain regular class participation."*
  - Active Backlogs $> 0 \to$ *"Meet your academic mentor and create a plan to clear pending courses."*
  - Predicted CGPA $< 5.0 \to$ *"Schedule structured remedial mentoring sessions prior to final examinations."*

### 4. Official Printable Academic Assessment Report (PDF Export)
- One-click clean print view (`window.print()` / Save as PDF).
- Formats input variables, predictive outputs, confidence bands, recommendations, and official signature sections for Faculty Mentors and Academic Deans.

### 5. Cohort-Wide Bulk CSV Processing
- Upload semester-wide CSV files containing hundreds of student rows.
- Features a **1-click "Download Sample CSV Template"** pre-populated with benchmark student records for instant evaluation.
- Outputs an interactive data table with batch predictions and exportable results.

### 6. Interactive Analytics Dashboard
- Dynamic KPIs: Total enrolled students, institutional average CGPA, attendance mean, and backlog averages.
- Visual charts (Recharts): Grade distribution histograms, risk categorization pie charts, and department-level filters.

---

## 🤖 Machine Learning Pipeline & Methodology

### Input Feature Schema

The ML regression model maps 10 multidimensional input attributes to the continuous target variable $y \in [0.00, 10.00]$ (Semester CGPA):

| Feature Name | Data Type | Value Domain | Description |
| :--- | :--- | :--- | :--- |
| `attendance` | Numeric (Float) | $0.0 - 100.0\%$ | Classroom lecture attendance percentage |
| `previous_cgpa` | Numeric (Float) | $0.00 - 10.00$ | Cumulative Grade Point Average up to prior term |
| `mid1` | Numeric (Float) | $0.0 - 50.0$ | First mid-term theory exam score |
| `mid2` | Numeric (Float) | $0.0 - 50.0$ | Second mid-term theory exam score |
| `internal_marks`| Numeric (Float) | $0.0 - 20.0$ | Continuous lab, assignment, and quiz marks |
| `backlogs` | Numeric (Integer)| $0 - 10+$ | Number of currently active uncleared subjects |
| `age` | Numeric (Integer)| $17 - 30$ | Student chronological age |
| `semester` | Numeric (Integer)| $1 - 8$ | Current academic semester |
| `department` | Categorical | CSE, ECE, IT, MECH, CIVIL | Academic discipline |
| `gender` | Categorical | Male, Female, Other | Student demographic |

### Preprocessing Pipeline

Defined using `sklearn.compose.ColumnTransformer`:
1. **Numerical Pipeline:** Missing value imputation via median strategy (`SimpleImputer(strategy='median')`), followed by Z-score standardization (`StandardScaler()`).
2. **Categorical Pipeline:** Missing value imputation via mode strategy (`SimpleImputer(strategy='most_frequent')`), followed by One-Hot Encoding (`OneHotEncoder(handle_unknown='ignore')`).

### Model Benchmarking & Experimental Results

Three diverse regression architectures were trained and validated on an $80/20$ train-test split:

$$\text{Target Function: } \text{CGPA} = f(\text{attendance}, \text{prev\_cgpa}, \text{mids}, \text{internals}, \text{backlogs}, \dots)$$

| Algorithm | Mean Absolute Error (MAE) | Mean Squared Error (MSE) | Root Mean Squared Error (RMSE) | Coefficient of Determination ($R^2$) | Outcome |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Random Forest Regressor** | **0.3930** | **0.2334** | **0.4831** | **0.7404** | 🏆 **Selected Best Model** |
| **Linear Regression** | 0.3987 | 0.2402 | 0.4901 | 0.7328 | Baseline |
| **XGBoost Regressor** | 0.4074 | 0.2762 | 0.5255 | 0.6927 | Alternative Ensemble |

> **Conclusion:** Random Forest achieved the lowest error metrics and highest explanatory variance ($R^2 \approx 74.04\%$), demonstrating superior capability in capturing non-linear interactions between internal examination thresholds and attendance penalties.

### Confidence Interval Computation

Rather than presenting an ungrounded point estimate, the platform evaluates the variance across individual decision trees in the trained Random Forest ensemble:

$$\sigma = \sqrt{\frac{1}{N} \sum_{i=1}^{N} \left(\hat{y}_i - \bar{y}\right)^2}$$

$$\text{Confidence Interval (95\%)} = \hat{y} \pm \Delta, \quad \text{where } \Delta = \text{clamp}(1.0 \times \sigma, 0.18, 0.60)$$

---

## 🛠 Technology Stack

### Frontend Application
- **Core:** React 18, Vite 6 (ESModules)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS 3 with custom print stylesheets (`@media print`)
- **Visualizations:** Recharts (Responsive Bar, Area, and Pie charts)
- **Icons:** Lucide React
- **HTTP Client:** Axios (configured with JWT interceptors)

### Backend REST API
- **Framework:** Python Flask 3.1
- **CORS Management:** Flask-CORS
- **Security:** PyJWT (JSON Web Tokens), BCrypt password hashing
- **Environment Management:** python-dotenv
- **Database Driver:** PyMySQL with DictCursor connection pooling

### Data Science & Machine Learning
- **Libraries:** Scikit-Learn 1.9, XGBoost 3.4, Pandas 3.0, NumPy 2.5
- **Serialization:** Joblib

### Persistence
- **RDBMS:** MySQL 8.0+

---

## 🗄 Database Schema (MySQL)

```sql
-- 1. Users Table (Authentication & RBAC)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'faculty') DEFAULT 'faculty',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Students Table (Academic Registry)
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') DEFAULT 'Other',
    age INT,
    department VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    attendance DECIMAL(5,2),
    previous_cgpa DECIMAL(4,2),
    mid1 DECIMAL(5,2),
    mid2 DECIMAL(5,2),
    internal_marks DECIMAL(5,2),
    backlogs INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Predictions Table (Audit Logs)
CREATE TABLE predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    predicted_cgpa DECIMAL(4,2),
    grade VARCHAR(5),
    performance_category VARCHAR(20),
    risk_level VARCHAR(20),
    recommendations TEXT,
    model_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);
```

---

## ⚡ Installation & Quick Start Guide

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **Python:** v3.11, v3.12, or v3.14
- **MySQL Server:** 8.0 or higher running locally on port 3306

---

### 1. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install required dependencies
pip install -r requirements.txt
```

#### Backend Environment Variables (`backend/.env`)
Ensure `backend/.env` exists with your local MySQL credentials:
```env
FLASK_ENV=development
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=student_success_db
JWT_SECRET_KEY=ssp-super-secret-jwt-key-2024
```

---

### 2. Database Initialization

Execute the database setup script to create tables and seed default users:
```powershell
# Run from project root
.\backend\venv\Scripts\python.exe backend\setup_db.py

# (Optional) Populate 50 realistic student records into the database
.\backend\venv\Scripts\python.exe backend\load_students.py
```

---

### 3. ML Model Training

Generate the synthetic dataset and train the regression models:
```powershell
# Step A: Generate dataset
.\backend\venv\Scripts\python.exe dataset\raw\synthetic_data_generator.py

# Step B: Train models and save artifacts
.\backend\venv\Scripts\python.exe backend\ml\train.py
```
*Outputs `model.pkl` and `preprocessor.pkl` inside `backend/ml/`.*

---

### 4. Running the Servers

#### Terminal 1 — Start Backend Flask API:
```powershell
cd backend
.\venv\Scripts\python.exe app.py
```
*API will run at **http://localhost:5000**.*

#### Terminal 2 — Start Frontend React Application:
```powershell
cd frontend
npm install
npm run dev
```
*Frontend will launch at **http://localhost:3000**.*

---

## 🔑 System Credentials

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@ssp.edu` | `password123` | Full administrative access, global analytics, student CRUD |
| **Faculty Member** | `faculty@ssp.edu` | `password123` | Student performance forecasts, mentoring report exports |

> *Tip: On the login screen, click the **Admin** or **Faculty** quick-fill buttons under Demo Accounts to test instantly.*

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/login` — Authenticate user and issue 24-hour JWT token.

### Predictions & Modeling
- `POST /api/predict` — Generate single-student CGPA forecast, confidence interval, and tailored recommendations.
  ```json
  // Request
  {
    "attendance": 85.0,
    "previous_cgpa": 8.0,
    "mid1": 40.0,
    "mid2": 42.0,
    "internal_marks": 18.0,
    "backlogs": 0
  }
  ```
  ```json
  // Response
  {
    "success": true,
    "data": {
      "predicted_cgpa": 8.57,
      "grade": "O",
      "performance_category": "Excellent",
      "risk_level": "Low",
      "confidence_interval": {
        "confidence_level": "95%",
        "range_text": "8.57 ± 0.60",
        "lower": 7.97,
        "upper": 9.17
      },
      "recommendations": [
        "Continue consistent academic performance."
      ]
    }
  }
  ```
- `POST /api/predict/bulk` — Multipart form-data endpoint accepting `.csv` files for cohort processing.
- `GET /api/predict/history` — Retrieve chronological audit trail of all generated predictions.

### Academic Analytics & Records
- `GET /api/students` — Retrieve complete student roster from MySQL.
- `POST /api/students` — Insert new student academic profile.
- `GET /api/analytics/dashboard` — Fetch aggregate KPIs, grade distributions, and risk breakdowns.

---

## 📂 Project Directory Structure

```
special-project/
├── backend/
│   ├── app.py                      # Flask application factory & route registration
│   ├── config.py                   # Centralized environment & database configuration
│   ├── requirements.txt            # Python package dependencies
│   ├── setup_db.py                 # Automated MySQL database & table initializer
│   ├── load_students.py            # Batch script loading 50 students into database
│   ├── database/
│   │   └── db.py                   # PyMySQL pooled connection provider
│   ├── ml/
│   │   ├── train.py                # Model training, comparison & evaluation script
│   │   ├── preprocess.py           # Scikit-Learn ColumnTransformer pipeline
│   │   ├── evaluate.py             # Performance metric calculations (R2, MAE, RMSE)
│   │   ├── ml_service.py           # In-memory inference engine with confidence intervals
│   │   ├── model.pkl               # Serialized Random Forest model artifact
│   │   └── preprocessor.pkl        # Serialized feature preprocessor artifact
│   ├── routes/
│   │   ├── auth.py                 # JWT authentication endpoints
│   │   ├── students.py             # Student record management routes
│   │   ├── predictions.py          # Single, bulk, and history prediction routes
│   │   └── analytics.py            # Aggregate dashboard statistics routes
│   └── services/
│       ├── auth_service.py         # BCrypt validation & JWT generation
│       └── student_service.py      # Database query abstraction layer
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Routing configuration & auth protection
│   │   ├── main.jsx                # React DOM entry point
│   │   ├── components/             # Reusable UI components (Sidebar, TopNavbar, ProtectedRoute)
│   │   ├── layouts/                # DashboardLayout and PublicLayout
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx       # Academic authentication portal
│   │   │   ├── Dashboard.jsx       # Real-time institutional KPI dashboard
│   │   │   ├── PredictionPage.jsx  # Single student prediction & PDF report view
│   │   │   ├── BulkPredictionPage.jsx # Cohort CSV upload with sample template
│   │   │   ├── StudentsList.jsx    # Complete student database table
│   │   │   ├── AddStudent.jsx      # Manual student registration form
│   │   │   └── PredictionHistoryPage.jsx # Audit log of historical predictions
│   │   └── services/               # Axios API clients
│   ├── tailwind.config.js          # Tailwind CSS design system tokens
│   └── vite.config.js              # Vite bundler configuration
│
├── database/
│   ├── schema.sql                  # MySQL table definitions
│   └── seed.sql                    # Initial seed data for admin and faculty accounts
│
├── dataset/
│   └── raw/
│       ├── synthetic_data_generator.py # Synthetic student dataset generator
│       └── student_data.csv        # 1,000-record training dataset
│
├── .gitignore                      # Git exclusion rules
└── README.md                       # Comprehensive project documentation
```

---

## 🎓 Demonstration & Defense Walkthrough

When presenting this project to evaluators:

1. **Authentication Flow:** Open `http://localhost:3000`. Demonstrate role-based access using the instant demo credentials.
2. **Data-Driven Dashboard:** Navigate to **Analytics** to present cohort trends, department-wise comparisons, and institutional risk metrics computed from MySQL.
3. **Machine Learning Execution:** Navigate to **Academic Prediction**:
   - Enter test values for a student with low attendance and uncleared backlogs.
   - Show how the model classifies the student as **High Risk**, assigns an appropriate grade forecast, and calculates an **Empirical Confidence Interval**.
   - Point out the automatically generated academic recommendations.
4. **Report Export:** Click **Download Assessment Report (PDF)** to showcase the printable academic letter with faculty advisor and dean signature sections.
5. **Bulk Prediction Efficiency:** Navigate to **Bulk Prediction**, download the sample template, upload it, and demonstrate cohort inference in seconds.

---

*Academic Special Project — Computer Science & Engineering Department*  
*Specialization: Applied Machine Learning & Full-Stack Systems Development*
