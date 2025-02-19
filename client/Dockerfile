FROM node:18-alpine as build

WORKDIR /app/client

RUN npm install -g pnpm

COPY package.json ./

# Install dependencies without frozen-lockfile first time
RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm build

# Production stage
FROM node:18-alpine

WORKDIR /app/client

RUN npm install -g pnpm

COPY package.json ./
COPY --from=build /app/client/node_modules ./node_modules
COPY --from=build /app/client/dist ./dist

EXPOSE 4173

CMD ["pnpm", "preview", "--host"]