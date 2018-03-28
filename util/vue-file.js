/**
 * 具体的vue文件操作，解析
 */
const fs = require('fs');
const $fs = require('./fs');
const files = require('../files.json'); //工程配置
const $cssInfoOpt = require('./css');

// vue文件操作，分割为.vue .js .less
const vueOption = async (oldfile, newfolder) => {
  let filedata = await fs.readFileSync(oldfile).toString()
  // 创建index.js
  creatIndexJs(newfolder)

  // 处理style
  // 需要创建的css less sass scss文件信息数组以及vue文档信息
  const datas = $cssInfoOpt(filedata)
  const {cssfilesInfo} = datas
  const newfiledata = datas.filedata
  // 创建css文件, 创建index.(less/sass/css)
  creatCss(cssfilesInfo, newfolder)
  // 创建index.vue
  // 获取.vue文件中的style标签
  const vueStyleData = getVueStyle(cssfilesInfo)

  // 将生成的style标签插入到template和script之间
  const lastindexTemp = newfiledata.lastIndexOf('</template>')
  const vueDataArray = newfiledata.split('')
  vueDataArray.splice(lastindexTemp + 11, 0, vueStyleData)
  const vueData = vueDataArray.join('')

  // 生成新的vue文件
  await $fs.fsmkAndwrite(`${newfolder}/index.vue`, vueData)
}



// 命名规范，驼峰式命名
function nameFile(name) {
  const nameArray = name.split('-')
  const newName = nameArray.map((item, index) => {
    if (index === 0) {
      return item
    } else {
      // 驼峰式命名
      const head = item[0].toUpperCase()
      item[0] = head
      const newItem = `${head}${item.substr(1)}`
      return newItem
    }
  }).join('')
  return newName
}


module.exports = vueOption

// 创建index.js
function creatIndexJs(newfolder) {
  // 获取该组件中划线命名
  const index = newfolder.lastIndexOf('/')
  const folderName = newfolder.slice(index + 1)
  const indexjsName = nameFile(folderName)
  $fs.fsmkAndwrite(`${newfolder}/index.js`, `import ${indexjsName} from './index.vue'; \n \nexport default ${indexjsName};`)
}


// 创建css less scss
function creatCss(cssfilesInfo, newfolder) {
  cssfilesInfo.forEach(item => {
    $fs.fsmkAndwrite(`${newfolder}/${item.filename}`, item.data)
  })
}

// 生成.vue 文件的style标签
function getVueStyle(cssfiles) {
  let result = ''
  cssfiles.forEach(item => {
    result += `\n<style lang="${item.type}" ${item.scoped ? 'scoped' : ''} src="./${item.filename}"></style>\n`
  })
  return result
}