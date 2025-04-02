# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build --prod

# Use an official Nginx runtime as a parent image
FROM nginx:alpine
COPY --from=build /app/dist/minha-carteira-angular/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
