# Use Node.js Alpine as base image
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

RUN npm i -g npm

# Install dependencies
RUN npm install

# Copy application code
COPY . .


# RUN ls -R src

# # Build the TypeScript application
# RUN pnpm build

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm","run","dev"]