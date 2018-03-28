/**
 * 对node原生文件操作的封装
 */
const fs = require('fs')

// 获取文件信息
const fsstat = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stat) => {
      if(!err) {
        resolve(stat)
      } else {
        reject(err)
      }
    })
  })
}

// 读取目录
const fsreaddir = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (!err) {
        resolve(files)
      } else {
        reject(err)
      }
    })
  })
}

// 删除文件
const fsunlink = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, err => {
      if(!err) {
        resolve()
      } else {
        reject(err)
      }
    })
  })
}

// 创建目录
const fsmkdir = (path) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, err => {
      if(!err) {
        resolve(path)
      } else {
        reject(err)
      }
    })
  })
}

// 创建文件并写入文件
const fsmkAndwrite = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, err => {
      if (!err) {
        resolve({path, data})
      } else {
        reject(err)
      }
    })
  })
}


module.exports = {
  fsstat,
  fsreaddir,
  fsunlink,
  fsmkdir,
  fsmkAndwrite,
}
