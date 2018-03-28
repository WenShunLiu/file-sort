/**
 * 文件主入口
 */
const Path = require('path');
const config = require('./files.json'); //工程配置
const $main = require('./main.js');

const rootPath = Path.resolve(config.src);
$main(rootPath);