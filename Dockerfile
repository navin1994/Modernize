# Use the official Node.js image as the base image
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build --prod

# Use a web server to serve the app
FROM nginx:alpine

# Copy the built application from the previous stage
COPY --from=build /app/dist/Modernize /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]