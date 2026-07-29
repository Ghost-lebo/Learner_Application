from fastapi import FastAPI, UploadFile, Form, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil, os, json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
DB_FILE = "applications.json"
SPACES = {str(i): 30 for i in range(1,13)} # 30 spaces per grade to start

@app.get("/spaces")
def get_spaces():
    return SPACES

@app.post("/apply")
async def apply(
    child_name: str = Form(...),
    parent_name: str = Form(...),
    grade: str = Form(...),
    address: str = Form(...),
    parent_id: UploadFile = File(...),
    proof_address: UploadFile = File(...),
    clinic_card: UploadFile = File(None),
    medical_aid: UploadFile = File(None),
):
    # Save files
    for f in [parent_id, proof_address, clinic_card, medical_aid]:
        if f:
            path = f"uploads/{f.filename}"
            with open(path, "wb") as buffer: shutil.copyfileobj(f.file, buffer)
    
    # Update spaces
    if int(grade) in range(1,13) and SPACES[grade] > 0:
        SPACES[grade] -= 1
    
    return {"message": "Application submitted to Heidelberg Academy"}
