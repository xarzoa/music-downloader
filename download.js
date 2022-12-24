const Spotify = require('spotifydl-core').default
const env = require('dotenv').config()

const credentials = {
  clientId: process.env['ID'],
  clientSecret: process.env['SECRET']
}
const spotify = new Spotify(credentials)

const dl = async (songid) => {
  let track = `https://open.spotify.com/track/${songid}`
  let info = await spotify.getTrack(track)
  console.log('Downloading track')
  const dld = await spotify.downloadTrack(track, `./downloads/${info.name}.mp3`)
  return { info, dld }
}

module.exports = {
  dl
}