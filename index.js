const Path = require('path');
const fs = require('fs')
const $fs = require('./util/fs')
const $directory = require('./util/directory')
const $file = require('./util/file')
const files = require('./files.json') //工程配置

// 文件处理
const fileOption = async (path) => {
  // 处理文件
  // 只处理vue、js文件
  if (/\.vue$|\.js$/.test(path)) {
    const index = path.lastIndexOf('/')
    // 获取文件名
    const fileName = path.slice(index + 1)
    // 当前路径
    const filePath = path.slice(0, index)
    if (!/index./.test(fileName)) {
      const fileNameArray = fileName.split('')
      // 解析文件名 => 正规文件名
      const regularName = fileNameArray.map((item, index) => {
        if(isUpperCase(item)) {
          if (index !== 0) {
            return `-${item.toLowerCase()}`
          } else {
            return item.toLowerCase()
          }
        } else {
          return item
        }
      }).join('')
      // js文件对文件进行重命名
      if (/\.js$/.test(regularName)) {
        const oldPath = path
        const newPath = Path.resolve(Path.join(filePath, regularName))
        const data = fs.renameSync(oldPath, newPath)
      } else if (/\.vue$/.test(regularName)) {
        // 新文件夹路径
        const newpath = Path.resolve(Path.join(filePath, regularName.slice(0, -4)))
        let newfolder
        // 文件名冲突
        try {
          newfolder = await $fs.fsmkdir(newpath)
        } catch (error) {
          // newfolder = await $fs.fsmkdir(`${newpath}1`)
        }
        $file.vueOption(path, newfolder)

        // 中间可能还要解析import路径

        // 解析完删除vue文件
        $fs.fsunlink(path)
      }
    }
  }
}

// 文件夹处理
const getFolder = async (path) => {
  // 获取文件信息
  const stat = await $fs.fsstat(path)
  // 是目录
  if (stat.isDirectory()) {
    // 该文件夹的命名规范
    if (files.directoryname) {
      $directory.directoryRename(path, files.directorytype)
    }
    // 该目录下的所有文件或者目录
    const directory = await $fs.fsreaddir(path)
    // 解析该文件夹下的所有文件
    directory.forEach(item => {
      // 解析文件夹、vue文件、js文件
      if (/\.json$/.test(item)) {
        // 删除json文件
        if (files.deletejson) {
          const jsonPath = Path.resolve(Path.join(path, item))
          $fs.fsunlink(jsonPath)
        }
      } else {
        const newpath = Path.resolve(Path.join(path, item))
        getFolder(newpath)
      }
    })
  } else if (stat.isFile()) {
    fileOption(path)
  }
}


const rootPath = Path.resolve(files.src)

getFolder(rootPath)

// 判断是否大写字母
function isUpperCase(tmp) {
  return /[A-Z]/.test(tmp)
}