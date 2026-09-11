from pydantic import BaseModel
from typing import List, Optional

class SchemeBase(BaseModel):
    id: str
    name: str
    code: str
    ministry: str
    description: str
    target_beneficiaries: List[str]
    business_types: List[str]
    eligible_states: List[str]
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    min_income: Optional[int] = None
    max_income: Optional[int] = None
    funding_type: str
    min_funding: int
    max_funding: int
    subsidy_percentage: Optional[str] = None
    business_stage: List[str]
    required_documents: List[str]
    eligibility_criteria: List[str]
    application_steps: List[str]
    official_reference: Optional[str] = None
    verification_disclaimer: Optional[str] = None

class SchemeMatchResult(BaseModel):
    scheme: SchemeBase
    match_percentage: int
    score_breakdown: dict
    why_matched: List[str]
    missing_requirements: List[str]
    ai_recommendation: str
    actionable_steps: List[str]
    is_saved: bool = False
