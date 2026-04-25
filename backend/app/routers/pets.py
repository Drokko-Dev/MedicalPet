from datetime import timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, Pet, MedicalRecord
from app.schemas.pet import PetCreate, PetUpdate, PetResponse
from app.schemas.medical_record import MedicalRecordCreate, MedicalRecordResponse
from app.dependencies import get_current_user
from app.services.auth import create_access_token

router = APIRouter(prefix="/pets", tags=["pets"])

# ================================
# Pets CRUD
# ================================

@router.get("/", response_model=List[PetResponse])
def get_pets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Owner only sees their own pets
    pets = db.query(Pet).filter(Pet.owner_id == current_user.id).all()
    return pets

@router.post("/", response_model=PetResponse, status_code=status.HTTP_201_CREATED)
def create_pet(pet_in: PetCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pet = Pet(**pet_in.model_dump(), owner_id=current_user.id)
    db.add(pet)
    db.commit()
    db.refresh(pet)
    return pet

@router.put("/{pet_id}", response_model=PetResponse)
def update_pet(pet_id: int, pet_in: PetUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pet = db.query(Pet).filter(Pet.id == pet_id, Pet.owner_id == current_user.id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    update_data = pet_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(pet, key, value)
        
    db.commit()
    db.refresh(pet)
    return pet

@router.delete("/{pet_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pet(pet_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pet = db.query(Pet).filter(Pet.id == pet_id, Pet.owner_id == current_user.id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
        
    db.delete(pet)
    db.commit()
    return None

# ================================
# Medical Records
# ================================

@router.get("/{pet_id}/records", response_model=List[MedicalRecordResponse])
def get_pet_records(pet_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Validar que la mascota pertenece al dueño actual
    pet = db.query(Pet).filter(Pet.id == pet_id, Pet.owner_id == current_user.id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
        
    records = db.query(MedicalRecord).filter(MedicalRecord.pet_id == pet_id).all()
    return records

@router.post("/{pet_id}/records", response_model=MedicalRecordResponse, status_code=status.HTTP_201_CREATED)
def create_manual_record(pet_id: int, record_in: MedicalRecordCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pet = db.query(Pet).filter(Pet.id == pet_id, Pet.owner_id == current_user.id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
        
    # Crear registro manual
    record = MedicalRecord(
        **record_in.model_dump(),
        pet_id=pet_id,
        is_manual=True,
        vet_id=None,
        clinic_id=None
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

# ================================
# QR Token
# ================================

@router.get("/{pet_id}/qr-token")
def get_qr_token(pet_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pet = db.query(Pet).filter(Pet.id == pet_id, Pet.owner_id == current_user.id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
        
    # Generar token temporal de 15 minutos
    expires = timedelta(minutes=15)
    token = create_access_token(
        data={"pet_id": pet_id, "type": "qr_share"}, 
        expires_delta=expires
    )
    
    return {"qr_token": token, "expires_in": 900}
