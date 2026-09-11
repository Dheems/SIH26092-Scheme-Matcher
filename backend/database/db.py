import sqlite3
import os
import json

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "schemes.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Schemes Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS schemes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        ministry TEXT NOT NULL,
        description TEXT NOT NULL,
        target_beneficiaries TEXT NOT NULL,
        business_types TEXT NOT NULL,
        eligible_states TEXT NOT NULL,
        min_age INTEGER,
        max_age INTEGER,
        min_income INTEGER,
        max_income INTEGER,
        funding_type TEXT NOT NULL,
        min_funding INTEGER NOT NULL,
        max_funding INTEGER NOT NULL,
        subsidy_percentage TEXT,
        business_stage TEXT NOT NULL,
        required_documents TEXT NOT NULL,
        eligibility_criteria TEXT NOT NULL,
        application_steps TEXT NOT NULL,
        official_reference TEXT,
        verification_disclaimer TEXT
    )
    """)

    # Entrepreneur Profiles Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER,
        gender TEXT,
        state TEXT,
        district TEXT,
        social_category TEXT,
        annual_income REAL,
        business_name TEXT,
        business_type TEXT,
        industry TEXT,
        location TEXT,
        business_age INTEGER,
        employees INTEGER,
        annual_turnover REAL,
        is_new_business INTEGER,
        funding_required REAL,
        funding_purpose TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Saved Schemes / Bookmarks Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS saved_schemes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id TEXT,
        scheme_id TEXT NOT NULL,
        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        FOREIGN KEY (scheme_id) REFERENCES schemes (id)
    )
    """)

    conn.commit()
    conn.close()
