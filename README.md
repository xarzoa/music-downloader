# music downloader bot

A bot will get music ```metadata``` from spotify and download actual song from YouTube Music (Quality: 128kbps). Yeah, I know quality kinda sucks.

## deploy

- update and upgrade packages
  ```sh
  sudo apt update && sudo apt upgrade -y
  ```
  
- install some required packages
  ```sh
  sudo apt -y install docker.io git
  ```

- clone the repo go to working dir
  ```sh
  git clone https://github.com/xarzoa/music-downloader
  cd music-downloader
  ```

- create **```.env```** file
  ```sh
  sudo nano .env
  ```
  add,
    - ```TOKEN``` - telegram bot token from [botfather](https://t.me/botfather)*
    - ```ID``` - spotify client id* from [spotify developers](https://developers.spotify.com)
    - ```SECRET``` - spotify client secret* from [spotify developers](https://developers.spotify.com)
    - ```DUMP``` - channel for collect user ids*
    - ```RFT``` - Spotify refresh token from [srt generator](https://spotify-refresh-token-generator.netlify.app/)
  
  *all those envs are **required**.
  
- build docker image
  ```sh
  sudo docker build . -t spotbot
  ```

- run the container
  ```sh
  sudo docker run spotbot
  ```

that's it. you just deployed your own bot that downloads music for ya. 

## ps

- this will never ban your spotify account. but there's rate limit on requesting metadata, watch out.
- prs are welcome.
- there maybe too many bugs. i just made this within 3hours :l
- enjoy :d
- forgot to add license, but stealing never makes you programmer *biiiitch*

## thanks 

- the owners of all the packages i used on this.
