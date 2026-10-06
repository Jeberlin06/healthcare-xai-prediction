from sqlalchemy.orm import Session
from .models import PatientRecord

def save_batch_records(db: Session, records: list):
    db_records = []
    for rec in records:
        patient = PatientRecord(
            patient_id=rec.get("patient_id"),
            patient_name=rec.get("patient_name"),  # <-- Added field
            age=rec.get("age"),
            bp=rec.get("bp"),
            sg=rec.get("sg"),
            al=rec.get("al"),
            su=rec.get("su"),
            bgr=rec.get("bgr"),
            bu=rec.get("bu"),
            sc=rec.get("sc"),
            risk_score=rec.get("calculated_risk_score"),
            risk_classification=rec.get("risk_classification")
        )
        db_records.append(patient)

    db.add_all(db_records)
    db.commit()
    for rec in db_records:
        db.refresh(rec)
    return db_records

def get_all_patients(db: Session):
    db.commit()
    return db.query(PatientRecord).order_by(PatientRecord.id.desc()).all()