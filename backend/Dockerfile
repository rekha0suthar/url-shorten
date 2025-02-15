# Use official Node.js LTS version as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the backend code
COPY . .

# Expose the backend port (adjust if different)
EXPOSE 5000

# Define environment variable for production
ENV NODE_ENV=production

# Use the exec form for the CMD
CMD ["npm", "start"]