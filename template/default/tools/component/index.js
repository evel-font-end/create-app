var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');
let stat = Promise.promisify(fs.stat);
let mkdir = Promise.promisify(fs.mkdir);
let writeFile = Promise.promisify(fs.writeFile);
var ejs = require('ejs');
let renderFile = Promise.promisify(ejs.renderFile);

async function createComponent(componentsName, componentFolder) {
  let folder = path.join(__dirname, `../../src/components/${componentFolder}`);
  try {
    await stat(folder);
  }catch (err) {
    await mkdir(folder);
  }
  try {
    let formPath = path.join(folder, `${componentsName}.vue`);
    let formIndexPath = path.join(folder, `index.js`);
    try {
      await stat(formPath);
      throw new Error(`component ${formPath} already created`);
    }catch(err) {
      let templateFile = 'component.template.ejs';
      let templateIndexFile = 'index.template.ejs';
      let WrappedComponentName = path.basename(componentFolder);
      let componentName = componentsName;
      if (componentName === 'index') {
        componentName = WrappedComponentName;
      }
      let content = await renderFile(path.join(__dirname, templateFile), {
        componentName,
      });
      let indexContent = await renderFile(path.join(__dirname, templateIndexFile), {
        componentName,
      });
      await writeFile(formPath, content);
      await writeFile(formIndexPath, indexContent);
    }
  }catch (err) {
  }
}

async function component(componentsName, componentFolder) {
  try {
    await createComponent(componentsName, componentFolder);
  }catch(err) {
  }
}

module.exports = component;