/**
 * 文件操作，文件的分类，不同文件的分发操作
 * js文件
 * vue文件
 * json文件
 */
const Path = require('path');
const fs = require('fs');
const $fs = require('./fs');
const vueOption = require('./vue-file');

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
      const regularName = getRegularName(fileNameArray)
      // js文件 对文件进行重命名
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
        vueOption(path, newfolder)

        // 中间可能还要解析import路径

        // 解析完删除vue文件
        $fs.fsunlink(path)
      }
    }
  }
}

module.exports = fileOption

// 判断是否大写字母
function isUpperCase(tmp) {
  return /[A-Z]/.test(tmp)
}

// 解析文件名 => 正规文件名
function getRegularName(fileNameArray) {
  return fileNameArray.map((item, index) => {
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
}
