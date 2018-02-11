const $fs = require('./fs')
const directoryRename = (path, directorytype) => {
  if(directorytype === 'normal') {
    normalRename(path)
  } else if(directorytype === 'aaBb'){
    aaBbRename(path)
  }
}

function normalRename(path) {

}


function aaBbRename(path) {

  
}
module.exports = {
  directoryRename
}