# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:14 as build-stage

ARG FRONTEND_ENV
ENV VUE_APP_ENV=${FRONTEND_ENV}

WORKDIR /app
COPY package*.json /app/
RUN yarn install
COPY ./ /app/
RUN yarn build --prod

# Stage 1, "run-stage", based on Nginx, to run the frontend
FROM nginx:1.15

COPY --from=build-stage /app/dist/ /usr/share/nginx/html
COPY ./.docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./.docker/nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf
