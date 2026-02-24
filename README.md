# Manufacturing Application Deployment on Kubernetes

**Author:** Vidhi Prajapati
**Project No:** DO-12
**Division:** D9 (Group 12D9)

---

## 📌 Project Overview

This project demonstrates the end-to-end deployment of a **Manufacturing Management Web Application** using DevOps practices.
The application is a full-stack system:

* **Frontend:** React (Vite)
* **Backend:** Python Flask REST API
* **Database:** SQLite/MySQL (used by backend)
* **Containerization:** Docker
* **Orchestration:** Kubernetes (K3s on AWS EC2)
* **Reverse Proxy:** Nginx

The objective of this project was to deploy a containerized manufacturing application on a Kubernetes cluster and implement a **zero-downtime rolling update deployment strategy**.

---

## 🧱 System Architecture

User → AWS EC2 → Kubernetes Cluster → Nginx Reverse Proxy → Frontend → Backend → Database

* Nginx acts as the entry point
* `/` routes to React frontend
* `/api` routes to Flask backend
* Backend communicates with the database

---

## 🚀 Features

* Containerized full-stack application
* Kubernetes deployment and service exposure
* Internal pod communication using Kubernetes DNS
* Reverse proxy routing using Nginx
* Rolling updates without downtime
* Public access using AWS EC2

---

## 🛠️ Tools & Technologies

* Git & GitHub
* Docker
* Kubernetes (K3s)
* AWS EC2 (Ubuntu)
* Nginx
* Python Flask
* React (Vite)
* Axios API communication

---

## ⚙️ Deployment Steps

### 1. Clone Repository

```bash
git clone https://github.com/vidhi-1412/Python-flask.git
cd Python-flask
```

### 2. Build Docker Images

```bash
docker build -t manufacturing-backend ./backend
docker build -t manufacturing-frontend ./frontend/vite-project
```

### 3. Import Images into K3s

```bash
docker save manufacturing-backend -o backend.tar
sudo k3s ctr images import backend.tar

docker save manufacturing-frontend -o frontend.tar
sudo k3s ctr images import frontend.tar
```

### 4. Deploy to Kubernetes

```bash
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f services.yaml
```

### 5. Configure Nginx Reverse Proxy

Nginx routes traffic inside the cluster:

* `/` → Frontend service
* `/api` → Backend service

---

## 🌐 Application Access

After deployment the application is publicly accessible at:

```
http://<EC2-PUBLIC-IP>:30199
```

---

## 🔄 Rolling Update (Zero Downtime Deployment)

The application supports rolling updates using Kubernetes:

```bash
kubectl set image deployment/frontend-deployment manufacturing-frontend=manufacturing-frontend:v2
kubectl rollout status deployment/frontend-deployment
```

Kubernetes first creates a new pod, shifts traffic to it, and then removes the old pod.
This ensures **no service interruption**.

---

## 📊 Kubernetes Commands Used

```bash
kubectl get pods
kubectl get svc
kubectl describe deployment
kubectl logs <pod-name>
kubectl rollout status deployment/frontend-deployment
```

---

## 🧠 Key Learnings

* Containerization using Docker
* Kubernetes pod networking
* Service exposure via NodePort
* Reverse proxy routing
* Debugging deployment issues
* Production-style architecture deployment

---

## 📌 Conclusion

This project successfully demonstrates a production-style DevOps deployment pipeline.
The Manufacturing Application was containerized, deployed, and exposed publicly using Kubernetes and AWS EC2. A reverse proxy was implemented and rolling updates were achieved without downtime.

---

## 📜 License

This project is for educational and academic purposes.
