FROM node:20.12.1 AS angular

WORKDIR /app
COPY ./presentacion/package*.json .
RUN npm install
RUN npx ngcc --properties es2024 browser module main --first-only --create-ivy-entry-points
COPY ./presentacion/. .

RUN npm run build

FROM nginx:1.27.0-alpine
#FROM php:apache
#/var/www/html

COPY --from=angular /app/dist/presentacion/browser/ /usr/share/nginx/html

EXPOSE 80