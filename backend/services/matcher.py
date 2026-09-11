from typing import List, Dict, Any
import json
from models.profile import EntrepreneurProfile, MatchWeights
from models.scheme import SchemeMatchResult, SchemeBase

DEFAULT_WEIGHTS = MatchWeights()

def calculate_scheme_match(
    profile: EntrepreneurProfile,
    scheme_data: Dict[str, Any],
    weights: MatchWeights = DEFAULT_WEIGHTS,
    saved_ids: set = None
) -> SchemeMatchResult:
    if saved_ids is None:
        saved_ids = set()

    why_matched = []
    missing_requirements = []
    actionable_steps = []
    
    # 1. Category / Social Beneficiary Match (Weight: 20%)
    category_score = 0.0
    targets = scheme_data.get("target_beneficiaries", [])
    user_category = profile.social_category
    user_gender = profile.gender
    
    if "All" in targets or "General" in targets:
        category_score = 0.75
        why_matched.append("Open to all social categories including General.")
    
    # Affirmative / specialized matching
    if user_category in targets:
        category_score = 1.0
        why_matched.append(f"Specifically prioritizes {user_category} entrepreneurs with preferential subsidies/quotas.")
    elif user_gender.lower() == "female" and "Women" in targets:
        category_score = 1.0
        why_matched.append("Provides affirmative credit terms and higher subsidy brackets for Women entrepreneurs.")
    elif category_score == 0.0:
        missing_requirements.append(f"Targeted primarily for {', '.join(targets)} beneficiaries; verify general category quota.")
        actionable_steps.append(f"Review if you qualify as part of a joint partnership or SHG with {', '.join(targets)} leadership.")

    # 2. Business Type / Sector Match (Weight: 15%)
    biz_type_score = 0.0
    allowed_types = scheme_data.get("business_types", [])
    user_biz = profile.business_type

    if "All" in allowed_types or user_biz in allowed_types:
        biz_type_score = 1.0
        why_matched.append(f"Directly supports {user_biz} enterprises.")
    else:
        # Check allied/overlap
        if ("Agriculture" in allowed_types and user_biz == "Food Processing") or \
           ("Manufacturing" in allowed_types and user_biz in ["Textile", "Handicrafts", "Food Processing"]):
            biz_type_score = 0.70
            why_matched.append(f"{user_biz} is treated as an allied manufacturing/processing activity.")
        else:
            biz_type_score = 0.15
            missing_requirements.append(f"Sector focuses on {', '.join(allowed_types)} (your unit is {user_biz}).")
            actionable_steps.append(f"Explore diversifying or registering an allied product line under {allowed_types[0] if allowed_types else 'MSME'}.")

    # 3. Income Criteria (Weight: 15%)
    income_score = 0.0
    min_inc = scheme_data.get("min_income")
    max_inc = scheme_data.get("max_income")
    user_inc = profile.annual_income

    if max_inc is None or max_inc == 0:
        income_score = 1.0
        why_matched.append("No restrictive upper household income ceiling for this scheme.")
    elif user_inc <= max_inc:
        income_score = 1.0
        why_matched.append(f"Your annual income (₹{user_inc:,.0f}) is within the eligible ceiling of ₹{max_inc:,.0f}.")
    else:
        excess = user_inc - max_inc
        income_score = max(0.1, 1.0 - (excess / max_inc))
        missing_requirements.append(f"Reported household income (₹{user_inc:,.0f}) exceeds the target ceiling of ₹{max_inc:,.0f}.")
        actionable_steps.append("Verify whether the income ceiling applies to individual applicant or total household, or explore non-subsidized commercial credit schemes.")

    # 4. Funding Amount & Purpose (Weight: 15%)
    funding_score = 0.0
    min_fund = scheme_data.get("min_funding", 10000)
    max_fund = scheme_data.get("max_funding", 10000000)
    user_fund = profile.funding_required

    if min_fund <= user_fund <= max_fund:
        funding_score = 1.0
        why_matched.append(f"Your funding requirement (₹{user_fund:,.0f}) falls precisely within the scheme range (₹{min_fund:,.0f} - ₹{max_fund:,.0f}).")
    elif user_fund < min_fund:
        funding_score = max(0.4, user_fund / min_fund)
        missing_requirements.append(f"Requested funding (₹{user_fund:,.0f}) is below the scheme minimum of ₹{min_fund:,.0f}.")
        actionable_steps.append(f"Consider bundling working capital or additional equipment to reach the ₹{min_fund:,.0f} entry threshold.")
    else:
        funding_score = max(0.3, max_fund / user_fund)
        missing_requirements.append(f"Requested funding (₹{user_fund:,.0f}) exceeds the single-unit cap of ₹{max_fund:,.0f}.")
        actionable_steps.append(f"Apply for the maximum admissible cap of ₹{max_fund:,.0f} under this scheme and pair with CGTMSE for the balance.")

    # 5. State / Geographical Eligibility (Weight: 15%)
    state_score = 0.0
    eligible_states = scheme_data.get("eligible_states", ["All"])
    user_state = profile.state

    if "All" in eligible_states or user_state in eligible_states:
        state_score = 1.0
        why_matched.append(f"Fully operational and active across {user_state}.")
    else:
        state_score = 0.20
        missing_requirements.append(f"Primarily operational in: {', '.join(eligible_states)}.")
        actionable_steps.append(f"Check for reciprocal state department notifications in {user_state}.")

    # 6. Business Stage / Age (Weight: 10%)
    stage_score = 0.0
    stages = scheme_data.get("business_stage", ["New", "Existing"])
    is_new = profile.is_new_business or profile.business_age == 0

    if ("New" in stages and is_new) or ("Existing" in stages and not is_new) or ("Both" in stages) or (set(["New", "Existing"]).issubset(set(stages))):
        stage_score = 1.0
        why_matched.append(f"Supports {'New greenfield' if is_new else 'Existing operating'} business units.")
    else:
        stage_score = 0.40
        if is_new and "Existing" in stages:
            missing_requirements.append("Requires operating track record or audited financials for past 1-2 years.")
            actionable_steps.append("Complete 1 full year of recorded bank turnover or register as a nascent unit.")
        elif not is_new and "New" in stages:
            missing_requirements.append("Restricted strictly to greenfield / newly established units.")
            actionable_steps.append("Register a new subsidiary, special purpose entity, or greenfield expansion unit.")

    # 7. Affirmative Bonus / Location / Purpose (Weight: 10%)
    bonus_score = 0.5
    if profile.location.lower() == "rural":
        bonus_score += 0.3
        why_matched.append("Rural location qualifies for maximum 35% margin money / subsidy rates.")
    if profile.funding_purpose.lower() in ["equipment purchase", "machinery"]:
        bonus_score += 0.2
        why_matched.append("Capital equipment purchase is eligible for upfront capital subsidy.")

    # Document Verification Warnings
    req_docs = scheme_data.get("required_documents", [])
    user_docs = [d.lower() for d in (profile.documents_available or [])]
    
    # Check common docs
    if "udyam" in " ".join(req_docs).lower() and not any("udyam" in d for d in user_docs):
        missing_requirements.append("Udyam Registration Certificate required prior to bank sanction.")
        actionable_steps.append("Obtain free instant Udyam Registration at udyamregistration.gov.in.")
        
    if ("caste" in " ".join(req_docs).lower() or "category" in " ".join(req_docs).lower()) and profile.social_category in ["SC", "ST", "OBC"]:
        if not any("caste" in d or "category" in d for d in user_docs):
            missing_requirements.append("Valid Competent Authority Caste/Category Certificate required.")
            actionable_steps.append("Ensure digital caste certificate is stamped by Tahsildar/Revenue Authority.")

    # Total Weighted Score (0 to 100)
    total_score = (
        (category_score * weights.category_weight) +
        (biz_type_score * weights.business_type_weight) +
        (income_score * weights.income_weight) +
        (funding_score * weights.funding_weight) +
        (state_score * weights.state_weight) +
        (stage_score * weights.stage_weight) +
        (bonus_score * weights.bonus_weight)
    ) * 100

    match_percentage = min(98, max(28, int(round(total_score))))

    # Personalized AI Recommendation Narrative
    name = profile.name.split()[0] if profile.name else "Entrepreneur"
    if match_percentage >= 80:
        ai_recommendation = (
            f"High Match for {name}: Your {profile.business_type} enterprise in {profile.state} "
            f"strongly aligns with this scheme. Your category ({profile.social_category}) qualifies for optimal subsidy "
            f"and your requested funding of ₹{profile.funding_required:,.0f} fits the scheme envelope."
        )
    elif match_percentage >= 65:
        ai_recommendation = (
            f"Moderate Match for {name}: While your {profile.business_type} activity and location qualify, "
            f"ensure you meet specific document requirements and verify your exact loan eligibility at your lending branch."
        )
    else:
        ai_recommendation = (
            f"Partial Match for {name}: Certain criteria (such as targeted sector or funding cap) "
            f"partially diverge. Follow the actionable recommendations below to improve your eligibility profile."
        )

    scheme_base = SchemeBase(
        id=scheme_data["id"],
        name=scheme_data["name"],
        code=scheme_data["code"],
        ministry=scheme_data["ministry"],
        description=scheme_data["description"],
        target_beneficiaries=scheme_data.get("target_beneficiaries", []),
        business_types=scheme_data.get("business_types", []),
        eligible_states=scheme_data.get("eligible_states", []),
        min_age=scheme_data.get("min_age"),
        max_age=scheme_data.get("max_age"),
        min_income=scheme_data.get("min_income"),
        max_income=scheme_data.get("max_income"),
        funding_type=scheme_data.get("funding_type", "Financial Support"),
        min_funding=scheme_data.get("min_funding", 0),
        max_funding=scheme_data.get("max_funding", 0),
        subsidy_percentage=scheme_data.get("subsidy_percentage"),
        business_stage=scheme_data.get("business_stage", []),
        required_documents=scheme_data.get("required_documents", []),
        eligibility_criteria=scheme_data.get("eligibility_criteria", []),
        application_steps=scheme_data.get("application_steps", []),
        official_reference=scheme_data.get("official_reference"),
        verification_disclaimer=scheme_data.get("verification_disclaimer")
    )

    return SchemeMatchResult(
        scheme=scheme_base,
        match_percentage=match_percentage,
        score_breakdown={
            "category": int(category_score * 100),
            "business_type": int(biz_type_score * 100),
            "income": int(income_score * 100),
            "funding": int(funding_score * 100),
            "state": int(state_score * 100),
            "stage": int(stage_score * 100),
        },
        why_matched=why_matched[:5],
        missing_requirements=missing_requirements[:4] if missing_requirements else ["Verify current district target quota with nodal bank."],
        ai_recommendation=ai_recommendation,
        actionable_steps=actionable_steps[:4] if actionable_steps else ["Maintain regular business bank ledger statements.", "Keep digital KYC handy for one-step Aadhaar e-verification."],
        is_saved=(scheme_data["id"] in saved_ids)
    )

def rank_schemes_for_profile(
    profile: EntrepreneurProfile,
    all_schemes: List[Dict[str, Any]],
    weights: MatchWeights = DEFAULT_WEIGHTS,
    saved_ids: set = None
) -> List[SchemeMatchResult]:
    results = [
        calculate_scheme_match(profile, s, weights, saved_ids)
        for s in all_schemes
    ]
    results.sort(key=lambda x: x.match_percentage, reverse=True)
    return results
