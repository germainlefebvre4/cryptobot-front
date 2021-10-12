# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
<<<<<<< HEAD
<<<<<<< HEAD
FROM node:14 as build-stage
=======
FROM node:14
>>>>>>> fix(Docker): Upgrade node version to 14
=======
FROM node:14 as build-stage
>>>>>>> fix(Docker): Fix node stage name

ARG FRONTEND_ENV
ENV VUE_APP_ENV=${FRONTEND_ENV}

COPY ./.docker/nginx.conf /nginx.conf
WORKDIR /app
COPY package*.json /app/
RUN yarn install
COPY ./ /app/
RUN yarn build --prod


FROM nginx:1.15

COPY --from=build-stage /app/dist/ /usr/share/nginx/html

COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf
