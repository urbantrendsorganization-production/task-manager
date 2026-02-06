# syntax=docker/dockerfile:1
# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
# If your build directory is 'build' (e.g., create-react-app), use the following line instead:
# COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
