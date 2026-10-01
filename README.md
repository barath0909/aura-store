# AuraStore — Full-Stack E-Commerce DevOps Project

A containerized full-stack e-commerce application built with a React frontend and Node.js/Express backend, automated with a Jenkins CI/CD pipeline and Docker Hub.

## Architecture

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Containerization**: Multi-stage Alpine Dockerfile
- **Standardized Port**: Application served consistently on port `5001`
- **CI/CD**: Jenkins Declarative Pipeline
- **Registry**: Docker Hub (`barathj09/aurastore`)

## Quick Start (Run from Docker Hub)

```bash
docker run -d -p 5001:5000 --name aura-app barathj09/aurastore:latest
```
