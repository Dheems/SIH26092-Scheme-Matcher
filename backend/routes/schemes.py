from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
import json
from database.db import get_db_connection

router = APIRouter(prefix="/api/schemes", tags=["schemes"])

def parse_scheme_row(row):
    d = dict(row)
    for k in ["target_beneficiaries", "business_types", "eligible_states", "business_stage", "required_documents", "eligibility_criteria", "application_steps"]:
        if k in d and isinstance(d[k], str):
            try:
                d[k] = json.loads(d[k])
            except Exception:
                d[k] = []
    return d

@router.get("")
def list_schemes(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    business_type: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    max_funding: Optional[float] = Query(None)
):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM schemes")
    rows = cursor.fetchall()
    conn.close()

    schemes = [parse_scheme_row(r) for r in rows]

    if search:
        s_lower = search.lower()
        schemes = [
            s for s in schemes
            if s_lower in s["name"].lower()
            or s_lower in s["code"].lower()
            or s_lower in s["ministry"].lower()
            or s_lower in s["description"].lower()
        ]

    if category and category.lower() != "all":
        schemes = [
            s for s in schemes
            if category in s.get("target_beneficiaries", []) or "All" in s.get("target_beneficiaries", []) or "General" in s.get("target_beneficiaries", [])
        ]

    if business_type and business_type.lower() != "all":
        schemes = [
            s for s in schemes
            if business_type in s.get("business_types", []) or "All" in s.get("business_types", [])
        ]

    if state and state.lower() != "all":
        schemes = [
            s for s in schemes
            if state in s.get("eligible_states", []) or "All" in s.get("eligible_states", [])
        ]

    if max_funding:
        schemes = [
            s for s in schemes
            if s.get("min_funding", 0) <= max_funding
        ]

    return {"total": len(schemes), "schemes": schemes}

@router.get("/saved")
def get_saved_schemes(profile_id: Optional[str] = Query(None)):
    conn = get_db_connection()
    cursor = conn.cursor()
    if profile_id:
        cursor.execute("""
            SELECT s.*, ss.saved_at, ss.notes
            FROM saved_schemes ss
            JOIN schemes s ON ss.scheme_id = s.id
            WHERE ss.profile_id = ?
            ORDER BY ss.saved_at DESC
        """, (profile_id,))
    else:
        cursor.execute("""
            SELECT s.*, ss.saved_at, ss.notes
            FROM saved_schemes ss
            JOIN schemes s ON ss.scheme_id = s.id
            ORDER BY ss.saved_at DESC
        """)
    rows = cursor.fetchall()
    conn.close()
    return {"saved": [parse_scheme_row(r) for r in rows]}

@router.get("/{scheme_id}")
def get_scheme(scheme_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM schemes WHERE id = ?", (scheme_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return parse_scheme_row(row)

@router.post("/{scheme_id}/save")
def toggle_save_scheme(scheme_id: str, profile_id: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    # Check if already saved
    if profile_id:
        cursor.execute("SELECT id FROM saved_schemes WHERE scheme_id = ? AND profile_id = ?", (scheme_id, profile_id))
    else:
        cursor.execute("SELECT id FROM saved_schemes WHERE scheme_id = ?", (scheme_id,))
    existing = cursor.fetchone()

    if existing:
        cursor.execute("DELETE FROM saved_schemes WHERE id = ?", (existing["id"],))
        conn.commit()
        conn.close()
        return {"saved": False, "message": "Scheme removed from saved list."}
    else:
        cursor.execute("INSERT INTO saved_schemes (profile_id, scheme_id) VALUES (?, ?)", (profile_id or "default_user", scheme_id))
        conn.commit()
        conn.close()
        return {"saved": True, "message": "Scheme saved to your dashboard bookmarks!"}
