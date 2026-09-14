from flask import Blueprint, request, jsonify
import json
from database.db import get_db_connection
from ml.ml_service import ml_service_instance

predictions_bp = Blueprint('predictions', __name__)

@predictions_bp.route('', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
            
        # Call ML Service
        cgpa = ml_service_instance.predict_cgpa(data)
        performance, grade = ml_service_instance.classify_performance(cgpa)
        risk = ml_service_instance.calculate_risk(cgpa)
        recommendations = ml_service_instance.generate_recommendations(data, cgpa)
        
        # Save to database
        if 'student_id' in data:
            connection = get_db_connection()
            try:
                with connection.cursor() as cursor:
                    sql = """
                    INSERT INTO predictions (student_id, predicted_cgpa, risk_level, recommendations)
                    VALUES (%s, %s, %s, %s)
                    """
                    cursor.execute(sql, (
                        data['student_id'],
                        cgpa,
                        risk,
                        json.dumps(recommendations)
                    ))
                    connection.commit()
            except Exception as db_e:
                print(f"Failed to save prediction to DB: {db_e}")
            finally:
                connection.close()
        
        result = {
            'predicted_cgpa': cgpa,
            'grade': grade,
            'performance_category': performance,
            'risk_level': risk,
            'recommendations': recommendations
        }
        
        return jsonify({
            'success': True,
            'data': result,
            'message': 'Prediction generated successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Prediction failed: {str(e)}'
        }), 500

import pandas as pd
import io

@predictions_bp.route('/bulk', methods=['POST'])
def predict_bulk():
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file uploaded'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'message': 'No file selected'}), 400
            
        if not file.filename.endswith('.csv'):
            return jsonify({'success': False, 'message': 'Only CSV files are supported'}), 400
            
        # Read CSV
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        df = pd.read_csv(stream)
        
        # We need to process each row
        results = []
        for index, row in df.iterrows():
            data_dict = row.to_dict()
            
            try:
                cgpa = ml_service_instance.predict_cgpa(data_dict)
                performance, grade = ml_service_instance.classify_performance(cgpa)
                risk = ml_service_instance.calculate_risk(cgpa)
                
                # Append to original data
                data_dict['Predicted_CGPA'] = cgpa
                data_dict['Grade'] = grade
                data_dict['Performance'] = performance
                data_dict['Risk_Level'] = risk
                results.append(data_dict)
                
                # Save to database
                if 'student_id' in data_dict:
                    try:
                        recommendations = ml_service_instance.generate_recommendations(data_dict, cgpa)
                        connection = get_db_connection()
                        with connection.cursor() as cursor:
                            sql = """
                            INSERT INTO predictions (student_id, predicted_cgpa, risk_level, recommendations)
                            VALUES (%s, %s, %s, %s)
                            """
                            cursor.execute(sql, (
                                data_dict['student_id'],
                                cgpa,
                                risk,
                                json.dumps(recommendations)
                            ))
                            connection.commit()
                        connection.close()
                    except Exception as db_e:
                        print(f"Failed to save bulk prediction to DB: {db_e}")
                        
            except Exception as row_e:
                print(f"Error predicting for row {index}: {row_e}")
                data_dict['Predicted_CGPA'] = "Error"
                results.append(data_dict)
                
        return jsonify({
            'success': True,
            'data': results,
            'message': f'Successfully processed {len(results)} records'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Bulk prediction failed: {str(e)}'
        }), 500

@predictions_bp.route('/history', methods=['GET'])
def get_prediction_history():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = """
            SELECT p.id, p.student_id, s.name, s.department, p.predicted_cgpa, 
                   p.risk_level, p.recommendations, p.created_at
            FROM predictions p
            JOIN students s ON p.student_id = s.student_id
            ORDER BY p.created_at DESC
            LIMIT 100
            """
            cursor.execute(sql)
            results = cursor.fetchall()
            
            # Parse JSON recommendations
            for r in results:
                if r['recommendations']:
                    try:
                        r['recommendations'] = json.loads(r['recommendations'])
                    except:
                        pass
                        
            return jsonify({
                'success': True,
                'data': results
            }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
    finally:
        connection.close()
