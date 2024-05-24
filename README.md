# AI-Based Kidney Tumor Detection System

## Overview
This project is an AI-based system for detecting kidney tumors from CT scans. It features a user-friendly web interface where patients can register, log in, upload CT scans, and receive tumor predictions. Medical professionals can review these scans and provide additional assessments. The system uses a React frontend, Flask backend, and MySQL for data management.

## Features
- **User Registration and Authentication**: Secure login system for patients and doctors.
- **Image Upload and Management**: Patients can upload and manage their CT scan images.
- **AI Prediction**: Automated tumor detection on uploaded CT scans.
- **Doctor Review**: Doctors can review AI predictions and provide their assessments.
- **Results Comparison**: Patients can view both AI and doctor evaluations.

## Tech Stack
- **Frontend**: React
- **Backend**: Flask
- **Database**: MySQL
- **AI Model Management**: DVC, MLflow
- **CI/CD**: Jenkins, GitHub
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes

## Getting Started
## To train the Model
## Workflows

    Update config.yaml
    Update secrets.yaml [Optional]
    Update params.yaml
    Update the entity
    Update the configuration manager in src config
    Update the components
    Update the pipeline
    Update the main.py
    Update the dvc.yaml
    app.py

How to run?

STEPS:Clone the repository

STEP 01- Create a conda environment after opening the repository

conda create -n cnncls python=3.8 -y
conda activate cnncls

STEP 02- install the requirements

pip install -r requirements.txt

# Finally run the following command
python app.py

## DVC cmd

    dvc init
    dvc repro
    dvc dag


### Prerequisites
- Docker
- Kubernetes
- Flask
- Python

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DB4558/kidney-tumor-detection.git
   cd kidney-tumor-detection
2.**For running Backend**
```bash
python app.py
3. **To run frontend**
```bash
npm start
