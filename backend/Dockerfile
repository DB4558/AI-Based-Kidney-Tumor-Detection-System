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
COPY src/ /app/src/
COPY config/ /app/config/
COPY app.py /app/
COPY main.py /app/
COPY requirements.txt /app/
COPY setup.py /app/
COPY template.py /app/
COPY README.md /app/
COPY test.py /app/
COPY model/ /app/model



# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
# The command to run the Flask application
CMD ["python", "app.py"]

