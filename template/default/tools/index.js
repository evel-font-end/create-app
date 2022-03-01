var program = require('commander');

let table = require('./table');
program
  .command('table <tableName>')
  .description('create Table component')
  .usage('test')
  .option('--folder <value>', 'folder')
  .action(function (tableName, options) {
    var folder = options.folder;
    console.log(`create table ${folder}/${tableName}`);
    table(tableName, folder);
  });
let component = require('./component');
program
  .command('component <componentName>')
  .description('create Component component')
  .usage('test')
  .option('--folder <value>', 'folder')
  .action(function (componentName, options) {
    var folder = options.folder;
    console.log(`create component ${folder}/${componentName}`);
    component(componentName, folder);
  });
program.parse(process.argv);
