FROM ubuntu:jammy

WORKDIR /src/path/app

COPY package*.json ./

RUN apt-get update && apt-get -y upgrade

RUN apt-get install -y nodejs ffmpeg npm

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

RUN sudo apt install -y nodejs

RUN npm install

COPY . .

ARG EnvironmentVariable

CMD ["node" , "."]
