# ---------- Stage 1: Build the React app ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install deps first (cached layer unless package*.json changes)
COPY package*.json ./
RUN npm ci

# Copy the rest of the source and build
COPY . .
RUN npm run build

# ---------- Stage 2: Serve with nginx ----------
FROM nginx:1.27-alpine AS production

# Remove default nginx site config and drop in ours
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 5378

# Basic healthcheck so `docker ps` / orchestrators can see container health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q --spider http://localhost:5378/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
