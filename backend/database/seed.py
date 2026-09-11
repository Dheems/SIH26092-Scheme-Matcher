import json
import os
import sys

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
DATA_FILE = os.path.join(PROJECT_ROOT, "data", "schemes.json")

if BACKEND_DIR not in sys.path:
    sys.path.append(BACKEND_DIR)

from database.db import get_db_connection, init_db

def seed_schemes():
    init_db()
    if not os.path.exists(DATA_FILE):
        print(f"Error: {DATA_FILE} not found.")
        return

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        schemes = json.load(f)

    conn = get_db_connection()
    cursor = conn.cursor()

    for s in schemes:
        cursor.execute("""
        INSERT OR REPLACE INTO schemes (
            id, name, code, ministry, description,
            target_beneficiaries, business_types, eligible_states,
            min_age, max_age, min_income, max_income,
            funding_type, min_funding, max_funding,
            subsidy_percentage, business_stage, required_documents,
            eligibility_criteria, application_steps,
            official_reference, verification_disclaimer
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            s["id"],
            s["name"],
            s["code"],
            s["ministry"],
            s["description"],
            json.dumps(s["target_beneficiaries"]),
            json.dumps(s["business_types"]),
            json.dumps(s["eligible_states"]),
            s.get("min_age"),
            s.get("max_age"),
            s.get("min_income"),
            s.get("max_income"),
            s["funding_type"],
            s["min_funding"],
            s["max_funding"],
            s.get("subsidy_percentage", "N/A"),
            json.dumps(s["business_stage"]),
            json.dumps(s["required_documents"]),
            json.dumps(s["eligibility_criteria"]),
            json.dumps(s["application_steps"]),
            s.get("official_reference", ""),
            s.get("verification_disclaimer", "Verify current eligibility on official portal.")
        ))

    conn.commit()
    cursor.execute("SELECT COUNT(*) FROM schemes")
    count = cursor.fetchone()[0]
    conn.close()
    print(f"Seeded {count} schemes successfully.")

if __name__ == "__main__":
    seed_schemes()
