const fs = require('fs')
const path = require('path');
   
fs.mkdir(path.join(__dirname, 'downloads'), (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Directory created successfully!');
})


function clearDownload(file) {
  fs.unlink(file, function(err) {
    if (err) {
      console.log(err)
    }else{
      console.log('File deleted:'+ file)
    }
  })
}

module.exports = { clearDownload }