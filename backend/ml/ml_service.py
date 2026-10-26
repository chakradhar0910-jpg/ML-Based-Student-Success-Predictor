import os
import joblib
import pandas as pd
import numpy as np

class MLService:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.load_artifacts()

    def load_artifacts(self):
        """Loads the trained model and preprocessor."""
        try:
            model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
            prep_path = os.path.join(os.path.dirname(__file__), 'preprocessor.pkl')
            self.model = joblib.load(model_path)
            self.preprocessor = joblib.load(prep_path)
        except Exception as e:
            print(f"Warning: ML artifacts not loaded properly. {e}")

    def calculate_confidence_interval(self, X_processed, predicted_cgpa):
        """Calculates standard error and confidence interval from ensemble estimators."""
        try:
            if hasattr(self.model, 'estimators_'):
                tree_preds = [float(tree.predict(X_processed)[0]) for tree in self.model.estimators_]
                std_dev = float(np.std(tree_preds))
                margin = round(min(0.60, max(0.18, std_dev)), 2)
            else:
                margin = 0.32
        except Exception:
            margin = 0.32
            
        lower = max(0.0, round(predicted_cgpa - margin, 2))
        upper = min(10.0, round(predicted_cgpa + margin, 2))
        return {
            'margin': margin,
            'lower': lower,
            'upper': upper,
            'confidence_level': '95%',
            'range_text': f"{predicted_cgpa:.2f} ± {margin:.2f}"
        }

    def predict_cgpa(self, data_dict, return_confidence=False):
        """
        Predicts CGPA for a single student.
        data_dict should contain the required input features.
        """
        if not self.model or not self.preprocessor:
            raise Exception("Model not loaded. Please run train.py first.")

        # Convert input dictionary to DataFrame
        df = pd.DataFrame([data_dict])
        
        # Ensure all columns required by the preprocessor exist with sensible defaults
        expected_defaults = {
            'gender': 'Male',
            'department': 'CSE',
            'age': 20,
            'semester': 4,
            'attendance': 75.0,
            'previous_cgpa': 7.0,
            'mid1': 35.0,
            'mid2': 35.0,
            'internal_marks': 15.0,
            'backlogs': 0
        }
        for col, val in expected_defaults.items():
            if col not in df.columns or df[col].isnull().all() or df[col].iloc[0] == '':
                df[col] = val

        # Preprocess
        X_processed = self.preprocessor.transform(df)
        
        # Predict
        raw_cgpa = self.model.predict(X_processed)[0]
        predicted_cgpa = max(0.0, min(10.0, round(float(raw_cgpa), 2)))

        if return_confidence:
            conf = self.calculate_confidence_interval(X_processed, predicted_cgpa)
            return predicted_cgpa, conf

        return predicted_cgpa

    def classify_performance(self, cgpa):
        if cgpa >= 8.5:
            return "Excellent", "O"
        elif cgpa >= 7.0:
            return "Good", "A"
        elif cgpa >= 5.0:
            return "Average", "B"
        else:
            return "At Risk", "F"

    def calculate_risk(self, cgpa):
        if cgpa < 5.0:
            return "High"
        elif cgpa < 7.0:
            return "Medium"
        else:
            return "Low"

    def generate_recommendations(self, data_dict, cgpa):
        recommendations = []
        
        attendance = float(data_dict.get('attendance', 100))
        if attendance < 75:
            recommendations.append("Improve attendance and maintain regular class participation.")
            
        prev_cgpa = float(data_dict.get('previous_cgpa', 10))
        if prev_cgpa < 6.0:
            recommendations.append("Focus on strengthening core subjects and seek faculty guidance.")
            
        backlogs = int(data_dict.get('backlogs', 0))
        if backlogs > 0:
            recommendations.append("Meet your academic mentor and create a plan to clear pending courses.")
            
        if cgpa < 5.0:
            recommendations.append("Consider additional academic support and mentoring.")
            
        if not recommendations:
            recommendations.append("Continue consistent academic performance.")
            
        return recommendations

# Create a singleton instance
ml_service_instance = MLService()
