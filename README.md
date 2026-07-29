# Learner_Application

Full-stack learning app built with FastAPI + React + Docker

## Tech Stack
- **Backend**: FastAPI, Uvicorn, Python 3.11
- **Frontend**: React 18, Vite 5
- **Containerization**: Docker + Docker Compose

## Setup & Run

### Prerequisites
- Docker
- Docker Compose

### 1. Clone and Start
```bash
git clone <your-repo-url>
cd Learner_Application
DOCKER_BUILDKIT=0 sudo docker compose up --build -d

### Testing Access to the App

- Frontend: http://192.168.100.63:5173 

- Backend API: http://192.168.100.63:8000/health

### Commands used 

- sudo docker ps                          # check containers


- sudo docker logs learner_backend -f     # backend logs


- sudo docker logs learner_frontend -f    # frontend logs


- DOCKER_BUILDKIT=0 sudo docker compose down   # stop

### Steps we took

1. Created project structure with backend and frontend folders

2. Built FastAPI backend with CORS enabled

3. Built React + Vite frontend

4. Fixed Dockerfile COPY syntax and docker-compose YAML spacing issues

5. Containerized both services with docker-compose

6. Tested endpoints

### Push to GitHub/GitLab

git remote add origin https://github.com/YOUR_USERNAME/Learner_Application.git


cat > README.md << 'EOF'
# Learner_Application

Full-stack learning app built with FastAPI + React + Docker

## Tech Stack
- **Backend**: FastAPI, Uvicorn, Python 3.11
- **Frontend**: React 18, Vite 5
- **Containerization**: Docker + Docker Compose

## Setup & Run

### Prerequisites
- Docker
- Docker Compose

### 1. Clone and Start
```bash
git clone <your-repo-url>
cd Learner_Application
DOCKER_BUILDKIT=0 sudo docker compose up --build -d

### Testing Access to the App

- Frontend: http://192.168.100.63:5173 

- Backend API: http://192.168.100.63:8000/health

### Commands used 

- sudo docker ps                          # check containers


- sudo docker logs learner_backend -f     # backend logs


- sudo docker logs learner_frontend -f    # frontend logs


- DOCKER_BUILDKIT=0 sudo docker compose down   # stop

### Steps we took

1. Created project structure with backend and frontend folders

2. Built FastAPI backend with CORS enabled

3. Built React + Vite frontend

4. Fixed Dockerfile COPY syntax and docker-compose YAML spacing issues

5. Containerized both services with docker-compose

6. Tested endpoints

### Push to GitHub/GitLab

git remote add origin https://github.com/YOUR_USERNAME/Learner_Application.git

git push -u origin main

