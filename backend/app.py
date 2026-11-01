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

    
    @app.route('/', methods=['GET'])
    def root():
        return {
            'name': 'Student Success Predictor API',
            'status': 'online',
            'version': '1.0.0'
        }

    @app.route('/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy'}
        
    return app

app = create_app()

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_ENV', 'development') == 'development'
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
