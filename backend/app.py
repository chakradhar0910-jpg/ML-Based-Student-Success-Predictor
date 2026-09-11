from flask import Flask
from flask_cors import CORS
from config import Config
from routes.auth import auth_bp
from routes.students import students_bp
from routes.predictions import predictions_bp
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(students_bp, url_prefix='/api/students')
    app.register_blueprint(predictions_bp, url_prefix='/api/predict')
    
    from routes.analytics import analytics_bp
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

    
    @app.route('/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy'}
        
    return app

if __name__ == '__main__':
    app = create_app()
    debug_mode = os.getenv('FLASK_ENV', 'development') == 'development'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)
