import pymysql.cursors
from config import Config

def get_db_connection():
    return pymysql.connect(
        host=Config.DATABASE_HOST,
        port=Config.DATABASE_PORT,
        user=Config.DATABASE_USER,
        password=Config.DATABASE_PASSWORD,
        database=Config.DATABASE_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )
