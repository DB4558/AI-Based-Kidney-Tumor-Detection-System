# Use a specific version of the python image
FROM python:3.8-slim-buster

# Install system dependencies
RUN apt-get update -y && apt-get install -y \
    default-libmysqlclient-dev \
    gcc \
    pkg-config \ 
    awscli && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY backend/src/ /app/src/
COPY backend/config/ /app/config/
COPY backend/app.py /app/
COPY backend/main.py /app/
COPY backend/requirements.txt /app/
COPY backend/setup.py /app/
COPY backend/template.py /app/
COPY backend/README.md /app/
COPY backend/test.py /app/
COPY backend/model/  /app/model/



# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
# The command to run the Flask application
CMD ["python", "app.py"]

