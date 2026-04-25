import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Date, Float, Text
from sqlalchemy.orm import relationship
from app.database import Base

class UserRole(str, enum.Enum):
    owner = "owner"
    vet = "vet"

class RecordType(str, enum.Enum):
    vaccine = "vaccine"
    consult = "consult"
    exam = "exam"
    manual = "manual"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    pets = relationship("Pet", back_populates="owner")
    vet_profile = relationship("Vet", back_populates="user", uselist=False)

class Pet(Base):
    __tablename__ = "pets"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    species = Column(String, nullable=False)
    breed = Column(String)
    sex = Column(String)
    birth_date = Column(Date)
    weight = Column(Float)
    microchip = Column(String)
    color = Column(String)
    notes = Column(Text)
    photo_url = Column(String)

    owner = relationship("User", back_populates="pets")
    medical_records = relationship("MedicalRecord", back_populates="pet")

class Clinic(Base):
    __tablename__ = "clinics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String)
    phone = Column(String)
    rut = Column(String)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    vets = relationship("Vet", back_populates="clinic")
    medical_records = relationship("MedicalRecord", back_populates="clinic")

class Vet(Base):
    __tablename__ = "vets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=False)
    license_number = Column(String, nullable=False)
    specialty = Column(String)

    user = relationship("User", back_populates="vet_profile")
    clinic = relationship("Clinic", back_populates="vets")
    medical_records = relationship("MedicalRecord", back_populates="vet")

class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id"), nullable=False)
    vet_id = Column(Integer, ForeignKey("vets.id"), nullable=True)
    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=True)
    type = Column(SQLEnum(RecordType), nullable=False)
    title = Column(String, nullable=False)
    diagnosis = Column(Text)
    treatment = Column(Text)
    notes = Column(Text)
    date = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    is_manual = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    pet = relationship("Pet", back_populates="medical_records")
    vet = relationship("Vet", back_populates="medical_records")
    clinic = relationship("Clinic", back_populates="medical_records")
    attachments = relationship("RecordAttachment", back_populates="medical_record")
    vaccine = relationship("Vaccine", back_populates="medical_record", uselist=False)

class RecordAttachment(Base):
    __tablename__ = "record_attachments"

    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(Integer, ForeignKey("medical_records.id"), nullable=False)
    file_url = Column(String, nullable=False)
    file_type = Column(String)
    file_name = Column(String)

    medical_record = relationship("MedicalRecord", back_populates="attachments")

class Vaccine(Base):
    __tablename__ = "vaccines"

    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(Integer, ForeignKey("medical_records.id"), nullable=False)
    vaccine_name = Column(String, nullable=False)
    brand = Column(String)
    batch = Column(String)
    next_dose_date = Column(Date)

    medical_record = relationship("MedicalRecord", back_populates="vaccine")
