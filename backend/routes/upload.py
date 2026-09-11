from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from services.doc_extractor import extract_from_pdf_stream, get_demo_extracted_profile

router = APIRouter(prefix="/api/upload", tags=["upload"])

@router.post("")
async def upload_document(
    file: Optional[UploadFile] = File(None),
    demo: Optional[bool] = Form(False),
    persona: Optional[str] = Form("ravi")
):
    if demo:
        # Provide simulated realistic extraction
        demo_profile = get_demo_extracted_profile(persona)
        return {
            "mode": "demo",
            "status": "success",
            "message": "Sample documents analyzed using Prototype Document Engine",
            "sample_files": [
                {"name": "Income_Certificate_2024.pdf", "status": "Verified", "type": "Income Certificate"},
                {"name": "Udyam_Registration_MH20.pdf", "status": "Verified", "type": "MSME Registration"},
                {"name": "Caste_Certificate_OBC.pdf", "status": "Verified", "type": "Category Proof"}
            ],
            "extracted_data": demo_profile
        }

    if not file:
        return {"status": "error", "message": "No file uploaded and demo flag is False"}

    content = await file.read()
    extracted = extract_from_pdf_stream(content, file.filename)

    return {
        "mode": "real_upload",
        "filename": file.filename,
        "filesize_bytes": len(content),
        "status": "success",
        "extracted_data": extracted
    }
