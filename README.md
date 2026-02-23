# 🏭 Flask Manufacturing Management System (DevOps Deployment)

A full-stack Manufacturing Management Web Application deployed on **AWS EC2 using Docker & Kubernetes (K3s)**.

This project demonstrates real-world DevOps practices including containerization, orchestration, networking, and production debugging.

---

## 📌 Project Overview

The system helps manage manufacturing operations such as:

* Inventory management
* Orders tracking
* Admin dashboard
* User dashboard
* Backend API integration
* Real-time data from database

The application is deployed in a production-like cloud environment instead of running only on a local machine.

---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* Axios
* Tailwind CSS

### Backend

* Python Flask
* REST APIs

### DevOps / Infrastructure

* Docker
* Kubernetes (K3s)
* AWS EC2 (Ubuntu Server)
* NodePort Networking
* Linux Server Management
* Git & GitHub

---

## ⚙️ System Architecture

User Browser
⬇
Frontend (React – Docker Container)
⬇
Kubernetes Service (NodePort)
⬇
Backend (Flask API – Docker Container)
⬇
Database

---

## 🚀 Deployment Features

✔ Dockerized Flask Backend
✔ Dockerized React Frontend
✔ Kubernetes Deployment & Services
✔ NodePort External Access
✔ AWS Security Group Configuration
✔ Production Networking Debugging
✔ GitHub Version Control
✔ Live Full-Stack Communication

---

## 📂 Project Structure

manufacturing-app/

backend/ → Flask API
frontend/ → React Vite App
Dockerfile (backend)
Dockerfile (frontend)
docker-compose.yml
k8s deployment files

---

## 🐳 Docker Setup

### Build Backend Image

docker build -t backend-app ./backend

### Build Frontend Image

docker build -t frontend-app ./frontend

---

## ☸️ Kubernetes Deployment

Images are imported into the K3s cluster and deployed using Kubernetes Deployment and Service YAML files.

Services are exposed using **NodePort** to allow external access via EC2 Public IP.

Example:

http://<EC2-Public-IP>:30008

---

## 🔧 Production Issue Solved

During deployment, the frontend was calling:

http://localhost:5000

This works locally but fails in production because the browser tries to access its own machine.

It was fixed by updating the API base URL to:

http://<EC2-Public-IP>:30007/api

This enabled successful communication between the React frontend and Flask backend inside Kubernetes.

---

## 🧪 How to Run Locally

### Backend

cd backend
pip install -r requirements.txt
python app.py

### Frontend

cd frontend
npm install
npm run dev

---

## 📊 DevOps Learning Outcomes

This project demonstrates:

* Containerization using Docker
* Kubernetes orchestration
* Linux server handling
* Cloud deployment (AWS)
* Debugging real production issues
* Full-stack service communication

---

## 👩‍💻 Author

**Vidhi Prajapati**

GitHub: https://github.com/vidhi-1412

---

## ⭐ Note

This is a deployment-focused DevOps project.
The objective was to deploy a full-stack application in a real cloud environment rather than only running it locally.
