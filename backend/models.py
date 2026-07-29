from sqlalchemy import Column, Integer, String, ForeignKey, Float
from database import Base

class Learner(Base):
    __tablename__ = "learners"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)

class GradeClass(Base):
    __tablename__ = "grade_classes"
    id = Column(Integer, primary_key=True)
    grade_number = Column(Integer)
    class_name = Column(String)
    capacity = Column(Integer, default=15)
    filled_count = Column(Integer, default=0)

class Parent(Base):
    __tablename__ = "parents"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)

class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey("parents.id"))
    child_name = Column(String)
    grade_class_id = Column(Integer, ForeignKey("grade_classes.id"))
    address = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    status = Column(String, default="Pending")

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    doc_type = Column(String)
    file_path = Column(String)
