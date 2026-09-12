import os
import joblib
import pandas as pd

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

    def predict_cgpa(self, data_dict):
        """
        Predicts CGPA for a single student.
        data_dict should contain the required input features.
        """
        if not self.model or not self.preprocessor:
            raise Exception("Model not loaded. Please run train.py first.")

        # Convert input dictionary to DataFrame
        df = pd.DataFrame([data_dict])
        
        # Make sure missing categorical fields have defaults to prevent errors during preprocessing
        if 'gender' not in df.columns:
            df['gender'] = 'Other'
        if 'department' not in df.columns:
            df['department'] = 'CSE'

        # Preprocess
        X_processed = self.preprocessor.transform(df)
        
        # Predict
        predicted_cgpa = self.model.predict(X_processed)[0]
        
        # Ensure bounds (0 to 10)
        return max(0.0, min(10.0, round(float(predicted_cgpa), 2)))

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
