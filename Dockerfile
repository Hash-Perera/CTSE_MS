# Base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json & install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
