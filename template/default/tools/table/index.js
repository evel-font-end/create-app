var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');
let stat = Promise.promisify(fs.stat);
let mkdir = Promise.promisify(fs.mkdir);
let writeFile = Promise.promisify(fs.writeFile);
let copyFileSync = Promise.promisify(fs.copyFileSync);
var ejs = require('ejs');
let renderFile = Promise.promisify(ejs.renderFile);

async function createTable (tableName, tableFolder) {
  let folder = path.join(__dirname, `../../src/view/${tableFolder}`);
  let editOrigin = path.join(__dirname, `../../tools/table/Edit`);
  let editFolder = path.join(__dirname, `../../src/view/${tableFolder}/Edit`);
  let utilsOrigin = path.join(__dirname, `../../tools/table/utils.js`);
  let utilsFile = path.join(__dirname, `../../src/view/${tableFolder}/utils.js`);
  try {
    await stat(folder);
  } catch (err) {
    await mkdir(folder);
  }

  try {
    await stat(utilsFile);
  } catch (err) {
    await fs.copyFileSync(utilsOrigin, utilsFile);
    console.log(`create Edit successful`);
  }

  try {
    await stat(editFolder);
  } catch (err) {
    await copyFolder(editOrigin, editFolder);
    console.log(`create utils.js successful`);
  }
  try {
    let tablePath = path.join(folder, `${tableName}.vue`);
    try {
      await stat(tablePath);
      throw new Error(`tablePage ${tablePath} already created`);
    } catch (err) {
      let templateFile = 'table.template.ejs';
      let WrappedComponentName = path.basename(tableFolder);
      let componentName = tableName;
      if (componentName === 'index') {
        componentName = WrappedComponentName;
      }
      let content = await renderFile(path.join(__dirname, templateFile), {
        componentName
      });
      await writeFile(tablePath, content);
      console.log(`create tablePage ${tablePath} successful`);
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function copyFolder (from, to) { // 复制文件夹到指定目录
  let files = [];
  if (fs.existsSync(to)) { // 文件是否存在 如果不存在则创建
    files = fs.readdirSync(from);
    files.forEach(function (file, index) {
      var targetPath = from + '/' + file;
      var toPath = to + '/' + file;
      if (fs.statSync(targetPath).isDirectory()) { // 复制文件夹
        let readable = fs.createReadStream(targetPath);// 创建读取流
        let writable = fs.createWriteStream(toPath);// 创建写入流
        readable.pipe(writable);
      } else { // 拷贝文件
        fs.copyFileSync(targetPath, toPath);
      }
    });
  } else {
    fs.mkdirSync(to);
    copyFolder(from, to);
  }
}

async function table (tableName, folder) {
  try {
    await createTable(tableName, folder);
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = table;
