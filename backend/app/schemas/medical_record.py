from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.models import RecordType

class RecordAttachmentBase(BaseModel):
    file_url: str
    file_type: Optional[str] = None
    file_name: Optional[str] = None

class RecordAttachmentResponse(RecordAttachmentBase):
    id: int
    record_id: int

    class Config:
        from_attributes = True

class MedicalRecordBase(BaseModel):
    title: str
    diagnosis: Optional[str] = None
    treatment: Optional[str] = None
    notes: Optional[str] = None
    type: RecordType

class MedicalRecordCreate(MedicalRecordBase):
    pass

class MedicalRecordResponse(MedicalRecordBase):
    id: int
    pet_id: int
    vet_id: Optional[int] = None
    clinic_id: Optional[int] = None
    date: datetime
    is_manual: bool
    created_at: datetime
    attachments: List[RecordAttachmentResponse] = []

    class Config:
        from_attributes = True
