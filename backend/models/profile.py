from pydantic import BaseModel, Field
from typing import Optional, List

class EntrepreneurProfile(BaseModel):
    id: Optional[str] = None
    name: str = Field(..., example="Ravi Kumar")
    age: int = Field(..., ge=18, le=100, example=32)
    gender: str = Field(..., example="Male")  # Male, Female, Other
    state: str = Field(..., example="Maharashtra")
    district: str = Field(..., example="Nashik")
    social_category: str = Field(..., example="OBC")  # SC, ST, OBC, General, Minority
    annual_income: float = Field(..., ge=0, example=320000)
    
    # Business Details
    business_name: str = Field(..., example="Kisan Agro Foods")
    business_type: str = Field(..., example="Food Processing")  # Agriculture, Food Processing, Handicrafts, Retail, Manufacturing, Services, Technology, Textile, Other
    industry: Optional[str] = None
    location: str = Field(default="Rural", example="Rural")  # Rural, Semi-Urban, Urban
    business_age: int = Field(..., ge=0, example=2)  # Years in business
    employees: int = Field(..., ge=0, example=4)
    annual_turnover: float = Field(default=0, example=650000)
    is_new_business: bool = Field(default=False)
    
    # Funding Details
    funding_required: float = Field(..., ge=5000, example=500000)
    funding_purpose: str = Field(..., example="Equipment Purchase")  # Business Expansion, Equipment Purchase, Working Capital, Training, Startup, Infrastructure, Marketing
    
    # Document tags available (optional)
    documents_available: Optional[List[str]] = Field(default_factory=list)

class MatchWeights(BaseModel):
    category_weight: float = 0.20
    business_type_weight: float = 0.15
    income_weight: float = 0.15
    funding_weight: float = 0.15
    state_weight: float = 0.15
    stage_weight: float = 0.10
    bonus_weight: float = 0.10
