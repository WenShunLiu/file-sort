/**
 * css内容的解析生成
 */

const files = require('../files.json'); //工程配置

// 匹配最长的template标签的 (暂时方案)
const templateReg = /<template.*(?=template)(.|\n)*?<\/template>/;
// 匹配style之间的内容，不包含style标签
// const styleRegde = /<style[^>]*>([^<]*)<\/style>/
// 匹配style之间的内容，[0]包含style标签 [1]不包含
const styleReg = /<style[^>]*>([^<]*)<\/style>/;
// 匹配</template>和<script>之间用于插入style标签
const templateScript = /<\/template[^>]*>([^<]*)<script>/;

const cssOpt = (filedata) => {
  let hasStyle = true
  const cssfiles = []
  do {
    if (filedata.match(styleReg)) {
      const cssdata = filedata.match(styleReg)[0]
      if (!cssdata) continue;
      // 判断css类型 less/sass/css/scss
      if (decideCssType(cssdata, 'less')) {
        cssfiles.push({
          type: 'less',
          data: cssdata
        })
      } else if (decideCssType(cssdata, 'sass')){
        cssfiles.push({
          type: 'sass',
          data: cssdata
        })
      } else if (decideCssType(cssdata, 'scss')) {
        cssfiles.push({
          type: 'scss',
          data: cssdata
        })
      } else {
        cssfiles.push({
          type: 'css',
          data: cssdata
        })
      }
      filedata = filedata.replace(styleReg, '')
    } else {
      hasStyle = false
    }
  } while(hasStyle)
 
  // 判断scoped
  cssfiles.forEach(item => {
    if (!item.data) return
    if (decideScoped(item.data)) {
      item.scoped = true
    } else {
      item.scoped = false
    }
  })
  // css文件整合去重 将scoped和文件类型一样的进行整合
  const uniqcssfiles = uniqCssFiles(cssfiles)
  // 需要创建的css less sass scss文件信息数组
  const cssfilesInfo = getCssFiles(uniqcssfiles)
  return {
    cssfilesInfo,
    filedata
  }
};

module.exports = cssOpt;

// 判断css类型
function decideCssType(css, type) {
  if (css.includes(`lang="${type}"`) || css.includes(`lang='${type}'`)) {
    return true
  } else {
    return false
  }
}

// 判断scoped
function decideScoped(css) {
  if (css.includes('scoped')) {
    return true
  } else {
    false
  }
}

// css文件去重 将scoped和文件类型一样的进行整合
function uniqCssFiles(data) {
  const result = []
  const cssdata = data.map(item => {
    item.isOpt = false
    return item
  })

  cssdata.forEach(item => {
    if (!item.isOpt) {
      item.isOpt = true
      let curdata = item.data.match(styleReg)[1]
      const type = item.type
      const scoped = item.scoped
      const samefile = cssdata.filter(cs => cs.type === type && cs.scoped === scoped && !cs.isOpt)
      samefile.forEach(file => {
        curdata += `\n${file.data.match(styleReg)[1]}`
        file.isOpt = true
      })
      result.push({
        scoped,
        type,
        data: curdata
      })
    } else {
      return
    }
  })
  return result
}

// 需要创建的css less sass scss文件的数据
function getCssFiles(cssdata) {
  const result = []
  const tmp = {}
  cssdata.forEach(item => {
    if (!tmp.type) {
      result.push({
        filename: `index.${item.type}`,
        data: item.data,
        scoped: item.scoped,
        type: item.type
      })
      tmp.type = 1
    } else {
      result.push({
        filename: `index${tmp.type}.${item.type}`,
        data: item.data,
        scoped: item.scoped,
        type: item.type
      })
      tmp.type ++
    }
  })
  return result
}
