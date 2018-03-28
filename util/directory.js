/**
 * 文件夹操作
 */
const $fs = require('./fs')
const directoryRename = (path, directorytype) => {
  if(directorytype === 'normal') {
    normalRename(path)
  } else if(directorytype === 'aaBb'){
    aaBbRename(path)
  }
}
// 小写字母下划线式命名
function normalRename(path) {

}

// 驼峰式命名
function aaBbRename(path) {

}
module.exports = {
  directoryRename
}