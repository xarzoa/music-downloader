FROM ubuntu:jammy

WORKDIR /src/path/app

COPY package*.json ./

RUN apt-get update && apt-get -y upgrade

RUN apt install nodejs ffmpeg npm

RUN npm install

COPY . .

ARG EnvironmentVariable

CMD ["node" , "."]