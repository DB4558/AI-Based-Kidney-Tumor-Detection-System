# Start from the official Node.js image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY frontend/ ./

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

