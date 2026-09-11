import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app import app

client = TestClient(app)

test_profile = {
    "name": "Ravi Kumar",
    "age": 32,
    "gender": "Male",
    "state": "Maharashtra",
    "district": "Nashik",
    "social_category": "OBC",
    "annual_income": 320000,
    "business_name": "Kisan Agro Foods",
    "business_type": "Food Processing",
    "location": "Rural",
    "business_age": 2,
    "employees": 4,
    "annual_turnover": 650000,
    "is_new_business": False,
    "funding_required": 500000,
    "funding_purpose": "Equipment Purchase"
}

# 1. Health
r = client.get("/api/health")
assert r.status_code == 200
print("1. Health OK:", r.json()["status"])

# 2. Match
r = client.post("/api/match", json=test_profile)
assert r.status_code == 200
d = r.json()
print("2. Match computed OK:")
for idx, match in enumerate(d["top_matches"][:3]):
    scheme_name = match["scheme"]["name"]
    pct = match["match_percentage"]
    print(f"   Rank #{idx+1}: {scheme_name} -> {pct}%")

# 3. Save Profile
r = client.post("/api/profile", json=test_profile)
assert r.status_code == 200
p_id = r.json()["profile_id"]
print("3. Profile Saved OK. ID:", p_id)

# 4. Toggle Save Scheme
scheme_id = d["top_matches"][0]["scheme"]["id"]
r = client.post(f"/api/schemes/{scheme_id}/save?profile_id={p_id}")
assert r.status_code == 200
print("4. Save Scheme Bookmark OK:", r.json()["message"])

# 5. List Saved Schemes
r = client.get(f"/api/schemes/saved?profile_id={p_id}")
assert r.status_code == 200
print("5. Saved Schemes count:", len(r.json()["saved"]))

# 6. Chat with SchemeSaathi
r = client.post("/api/chat", json={"query": "Which scheme offers funding for equipment?", "profile": test_profile})
assert r.status_code == 200
print("6. SchemeSaathi reply OK! Source:", r.json()["source"])

# 7. Demo Document Upload
r = client.post("/api/upload", data={"demo": "true", "persona": "ravi"})
assert r.status_code == 200
print("7. Demo upload extraction OK:", r.json()["extracted_data"]["name"])
print("\nALL 7 BACKEND API TESTS PASSED PERFECTLY!")
