from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from services.chatbot import get_schemesaathi_response

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatRequest(BaseModel):
    query: str
    profile: Optional[Dict[str, Any]] = None
    current_scheme: Optional[Dict[str, Any]] = None
    matched_schemes: Optional[List[Dict[str, Any]]] = None

@router.post("")
def chat_with_schemesaathi(req: ChatRequest):
    result = get_schemesaathi_response(
        query=req.query,
        profile=req.profile,
        current_scheme=req.current_scheme,
        matched_schemes=req.matched_schemes
    )
    return result
