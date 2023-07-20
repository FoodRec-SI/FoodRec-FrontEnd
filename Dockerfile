FROM node:18-alpine AS builder
WORKDIR /app
ARG API_URL
ENV VITE_API_URL=${API_URL:-http://localhost:8080}
COPY package*.json .
RUN npm ci
COPY . .
## EXPOSE [Port you mentioned in the vite.config file]
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]