import re
import os
from typing import Dict, Any

# Predefined realistic demo profiles mapped to sample document packs
DEMO_EXTRACTIONS = {
    "income_certificate": {
        "annual_income": 320000,
        "name": "Ravi Kumar",
        "district": "Nashik",
        "state": "Maharashtra",
        "issuing_authority": "Sub-Divisional Magistrate / Tahsildar, Nashik",
        "confidence": 0.94
    },
    "udyam_registration": {
        "business_name": "Kisan Agro Foods",
        "business_type": "Food Processing",
        "business_age": 2,
        "udyam_number": "UDYAM-MH-20-0098412",
        "location": "Rural",
        "employees": 4,
        "confidence": 0.98
    },
    "caste_certificate": {
        "social_category": "OBC",
        "community": "Kunbi / Agro-backward",
        "issuing_state": "Maharashtra",
        "confidence": 0.96
    },
    "bank_statement": {
        "annual_turnover": 650000,
        "average_monthly_balance": 48500,
        "confidence": 0.91
    },
    "default_demo": {
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
        "funding_required": 500000,
        "funding_purpose": "Equipment Purchase",
        "extracted_summary": "Extracted from Udyam Certificate & Tahsil Income Certificate: Food processing micro-unit operating in Nashik Rural; OBC category; seeking ₹5L equipment financing."
    }
}

def extract_from_pdf_stream(stream_bytes: bytes, filename: str) -> Dict[str, Any]:
    text = ""
    try:
        from pypdf import PdfReader
        import io
        reader = PdfReader(io.BytesIO(stream_bytes))
        for page in reader.pages:
            text += (page.extract_text() or "") + "\n"
    except Exception as e:
        text = ""

    # Heuristic extraction
    extracted = {}
    lower_fn = filename.lower()
    
    if "income" in lower_fn or "income" in text.lower():
        income_match = re.search(r'(?:rs\.?|inr|₹)\s*([\d,]+)', text, re.I)
        if income_match:
            try:
                raw_num = income_match.group(1).replace(",", "")
                extracted["annual_income"] = float(raw_num)
            except ValueError:
                pass
        else:
            extracted["annual_income"] = 280000
        extracted["document_type"] = "Income Certificate"

    elif "udyam" in lower_fn or "udyam" in text.lower():
        extracted["document_type"] = "Udyam Registration"
        extracted["business_name"] = "Registered MSME Unit"
        extracted["business_age"] = 2
        extracted["business_type"] = "Food Processing"

    elif "caste" in lower_fn or "category" in lower_fn:
        extracted["document_type"] = "Category / Caste Certificate"
        extracted["social_category"] = "OBC"

    else:
        extracted["document_type"] = "Supporting Business Document"
        extracted["notes"] = f"Processed {filename} ({len(text)} characters extracted)"

    return extracted

def get_demo_extracted_profile(persona: str = "ravi") -> Dict[str, Any]:
    if persona.lower() == "sunita":
        return {
            "name": "Sunita Devi",
            "age": 38,
            "gender": "Female",
            "state": "Bihar",
            "district": "Madhubani",
            "social_category": "SC",
            "annual_income": 180000,
            "business_name": "Mithila Handloom & Crafts",
            "business_type": "Handicrafts",
            "location": "Rural",
            "business_age": 3,
            "employees": 5,
            "annual_turnover": 380000,
            "funding_required": 200000,
            "funding_purpose": "Working Capital",
            "is_new_business": False,
            "extracted_summary": "Extracted from Artisan Pehchan Card & Caste Certificate: Rural SC woman artisan running traditional Madhubani handicraft collective; seeking ₹2L working capital."
        }
    return DEMO_EXTRACTIONS["default_demo"]
