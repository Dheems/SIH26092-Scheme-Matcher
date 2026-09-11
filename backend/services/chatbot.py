import os
import json
import requests
from typing import Dict, Any, List, Optional

def query_external_llm(prompt: str, system_prompt: str) -> Optional[str]:
    # Check Google Gemini API Key
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            payload = {
                "contents": [
                    {"role": "user", "parts": [{"text": f"{system_prompt}\n\nUser Question: {prompt}"}]}
                ]
            }
            res = requests.post(url, json=payload, timeout=8)
            if res.status_code == 200:
                data = res.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            pass

    # Check OpenAI API Key
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"}
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 400
            }
            res = requests.post(url, headers=headers, json=payload, timeout=8)
            if res.status_code == 200:
                data = res.json()
                return data["choices"][0]["message"]["content"]
        except Exception:
            pass

    return None

def get_schemesaathi_response(
    query: str,
    profile: Optional[Dict[str, Any]] = None,
    current_scheme: Optional[Dict[str, Any]] = None,
    matched_schemes: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    query_lower = query.lower().strip()
    profile = profile or {}
    user_name = profile.get("name", "Entrepreneur")
    user_cat = profile.get("social_category", "OBC")
    user_biz = profile.get("business_type", "Food Processing")
    user_state = profile.get("state", "Maharashtra")
    user_fund = profile.get("funding_required", 500000)

    # 1. First attempt real LLM if configured
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    if gemini_key or openai_key:
        system_prompt = (
            f"You are SchemeSaathi, an empathetic AI advisor helping Indian marginalized entrepreneurs. "
            f"Current entrepreneur context: Name: {user_name}, Category: {user_cat}, Sector: {user_biz}, "
            f"State: {user_state}, Funding needed: ₹{user_fund:,.0f}. "
            f"Provide concise, encouraging, and legally accurate advice. Remind users to verify details on official portals."
        )
        llm_reply = query_external_llm(query, system_prompt)
        if llm_reply:
            return {
                "reply": llm_reply,
                "source": "LLM-Connected (Live API)",
                "suggested_prompts": [
                    "What documents are needed?",
                    "How to get Udyam registration?",
                    "Check equipment subsidy percentage"
                ]
            }

    # 2. Rule-Based Intelligent SchemeSaathi Fallback
    reply = ""
    suggested_prompts = []

    if any(k in query_lower for k in ["what schemes", "which scheme can i apply", "eligible for", "my matches"]):
        reply = (
            f"Namaste {user_name}! Based on your profile as an **{user_cat} entrepreneur in {user_state}** "
            f"running a **{user_biz}** business seeking **₹{user_fund:,.0f}**, here are your top options:\n\n"
            f"1. **PM-FME (Micro Food Processing)** — Up to 35% capital subsidy (max ₹10 Lakhs) with 10% promoter margin.\n"
            f"2. **PMEGP** — Credit-linked subsidy up to 35% in rural areas for OBC/SC/ST/Women beneficiaries.\n"
            f"3. **Pradhan Mantri MUDRA Yojana (Kishore)** — Collateral-free bank loan up to ₹5,00,000.\n"
            f"4. **CGTMSE** — Up to 85% credit guarantee without any third-party mortgage.\n\n"
            f"Would you like me to explain the exact document checklist for any of these?"
        )
        suggested_prompts = [
            "What documents do I need?",
            "Explain PM-FME in simple language",
            "How do I apply?"
        ]

    elif any(k in query_lower for k in ["why am i not eligible", "not eligible", "stand-up", "ineligible"]):
        reply = (
            f"Good question! Eligibility rules are designed to protect target beneficiaries:\n\n"
            f"• **Stand-Up India:** Restricted exclusively to **SC, ST, and Women entrepreneurs** for **Greenfield (new)** projects above ₹10 Lakhs. If you are OBC Male or an existing unit, Stand-Up India does not apply, but **PMEGP** or **MUDRA Tarun** provides equivalent benefits.\n"
            f"• **ASIIM & VCF-SC:** Require at least 51% Scheduled Caste (SC) promoter shareholding.\n"
            f"• **PM SVANidhi:** Specifically designed for urban street vendors rather than registered manufacturing units.\n\n"
            f"Always check our **'What can I do to become eligible?'** section to see actionable ways to qualify!"
        )
        suggested_prompts = [
            "What can I do to improve eligibility?",
            "What schemes can I apply for?",
            "How do I get Udyam registration?"
        ]

    elif any(k in query_lower for k in ["document", "documents", "paperwork", "checklist"]):
        reply = (
            f"Here is the universal document checklist for micro-business government schemes in India:\n\n"
            f"1. **Identity & Address:** Aadhaar Card (linked with active mobile number) and PAN Card.\n"
            f"2. **Category Proof:** Digital Caste/Community Certificate issued by Tahsildar / Revenue Department.\n"
            f"3. **Business Registration:** **Udyam Registration Certificate** (Instant & Free on udyamregistration.gov.in).\n"
            f"4. **Financial Records:** 6 months Bank Statement and previous year Income Certificate / ITR (if available).\n"
            f"5. **Project Proposal:** Detailed Project Report (DPR) with machine price quotations and estimated cash flows."
        )
        suggested_prompts = [
            "How do I get Udyam registration?",
            "Which scheme offers funding for equipment?",
            "How do I apply?"
        ]

    elif any(k in query_lower for k in ["equipment", "machinery", "tools", "purchase machinery"]):
        reply = (
            f"For purchasing machinery and equipment, the top schemes are:\n\n"
            f"• **PM-FME:** Offers **35% capital subsidy** directly credited against equipment invoices for food processing.\n"
            f"• **PMEGP:** 25% to 35% margin money subsidy on plant and machinery term loans.\n"
            f"• **National SC-ST Hub (NSSH):** 25% capital subsidy on machinery purchase for SC/ST units.\n"
            f"• **PM Vishwakarma:** ₹15,000 e-voucher toolkit grant for traditional trades.\n\n"
            f"Tip: Always obtain formal proforma invoices from GST-registered machinery manufacturers before submitting your DPR."
        )
        suggested_prompts = [
            "What documents do I need?",
            "What schemes can I apply for?",
            "How do I apply?"
        ]

    elif any(k in query_lower for k in ["udyam", "msme registration"]):
        reply = (
            f"**How to get Udyam Registration (100% Free & Self-Service):**\n\n"
            f"1. Visit the official Indian MSME portal: **udyamregistration.gov.in**.\n"
            f"2. Do NOT pay any private agency; government registration is completely FREE.\n"
            f"3. Requirements: Aadhaar number and OTP verification.\n"
            f"4. Select your enterprise activity (NIC code for your trade).\n"
            f"5. Your digital Udyam Certificate with QR code is issued within 24–48 hours."
        )
        suggested_prompts = [
            "What documents do I need?",
            "What schemes can I apply for?",
            "How do I apply?"
        ]

    elif any(k in query_lower for k in ["how to apply", "application step", "apply"]):
        reply = (
            f"**Universal 5-Step Application Process:**\n\n"
            f"1. **Digital KYC & Udyam:** Ensure Aadhaar-linked mobile and Udyam certificate are ready.\n"
            f"2. **DPR & Quotations:** Prepare a 2-page project report with equipment quotations.\n"
            f"3. **Online Portal Submission:** Apply through designated portals (e.g. **JanSamarth.in** for Mudra, **kviconline.gov.in** for PMEGP, **pmfme.mofpi.gov.in** for Food Processing).\n"
            f"4. **District Committee / Bank Scrutiny:** The District Nodal Agency verifies documents and forwards to your chosen branch.\n"
            f"5. **Sanction & Subsidy Credit:** Bank sanctions loan; subsidy is locked in a Subsidy Reserve Fund (TDR) account."
        )
        suggested_prompts = [
            "What schemes can I apply for?",
            "What documents do I need?",
            "Explain PM-FME in simple language"
        ]

    elif any(k in query_lower for k in ["simple language", "explain", "pm-fme", "pmegp", "mudra"]):
        reply = (
            f"Let's explain government schemes in everyday words:\n\n"
            f"Think of these schemes as a **government partnership** for your shop or workshop:\n"
            f"• If a new machine costs **₹5,00,000**, under schemes like **PM-FME or PMEGP**, the government contributes up to **35% (₹1,75,000)** as a free grant/subsidy that you do NOT repay.\n"
            f"• You invest only **10% (₹50,000)** of your own savings.\n"
            f"• The bank lends the remaining **55% (₹2,75,000)** at low interest rates with no property mortgage required!"
        )
        suggested_prompts = [
            "Which scheme offers funding for equipment?",
            "What documents do I need?",
            "How do I apply?"
        ]

    else:
        reply = (
            f"Hello {user_name}! I am **SchemeSaathi**, your personal guide for Indian government schemes and subsidies.\n\n"
            f"I can help you:\n"
            f"• Find all schemes matching your {user_cat} category and {user_biz} sector in {user_state}.\n"
            f"• Explain why you match or what documents you need to collect.\n"
            f"• Clarify collateral-free loan terms and subsidy rules.\n\n"
            f"How can I assist your business journey today?"
        )
        suggested_prompts = [
            "What schemes can I apply for?",
            "Which scheme offers funding for equipment?",
            "What documents do I need?",
            "How do I apply?"
        ]

    return {
        "reply": reply,
        "source": "SchemeSaathi Knowledge Engine",
        "suggested_prompts": suggested_prompts
    }
