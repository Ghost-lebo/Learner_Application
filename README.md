# Heidelberg Academy High - Admissions Portal

A full-stack school admissions application for Heidelberg Academy High.
Allows parents within a 10km radius to apply for learners Grade 1-12, upload documents, and track class availability in real-time.

## Tech Stack
- **Backend**: FastAPI, Uvicorn, SQLAlchemy, PostgreSQL 15, Python 3.11
- **Frontend**: React 18, Vite 5
- **Containerization**: Docker + Docker Compose
- **Planned**: Leaflet Maps, JWT Auth, File Upload

## Project Goal
1. Online applications for Grade 1-12
2. 3 Classes per grade: A, B, C. 15 learners per class
3. Real-time availability: "FULL" indicator when class is at capacity
4. Document uploads: Birth Cert, Report, Parent ID, Proof of Address, etc.
5. 10km Radius check from Heidelberg, Gauteng
6. Branding: Red `#C00000`, Navy `#001F4D`, White `#FFFFFF`

## Current Status: Stage 3.1 ✅
- [x] Dockerized Backend + DB + Frontend
- [x] PostgreSQL database with SQLAlchemy models
- [x] Seeded 36 classes: Grade 1-12 x Class A-C, capacity 15 each
- [x] API: `/grades` endpoint showing availability `spots_left` + `FULL/AVAILABLE`
- [x] CORS enabled for frontend-backend communication
- [ ] Application Form with file upload
- [ ] 10km Radius Map Picker
- [ ] Parent Auth + Admin Dashboard
- [ ] Final Branding + School Images

## Setup & Run

### Prerequisites
- Docker
- Docker Compose

### 1. Clone and Start
```bash
git clone <your-repo-url>
cd Learner_Application
DOCKER_BUILDKIT=0 sudo docker compose up --build -d

## Testing Access to the App

- Frontendhttp://192.168.100.63:5173

- Backend API http://192.168.100.63:8000

- API Docshttp://192.168.100.63:8000/docs

- Health Checkhttp://192.168.100.63:8000/health

- Grades Listhttp://192.168.100.63:8000/grades

## Useful Docker Commands

sudo docker ps # check containers

sudo docker logs learner_backend -f # backend logs


sudo docker logs learner_db -f # postgres logs


sudo docker logs learner_frontend -f # frontend logs


DOCKER_BUILDKIT=0 sudo docker compose down # stop all


DOCKER_BUILDKIT=0 sudo docker compose up --build -d # rebuild

## Project Structure

Learner_Application/
├── backend/
│ ├── main.py # FastAPI app + endpoints
│ ├── models.py # DB tables: GradeClass, Parent, Application, Document
│ ├── database.py # DB connection
│ ├── seed.py # Seeds 36 classes
│ ├── requirements.txt
│ └── Dockerfile
├── frontend/
│ ├── src/
│ └── Dockerfile
├── docker-compose.yml
└── README.md

## Push to GitHub/GitLab

git init
git branch -M main
git add.
git commit -m "Stage 3.1: Base API + DB + 36 classes with availability"
git remote add origin https://github.com/YOUR_USERNAME/heidelberg-admissions.git
git push -u origin main
