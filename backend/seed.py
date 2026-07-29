from database import engine, SessionLocal
import models

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

for grade in range(1, 13):
    for cls in ["A", "B", "C"]:
        db.add(models.GradeClass(grade_number=grade, class_name=cls))

db.commit()
print("Seeded 36 classes")
