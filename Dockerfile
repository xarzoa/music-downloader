FROM ubuntu:jammy

WORKDIR /src/path/app

COPY package*.json ./

RUN apt-get update && apt-get -y upgrade

RUN apt-get install -y nodejs ffmpeg npm

RUN apt-get update && apt-get -y upgrade

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -

RUN apt-get install -y nodejs

RUN node -v

RUN npm install

COPY . .

ARG EnvironmentVariable

CMD ["node" , "."]
