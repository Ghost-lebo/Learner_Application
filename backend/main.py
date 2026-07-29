from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
import models
from database import engine, get_db
import time

# Wait for DB to be ready
for i in range(10):
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("DB is ready!")
        break
    except:
        print(f"Waiting for DB... {i+1}/10")
        time.sleep(2)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Heidelberg Academy High Admissions")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "app": "Heidelberg Academy High Backend"}

# NEW: List all grades/classes with availability
@app.get("/grades")
def get_grades(db: Session = Depends(get_db)):
    classes = db.query(models.GradeClass).order_by(models.GradeClass.grade_number, models.GradeClass.class_name).all()
    result = []
    for c in classes:
        spots_left = c.capacity - c.filled_count
        status = "AVAILABLE" if spots_left > 0 else "FULL"
        result.append({
            "id": c.id,
            "grade": f"Grade {c.grade_number}{c.class_name}",
            "grade_number": c.grade_number,
            "class": c.class_name,
            "capacity": c.capacity,
            "filled": c.filled_count,
            "spots_left": spots_left,
            "status": status
        })
    return result

# OLD: Keep learners for testing
@app.post("/learners/")
def create_learner(name: str, email: str, db: Session = Depends(get_db)):
    learner = models.Learner(name=name, email=email)
    db.add(learner)
    db.commit()
    db.refresh(learner)
    return learner

@app.get("/learners/")
def read_learners(db: Session = Depends(get_db)):
    return db.query(models.Learner).all()
