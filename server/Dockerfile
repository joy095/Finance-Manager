FROM node:18-alpine

# Set working directory
WORKDIR /app/server

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Expose the port your server listens on
EXPOSE 5000

# Start the server
CMD ["pnpm", "start"]