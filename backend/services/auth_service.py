import bcrypt
import jwt
import datetime
from database.db import get_db_connection
from config import Config

def authenticate_user(email, password):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT id, name, email, password_hash, role FROM users WHERE email = %s"
            cursor.execute(sql, (email,))
            user = cursor.fetchone()
            
            if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                # Generate JWT Token
                token = jwt.encode({
                    'id': user['id'],
                    'email': user['email'],
                    'role': user['role'],
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
                }, Config.JWT_SECRET_KEY, algorithm='HS256')
                
                return {
                    'token': token,
                    'user': {
                        'id': user['id'],
                        'name': user['name'],
                        'email': user['email'],
                        'role': user['role']
                    }
                }
        return None
    finally:
        connection.close()
