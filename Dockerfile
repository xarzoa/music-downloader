FROM node:16

WORKDIR /src/path/app

COPY package*.json ./

RUN npm install

COPY . .

ARG EnvironmentVariable

CMD ["node" , "."]