FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install Angular CLI globally and dependencies
RUN npm install -g @angular/cli@18 && npm install --legacy-peer-deps

# Copy the rest of the application files into the container
COPY . .

# Expose port 4200 for Angular live reload
EXPOSE 4200

# Default command
CMD ["ng", "serve", "--host", "0.0.0.0"]