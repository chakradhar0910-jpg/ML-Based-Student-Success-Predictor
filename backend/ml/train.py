import pandas as pd
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor

import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from preprocess import get_preprocessor
from evaluate import evaluate_model

def train():
    # 1. Load Data
    data_path = os.path.join(os.path.dirname(__file__), '../../dataset/raw/student_data.csv')
    try:
        df = pd.read_csv(data_path)
    except FileNotFoundError:
        print(f"Error: Dataset not found at {data_path}. Please run synthetic_data_generator.py first.")
        return

    # 2. Split Features and Target
    X = df.drop(columns=['student_id', 'cgpa'])
    y = df['cgpa']

    # 3. Train/Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 4. Preprocessing
    preprocessor = get_preprocessor()
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)

    # 5. Model Training
    models = {
        'Linear Regression': LinearRegression(),
        'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
        'XGBoost': XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
    }

    results = []
    trained_models = {}

    for name, model in models.items():
        # Train
        model.fit(X_train_processed, y_train)
        trained_models[name] = model
        
        # Predict
        y_pred = model.predict(X_test_processed)
        
        # Evaluate
        res = evaluate_model(name, y_test, y_pred)
        results.append(res)

    # 6. Select Best Model (based on highest R2)
    best_model_info = max(results, key=lambda x: x['r2'])
    best_model_name = best_model_info['model']
    best_model = trained_models[best_model_name]
    
    print(f"\n=> Best Model Selected: {best_model_name} (R² = {best_model_info['r2']:.4f})")

    # 7. Save Model & Preprocessor
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    preprocessor_path = os.path.join(os.path.dirname(__file__), 'preprocessor.pkl')
    
    joblib.dump(best_model, model_path)
    joblib.dump(preprocessor, preprocessor_path)
    
    print(f"Model saved to {model_path}")
    print(f"Preprocessor saved to {preprocessor_path}")

if __name__ == "__main__":
    train()
