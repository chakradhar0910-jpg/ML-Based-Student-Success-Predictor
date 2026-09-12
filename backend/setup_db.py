import pymysql
from config import Config
import os

def setup_db():
    print("Connecting to MySQL server...")
    conn = pymysql.connect(
        host=Config.DATABASE_HOST,
        user=Config.DATABASE_USER,
        password=Config.DATABASE_PASSWORD
    )
    
    with conn.cursor() as cursor:
        print(f"Creating database {Config.DATABASE_NAME} if not exists...")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {Config.DATABASE_NAME}")
    
    conn.commit()
    conn.close()

    print("Connecting to database...")
    conn = pymysql.connect(
        host=Config.DATABASE_HOST,
        user=Config.DATABASE_USER,
        password=Config.DATABASE_PASSWORD,
        database=Config.DATABASE_NAME
    )

    with conn.cursor() as cursor:
        # Read and execute schema
        schema_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'schema.sql')
        print(f"Executing schema from {schema_path}...")
        with open(schema_path, 'r') as f:
            sql_script = f.read()
            statements = [s.strip() for s in sql_script.split(';') if s.strip()]
            for statement in statements:
                try:
                    cursor.execute(statement)
                except Exception as e:
                    print(f"Error executing statement: {statement[:50]}... Error: {e}")

        # Read and execute seed
        seed_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'seed.sql')
        print(f"Executing seed from {seed_path}...")
        with open(seed_path, 'r') as f:
            sql_script = f.read()
            statements = [s.strip() for s in sql_script.split(';') if s.strip()]
            for statement in statements:
                try:
                    cursor.execute(statement)
                except Exception as e:
                    print(f"Error executing statement: {statement[:50]}... Error: {e}")

    conn.commit()
    conn.close()
    print("Database setup complete.")

if __name__ == '__main__':
    setup_db()
