from flask import Blueprint, request, jsonify
from database.db import get_db_connection

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/dashboard', methods=['GET'])
def get_dashboard_metrics():
    department = request.args.get('department')
    semester = request.args.get('semester')
    
    query_conditions = []
    params = []
    
    if department and department != 'All':
        query_conditions.append("department = %s")
        params.append(department)
        
    if semester and semester != 'All':
        query_conditions.append("semester = %s")
        params.append(int(semester))
        
    where_clause = ""
    if query_conditions:
        where_clause = " WHERE " + " AND ".join(query_conditions)
        
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Basic KPIs
            sql = f"""
            SELECT 
                COUNT(*) as total_students,
                AVG(attendance) as avg_attendance,
                AVG(previous_cgpa) as avg_cgpa,
                AVG(backlogs) as avg_backlogs
            FROM students
            {where_clause}
            """
            cursor.execute(sql, tuple(params))
            kpi_data = cursor.fetchone()
            
            # Grade Distribution (using previous_cgpa for now)
            grade_sql = f"""
            SELECT 
                CASE 
                    WHEN previous_cgpa >= 8.5 THEN 'O'
                    WHEN previous_cgpa >= 7.0 THEN 'A'
                    WHEN previous_cgpa >= 5.0 THEN 'B'
                    ELSE 'F'
                END as grade,
                COUNT(*) as count
            FROM students
            {where_clause}
            GROUP BY grade
            """
            cursor.execute(grade_sql, tuple(params))
            grades = cursor.fetchall()
            
            # Risk Categories (High: < 5.0, Medium: < 7.0, Low: >= 7.0)
            risk_sql = f"""
            SELECT 
                CASE 
                    WHEN previous_cgpa < 5.0 THEN 'High Risk'
                    WHEN previous_cgpa < 7.0 THEN 'Medium Risk'
                    ELSE 'Low Risk'
                END as risk,
                COUNT(*) as count
            FROM students
            {where_clause}
            GROUP BY risk
            """
            cursor.execute(risk_sql, tuple(params))
            risks = cursor.fetchall()
            
            # Formatting for Recharts
            grade_distribution = [{"name": g['grade'], "students": g['count']} for g in grades]
            performance_categories = [{"name": r['risk'], "value": r['count']} for r in risks]
            
            # Default sorting for grades
            grade_order = {'O': 1, 'A': 2, 'B': 3, 'F': 4}
            grade_distribution.sort(key=lambda x: grade_order.get(x['name'], 5))
            
            return jsonify({
                'success': True,
                'data': {
                    'kpis': {
                        'totalStudents': kpi_data['total_students'] or 0,
                        'avgAttendance': round(kpi_data['avg_attendance'] or 0, 1),
                        'avgCGPA': round(kpi_data['avg_cgpa'] or 0, 2),
                        'avgBacklogs': round(kpi_data['avg_backlogs'] or 0, 1)
                    },
                    'gradeDistribution': grade_distribution,
                    'performanceCategories': performance_categories
                }
            }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        connection.close()
