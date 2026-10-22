import os
import io
import json
from typing import List
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Response, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import pandas as pd

from database import engine, Base, get_db
from . import models, crud

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HealthAI XAI Realtime API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Real-Time WebSocket Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

# --- Risk Logic ---
def calculate_kidney_risk(row):
    bu_val = float(row['bu']) if pd.notnull(row.get('bu')) else 0.0
    sc_val = float(row['sc']) if pd.notnull(row.get('sc')) else 0.0
    al_val = float(row['al']) if pd.notnull(row.get('al')) else 0.0

    risk_score = min(round((bu_val * 0.3) + (sc_val * 1.5) + (al_val * 10), 2), 100.0)

    if risk_score >= 60.0:
        classification = "High Risk"
    elif risk_score >= 30.0:
        classification = "Moderate Risk"
    else:
        classification = "Low Risk"

    return risk_score, classification


# --- Realtime WebSocket Endpoint ---
@app.websocket("/ws/patients")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


# --- Batch Endpoint with Broadcast ---
@app.post("/api/predict/batch/kidney")
async def predict_batch_kidney(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")

    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        df.columns = df.columns.str.strip().str.lower()

        required_cols = ['age', 'bp', 'sg', 'al', 'su', 'bgr', 'bu', 'sc']
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            raise HTTPException(status_code=400, detail=f"Missing: {', '.join(missing_cols)}")

        processed_records = []
        for _, row in df.iterrows():
            risk_score, classification = calculate_kidney_risk(row)
            record = {
                "patient_id": str(row["patient_id"]) if "patient_id" in row and pd.notnull(row["patient_id"]) else None,
                "patient_name": str(row["patient_name"]) if "patient_name" in row and pd.notnull(row["patient_name"]) else "N/A",  # <-- Added field
                "age": int(row['age']) if pd.notnull(row['age']) else None,
                "bp": float(row['bp']) if pd.notnull(row['bp']) else None,
                "sg": float(row['sg']) if pd.notnull(row['sg']) else None,
                "al": float(row['al']) if pd.notnull(row['al']) else None,
                "su": float(row['su']) if pd.notnull(row['su']) else None,
                "bgr": float(row['bgr']) if pd.notnull(row['bgr']) else None,
                "bu": float(row['bu']) if pd.notnull(row['bu']) else None,
                "sc": float(row['sc']) if pd.notnull(row['sc']) else None,
                "calculated_risk_score": risk_score,
                "risk_classification": classification
            }
            processed_records.append(record)

        saved_records = crud.save_batch_records(db, processed_records)

        # Real-time Broadcast to all connected clients
        await manager.broadcast({
            "event": "NEW_RECORDS_SAVED",
            "count": len(saved_records)
        })

        return {"status": "success", "total_records": len(saved_records)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/patients")
def fetch_patient_records(response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    db.expire_all()
    patients = crud.get_all_patients(db)
    return {"status": "success", "data": patients}

# Static file serving & HTML pages
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))

@app.get("/{page_name}.html")
async def serve_generic_page(page_name: str):
    page_path = os.path.join(FRONTEND_DIR, "pages", f"{page_name}.html")
    if os.path.exists(page_path):
        return FileResponse(page_path)
    raise HTTPException(status_code=404, detail="Page not found.")

if os.path.exists(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR), name="frontend")
