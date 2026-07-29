from fastapi import FastAPI, Depends
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

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "app": "Learner_Application Backend"}

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
