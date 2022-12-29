const fs = require('fs')
const path = require('path');
   
fs.mkdir(path.join('./', 'downloads'), (err) => {
    if(err){
      if (err.code === "EEXIST") {
        return console.info("Directory already exist!, Skipping step...")
      }else{
        return console.log("Something went wrong!")
      }
    }else{
      return console.error(err ? err : "Directory created successfully!")
    }
    console.info('Directory created successfully!');
})

async function countSize(file){
  const { size } = await fs.statSync(file)
  let fileSize = size / (1024 ** 2)
  return fileSize.toFixed(2)
}

function clearDownload(file) {
  fs.unlink(file, function(err) {
    if (err) {
      console.info(err)
    }else{
      console.info('File deleted:'+ file)
    }
  })
}

module.exports = { clearDownload, countSize }
