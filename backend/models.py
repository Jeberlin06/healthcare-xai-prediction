from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from database import Base
class PatientRecord(Base):
    __tablename__ = "patient_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, nullable=True)
    patient_name = Column(String, nullable=True)  # <-- Added field
    age = Column(Integer, nullable=True)
    bp = Column(Float, nullable=True)
    sg = Column(Float, nullable=True)
    al = Column(Float, nullable=True)
    su = Column(Float, nullable=True)
    bgr = Column(Float, nullable=True)
    bu = Column(Float, nullable=True)
    sc = Column(Float, nullable=True)
    risk_score = Column(Float, nullable=True)
    risk_classification = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
