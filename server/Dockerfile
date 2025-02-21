FROM node:18-alpine

# Set working directory
WORKDIR /app/server

# Copy package files first for better caching
COPY package.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Expose the port your server listens on
EXPOSE 5000

# Start the server
CMD ["pnpm", "start"]