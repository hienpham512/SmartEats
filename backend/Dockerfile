# Use an official Node.js runtime as a parent image with Node.js version 18
FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

COPY .env .env

RUN yarn build

EXPOSE 8080

CMD ["yarn", "start"]
