/**
 * 文件夹处理操作
 */

const Path = require('path');
const fs = require('fs')
const $fs = require('./util/fs')
const $directory = require('./util/directory')
const fileOption = require('./util/file')
const config = require('./files.json') //工程配置

// 文件夹处理
const getFolder = async (path) => {
  // 获取文件信息
  const stat = await $fs.fsstat(path)
  // 是目录
  if (stat.isDirectory()) {
    // 该文件夹的命名规范
    if (config.directoryname) {
      $directory.directoryRename(path, config.directorytype)
    }
    // 该目录下的所有文件或者目录
    const directory = await $fs.fsreaddir(path)
    // 解析该文件夹下的所有文件
    parseFilesinDirectory(directory, path)
  } else if (stat.isFile()) {
    // 文件处理
    fileOption(path)
  }
}

module.exports = getFolder

function parseFilesinDirectory(directory, path) {
  directory.forEach(item => {
    // 解析文件夹、vue文件、js文件
    if (/\.json$/.test(item)) {
      // 删除json文件
      if (config.deletejson) {
        const jsonPath = Path.resolve(Path.join(path, item))
        $fs.fsunlink(jsonPath)
      }
    } else {
      const newpath = Path.resolve(Path.join(path, item))
      getFolder(newpath)
    }
  })
}