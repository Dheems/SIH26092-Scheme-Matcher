from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import json
import uuid
from typing import Optional
from database.db import get_db_connection
from models.profile import EntrepreneurProfile, MatchWeights
from services.matcher import rank_schemes_for_profile
from routes.schemes import parse_scheme_row

router = APIRouter(prefix="/api", tags=["match"])

class MatchPayload(BaseModel):
    profile: EntrepreneurProfile
    weights: Optional[MatchWeights] = None

@router.post("/match")
async def match_schemes(request: Request):
    body = await request.json()
    if "profile" in body:
        profile = EntrepreneurProfile(**body["profile"])
        weights = MatchWeights(**body["weights"]) if "weights" in body and body["weights"] else MatchWeights()
    else:
        profile = EntrepreneurProfile(**body)
        weights = MatchWeights()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM schemes")
    rows = cursor.fetchall()

    cursor.execute("SELECT scheme_id FROM saved_schemes")
    saved_rows = cursor.fetchall()
    saved_ids = {r["scheme_id"] for r in saved_rows}
    conn.close()

    schemes = [parse_scheme_row(r) for r in rows]
    ranked = rank_schemes_for_profile(profile, schemes, weights, saved_ids)

    return {
        "profile": profile.model_dump(),
        "total_matched": len(ranked),
        "top_matches": [r.model_dump() for r in ranked[:5]],
        "all_matches": [r.model_dump() for r in ranked]
    }

@router.post("/profile")
async def save_profile(request: Request):
    body = await request.json()
    if "profile" in body:
        profile = EntrepreneurProfile(**body["profile"])
    else:
        profile = EntrepreneurProfile(**body)

    profile_id = profile.id or str(uuid.uuid4())[:8]
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO profiles (
        id, name, age, gender, state, district, social_category, annual_income,
        business_name, business_type, industry, location, business_age, employees,
        annual_turnover, is_new_business, funding_required, funding_purpose
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        profile_id, profile.name, profile.age, profile.gender, profile.state, profile.district,
        profile.social_category, profile.annual_income, profile.business_name, profile.business_type,
        profile.industry or profile.business_type, profile.location, profile.business_age,
        profile.employees, profile.annual_turnover, 1 if profile.is_new_business else 0,
        profile.funding_required, profile.funding_purpose
    ))
    conn.commit()

    cursor.execute("SELECT * FROM schemes")
    rows = cursor.fetchall()
    cursor.execute("SELECT scheme_id FROM saved_schemes")
    saved_rows = cursor.fetchall()
    saved_ids = {r["scheme_id"] for r in saved_rows}
    conn.close()

    schemes = [parse_scheme_row(r) for r in rows]
    ranked = rank_schemes_for_profile(profile, schemes, MatchWeights(), saved_ids)

    return {
        "profile_id": profile_id,
        "message": "Profile saved successfully.",
        "profile": profile.model_dump(),
        "total_matched": len(ranked),
        "top_matches": [r.model_dump() for r in ranked[:5]],
        "all_matches": [r.model_dump() for r in ranked]
    }

@router.get("/profile/{profile_id}")
def get_profile(profile_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM profiles WHERE id = ?", (profile_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Profile not found")
    d = dict(row)
    d["is_new_business"] = bool(d["is_new_business"])
    return d

@router.get("/recommendations/{profile_id}")
def get_recommendations_for_profile(profile_id: str):
    profile_dict = get_profile(profile_id)
    profile = EntrepreneurProfile(**profile_dict)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM schemes")
    rows = cursor.fetchall()
    cursor.execute("SELECT scheme_id FROM saved_schemes")
    saved_rows = cursor.fetchall()
    saved_ids = {r["scheme_id"] for r in saved_rows}
    conn.close()

    schemes = [parse_scheme_row(r) for r in rows]
    ranked = rank_schemes_for_profile(profile, schemes, MatchWeights(), saved_ids)
    return {
        "profile": profile.model_dump(),
        "total_matched": len(ranked),
        "top_matches": [r.model_dump() for r in ranked[:5]],
        "all_matches": [r.model_dump() for r in ranked]
    }
