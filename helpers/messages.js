const os = require('os')

function start(user){

  const message = `Hola, ${user}! Send your Spotify URL, I'll download it.
  
<b>Maximum quality:</b> <code>128kbps</code>
  
<b>(Only tracks supported for now)</b>`

  return message
}

function musicInfo(info){
  const message = `Artists: ${info.artists.join(',')}
Album: ${info.album}
Released date: ${info.released}
`
  return message
}

// function songCaption(info){

//   const message = `Name: <code>${info.name}</code>
// Album: <code>${info.album_name}</code>
// Artist: <code>${info.artist}</code>
// Release Date: <code>${info.date}</code>
// Size: <code>${info.fileSize}MB</code>`

//   return message
// }

function serverInfo(){

  function countdown(s) {

    // copied from https://stackoverflow.com/a/50098261 ; yeah, I'm fucking lazy pos
    const d = Math.floor(s / (3600 * 24));
    s -= d * 3600 * 24;
    const h = Math.floor(s / 3600);
    s -= h * 3600;
    const m = Math.floor(s / 60);
    s -= m * 60;
    const tmp = [];
    (d) && tmp.push(d + 'd');
    (d || h) && tmp.push(h + 'h');
    (d || h || m) && tmp.push(m + 'm');
    tmp.push(Math.floor(s) + 's');
    return tmp.join(' ');
  }

  const tmem = os.totalmem()/(1024 ** 3)
  const fmem = os.freemem()/(1024 ** 3)

  const message = `
<b>On:</b> <code>${os.platform()}</code>
<b>Cpus:</b> <code>${os.cpus().length}</code>
<b>Total memory:</b> <code>${tmem.toFixed(2)}GB</code>
<b>Free memory:</b> <code>${fmem.toFixed(2)}GB</code>
<b>OS uptime:</b> <code> ${countdown(os.uptime())}</code>
`

  return message
}

module.exports = {
  start,
  musicInfo,
  serverInfo
}