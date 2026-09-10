# ML-Based Student Success Predictor

> A production-style academic analytics platform that predicts student Semester CGPA using machine learning, identifies at-risk students, and provides actionable academic recommendations.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
  - [MySQL Setup](#mysql-setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [ML Model Training](#ml-model-training)
- [CSV Bulk Prediction Format](#csv-bulk-prediction-format)
- [Folder Structure](#folder-structure)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)

---

## Project Overview

The ML-Based Student Success Predictor is a full-stack academic analytics platform developed as a college special project. It uses trained machine learning regression models to predict a student's semester CGPA based on academic input features, enabling faculty and administrators to identify students who may need additional support.

**Prediction target:** Semester CGPA

**Derived outputs:**
- Academic Grade (O, A+, A, B+, B, C, F)
- Performance Category (Excellent, Good, Average, At Risk)
- Risk Level (High, Medium, Low)
- Personalised academic recommendations

---

## Features

- ✅ Individual student CGPA prediction
- ✅ Bulk CSV prediction for entire cohorts
- ✅ Academic performance categorisation
- ✅ Risk level classification
- ✅ Actionable academic recommendations
- ✅ Student record management (CRUD)
- ✅ Interactive analytics dashboard
- ✅ Prediction history tracking
- ✅ Role-based authentication (Admin / Faculty)
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ JWT-secured REST API

---

## Architecture

```
React Frontend (port 3000)
         │
         │  HTTP / JSON (REST API)
         ▼
Flask REST API (port 5000)
         │
         ├─────────────────────────┐
         ▼                         ▼
  ML Prediction Engine       MySQL Database
  (Scikit-learn / XGBoost)   (Students, Predictions,
  model.pkl + preprocessor.pkl  Users, History)
```

---

## Technology Stack

| Layer          | Technology                                  |
|----------------|---------------------------------------------|
| Frontend       | React 18, Vite, Tailwind CSS 3, React Router 6 |
| Charts         | Recharts                                    |
| HTTP Client    | Axios                                       |
| Icons          | Lucide React                                |
| Backend        | Python 3.11+, Flask, Flask-CORS             |
| Authentication | JWT (PyJWT), bcrypt                         |
| Database       | MySQL 8+                                    |
| ML             | Scikit-learn, XGBoost, Pandas, NumPy        |
| Model Storage  | Joblib (.pkl)                               |

---

## Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- MySQL 8+

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at: http://localhost:3000

### Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

The Flask API runs at: http://localhost:5000

### MySQL Setup

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

---

## Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_USE_MOCK_API=false          # true for Phase 1 mock mode
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=ML Student Success Predictor
```

### Backend (`backend/.env`)

```env
DATABASE_URL=mysql+pymysql://user:password@localhost/student_success_db
JWT_SECRET_KEY=your-strong-secret-key-here
FLASK_ENV=development
MODEL_PATH=ml/model.pkl
PREPROCESSOR_PATH=ml/preprocessor.pkl
```

---

## Running the Project

### Development (Phase 1 — Frontend only)

```bash
cd frontend
npm run dev
# Visit http://localhost:3000
```

**Mock login credentials:**
- Admin: `admin@ssp.edu` / `password123`
- Faculty: `faculty@ssp.edu` / `password123`

### Full Stack (Phase 3+)

```bash
# Terminal 1 — Backend
cd backend && python app.py

# Terminal 2 — Frontend
cd frontend && npm run dev
```

---

## API Documentation

### Authentication

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | `/api/auth/login`    | Login, returns JWT token |
| POST   | `/api/auth/logout`   | Logout                   |
| GET    | `/api/auth/me`       | Get current user         |

### Students

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | `/api/students`       | List all students   |
| GET    | `/api/students/:id`   | Get student by ID   |
| POST   | `/api/students`       | Create student      |
| PUT    | `/api/students/:id`   | Update student      |
| DELETE | `/api/students/:id`   | Delete student      |

### Prediction

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | `/api/predict`       | Single student prediction |
| POST   | `/api/predict/bulk`  | Bulk CSV prediction      |

### Other Endpoints

| Method | Endpoint                 | Description            |
|--------|--------------------------|------------------------|
| GET    | `/api/predictions`       | Prediction history     |
| GET    | `/api/predictions/:id`   | Prediction detail      |
| GET    | `/api/dashboard`         | Dashboard KPIs         |
| GET    | `/api/analytics`         | Analytics data         |
| GET    | `/api/recommendations`   | At-risk recommendations |

### Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Prediction generated successfully"
}
```

---

## ML Model Training

```bash
cd backend/ml
python train.py
```

Models trained and evaluated:
1. Linear Regression
2. Random Forest Regressor
3. XGBoost Regressor

Metrics compared: MAE, MSE, RMSE, R²

Output files:
- `backend/ml/model.pkl`
- `backend/ml/preprocessor.pkl`

---

## CSV Bulk Prediction Format

Required columns (order-independent):

```
student_id, name, gender, age, department, semester,
attendance, previous_cgpa, mid1, mid2, internal_marks, backlogs
```

Example row:
```
STU001, John Doe, Male, 20, CSE, 3, 85, 7.8, 42, 40, 38, 0
```

---

## Folder Structure

```
special-project/
├── frontend/                   ← React application
│   ├── src/
│   │   ├── components/         ← Reusable UI components
│   │   ├── pages/              ← Page-level components
│   │   ├── layouts/            ← Layout wrappers
│   │   ├── services/           ← API service modules (Phase 3+)
│   │   ├── hooks/              ← Custom React hooks
│   │   ├── utils/              ← Utility functions
│   │   ├── data/               ← Mock data (Phase 1)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                    ← Flask REST API (Phase 3+)
│   ├── routes/                 ← Route handlers
│   ├── models/                 ← DB model classes
│   ├── services/               ← Business logic layer
│   ├── ml/                     ← ML training + prediction
│   ├── database/               ← DB connection
│   ├── utils/                  ← Validators, helpers
│   ├── app.py                  ← Flask entry point
│   ├── config.py               ← App configuration
│   └── requirements.txt
│
├── database/
│   ├── schema.sql              ← Table definitions
│   └── seed.sql                ← Sample data
│
├── dataset/
│   ├── raw/                    ← Original dataset
│   └── processed/              ← Cleaned dataset
│
├── notebooks/
│   └── exploratory_analysis.ipynb
│
└── README.md
```

---

## Screenshots

> Screenshots will be added after each phase is completed.

---

## Future Enhancements

- Email notifications for high-risk students
- Department-level admin accounts
- Scheduled batch prediction jobs
- Export analytics to PDF/Excel
- CGPA trend forecasting across multiple semesters
- Integration with existing university ERP/SIS
- Mobile application
- Support for multiple ML model versions
- A/B testing between model versions

---

*College Special Project — ML-Based Student Success Predictor*
*Theme: Machine Learning for Academic Prediction*
*Domain: Semester CGPA Prediction*
