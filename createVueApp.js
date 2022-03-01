const chalk = require('chalk');
const commander = require('commander');
const packageJson = require('./package.json');
const fs = require('fs-extra');
const path = require('path');
const validateProjectName = require('validate-npm-package-name');
const os = require('os');
const spawn = require('cross-spawn');
const copy = require('copy');

const errorLogFilePatterns = [
  'npm-debug.log',
  'yarn-error.log',
  'yarn-debug.log',
];

const defaultPackageJson = {
  scripts: {
    dev: "vue-cli-service serve --mode dev",
    start: "npm run dev",
    lint: "eslint --ext .js,.vue src",
    build: "vue-cli-service build --mode pro",
    mock: "puer --no-launch -r proxy.config.js"
  },
};

const devDependencies = [
  "@vue/cli-plugin-babel",
    "@vue/cli-service",
    "autoprefixer",
    "babel-core",
    "babel-eslint",
    "babel-loader",
    "bluebird",
    "chalk",
    "commander",
    "compression-webpack-plugin",
    "copy-dir",
    "cross-env",
    "css-loader",
    "ejs",
    "eslint",
    "eslint-config-standard",
    "eslint-friendly-formatter",
    "eslint-loader",
    "eslint-plugin-import",
    "eslint-plugin-node",
    "eslint-plugin-promise",
    "eslint-plugin-standard",
    "eslint-plugin-vue",
    "extract-text-webpack-plugin",
    "file-loader",
    "fs",
    "html-webpack-plugin",
    "image-webpack-loader",
    "imagemin-pngquant",
    "jsencrypt",
    "jsonp",
    "less",
    "less-loader",
    "mediaelementjs",
    "mockjs",
    "ora",
    "path",
    "portfinder",
    "postcss-import",
    "postcss-loader",
    "postcss-url",
    "puer",
    "px2rem-loader",
    "rimraf",
    "semver",
    "shelljs",
    "style-loader",
    "uglifyjs-webpack-plugin",
    "url-loader",
    "vue-loader",
    "vue-quill-editor",
    "vue-template-compiler",
    "webpack-bundle-analyzer",
];

const browserslistConfig = {
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
};

const enginesConfig = {
  "engines": {
    "node": ">= 6.0.0",
    "npm": ">= 3.0.0"
  },
};

const templateGeneratedFiles = [
  'public',
  'config',
  'src',
  'static',
  'tools',
  '.editorconfig',
  '.env.dev',
  '.env.pro',
  '.eslintignore',
  '.eslintrc.js',
  '.gitignore',
  '.postcssrc.js',
  'babel.config.js',
  'docker-compose.yml',
  'Dockerfile.web',
  'jsconfig.json',
  'README.md',
  'proxy.config.js',
  'vue.config.js',
  'web.nginx.conf',
];

const gitIgnoreFiles = [
  ".DS_Store",
  "node_modules/",
  "/dist/",
  "npm-debug.log*",
  "yarn-debug.log*",
  "yarn-error.log*",
  ".idea",
  ".vscode",
  "*.suo",
  "*.ntvs*",
  "*.njsproj",
  "*.sln",
  ".svn"
];

let projectName;

const program = new commander.Command(packageJson.name)
.version(packageJson.version)
.arguments('<project-directory>')
.option('--vue3')
// .option('--mobile')
// .option('--luna')
.usage(`${chalk.green('<project-directory>')} [options]`)
.action((name) => {
  projectName = name;
})
.parse(process.argv);

if (typeof projectName === 'undefined') {
  console.error('Please specify the app name:');
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`,
  );
  console.log();
  console.log('For example:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-vue-app')}`);
  console.log();
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`,
  );
  process.exit(1);
}

let projectType = 'default';
let mobile = false;

if (program.vue3) {
  projectType = 'vue3';
}
if (program.mobile) {
  mobile = true;
}
// if (program.luna) {
//   projectType = 'luna';
// }

createVueApp(projectName, projectType);

async function createVueApp(name, type = 'default') {
  const root = path.resolve(name);
  const appName = path.basename(root);

  checkAppName(appName);
  fs.ensureDirSync(name);
  if (!isSafeToCreateProjectIn(root, name)) {
    process.exit(1);
  }

  console.log(`Creating a new efont vue app in ${chalk.green(root)}.`);
  console.log();

  const packageJson = {
    name: appName,
    version: '1.0.0',
    private: true,
    ...defaultPackageJson,
    ...enginesConfig,
    ...browserslistConfig,
  };
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL,
  );

  const originalDirectory = process.cwd();
  process.chdir(root);

  let allDependencies = [];
  let buildInDependencies = [];
  switch (type) {
    case 'default':
      allDependencies = ['vue', 'vuex', 'vue-router', 'axios', 'element-ui', 'element-resize-detector', 'echarts', 'moment', 'jsencrypt', 'js-cookie', 'wangeditor', 'es6-promise'];
      break;
    case 'vue3':
      allDependencies = [];
      // buildInDependencies = buildInDependencies.concat(['src/models']);
      break;
    default:
      break;
  }

  if (isMobile()) {
    // const antdIndex = allDependencies.indexOf('antd');
    // if (antdIndex >= 0) {
    //   allDependencies.splice(antdIndex, 1, 'antd-mobile');
    // }
  }

  console.log('project type:', type);

  await run(type, root, appName, originalDirectory, allDependencies, buildInDependencies);
}

function printValidationResults(results) {
  if (typeof results !== 'undefined') {
    results.forEach(error => {
      console.error(chalk.red(`  *  ${error}`));
    });
  }
}

function checkAppName(appName) {
  const validationResult = validateProjectName(appName);
  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${appName}"`,
      )} because of npm naming restrictions:`,
    );
    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
    process.exit(1);
  }

  // TODO: there should be a single place that holds the dependencies
  const dependencies = ['react', 'react-dom', 'react-scripts'].sort();
  if (dependencies.indexOf(appName) >= 0) {
    console.error(
      chalk.red(
        `We cannot create a project called ${chalk.green(
          appName,
        )} because a dependency with the same name exists.\n` +
          `Due to the way npm works, the following names are not allowed:\n\n`,
      ) +
        chalk.cyan(dependencies.map(depName => `  ${depName}`).join('\n')) +
        chalk.red('\n\nPlease choose a different project name.'),
    );
    process.exit(1);
  }
}

async function run(projectType, root, appName, originalDirectory, allDependencies
, buildInDependencies) {
  const allDevdependencies = ['@efont/vue-baselib', ...devDependencies];

  console.log('Copy files from template');
  try {
    await copyFiles([path.join(__dirname, `/template/${projectType}/**/*`), path.join(__dirname, `/template/${projectType}/**/.*`)], root);
    if (isMobile()) {
      await copyFiles([path.join(__dirname, `/template/mobile/**/*`), path.join(__dirname, `/template/mobile/**/.*`)], root);
    }
  } catch (err) {
    console.log();
    console.log('Copy files has failed');
    console.log(err);

    const knownGeneratedFiles = [...templateGeneratedFiles, 'package.json'];
    exit(root, appName, knownGeneratedFiles);
  }

  fs.writeFileSync(path.join(root, '.gitignore'), gitIgnoreFiles.join('\r\n'));

  console.log('Copy files complete');
  console.log();

  try {
    // let entryConfigPath = path.join(root, 'src/index.tsx');
    // let entryConfigContent = fs.readFileSync(entryConfigPath, 'utf-8');
    // entryConfigContent = entryConfigContent.replace(/<%= appName %>/ig, () => appName);
    // fs.writeFileSync(entryConfigPath, entryConfigContent, { encoding: 'utf-8' });
    // if (projectType === 'admin') {
    //   const dockerComposeYmlPath = path.join(root, 'docker-compose.yml');
    //   let dockerComposeYmlContent = fs.readFileSync(dockerComposeYmlPath, 'utf-8');
    //   dockerComposeYmlContent = dockerComposeYmlContent.replace(/<%= appName %>/ig, () => appName);
    //   fs.writeFileSync(dockerComposeYmlPath, dockerComposeYmlContent, { encoding: 'utf-8' });
    // }
  } catch (err) {
    console.log();
    console.log('Generate index.tsx has faild');
    console.log(err.message);

    const knownGeneratedFiles = [...templateGeneratedFiles, 'package.json'];
    exit(root, appName, knownGeneratedFiles);
  }

  console.log('Installing packages. This might take a couple of minutes.');
  /**
   * 要在安装依赖前执行git初始化，不然提交前检查不起作用
   */

  initGit().then(() => {
    return install(root, allDependencies, false);
  })
  .then(() => {
    return install(root, allDevdependencies, true).then(() => { return ''; });
  })
  .then(() => {
    return install(root, buildInDependencies, false).then(() => '');
  })
  .then(() => {
    return initialCommit();
  })
  .then(() => {
    success(root, appName, originalDirectory);
  })
  .catch(error => {
    console.log();
    console.log('Aborting installation.');
    if (error.message) {
      console.log(`  ${chalk.cyan(error.message)} has failed.`);
    } else {
      console.log(chalk.red('Unexpected error. Please report it as a bug:'));
      console.log(error.message);
    }
    console.log();

    const knownGeneratedFiles = [...templateGeneratedFiles, 'package.json', 'node_modules', 'package-lock.json'];
    exit(root, appName, knownGeneratedFiles);
  });
}

function exit(root, appName, knownGeneratedFiles) {
  // On 'exit' we will delete these files from target directory.
  const currentFiles = fs.readdirSync(path.join(root));
  currentFiles.forEach(file => {
    knownGeneratedFiles.forEach(fileToMatch => {
      // This remove all of knownGeneratedFiles.
      if (file === fileToMatch) {
        console.log(`Deleting generated file... ${chalk.cyan(file)}`);
        fs.removeSync(path.join(root, file));
      }
    });
  });
  const remainingFiles = fs.readdirSync(path.join(root));
  if (!remainingFiles.length) {
    // Delete target folder if empty
    console.log(
      `Deleting ${chalk.cyan(`${appName}/`)} from ${chalk.cyan(
        path.resolve(root, '..'),
      )}`,
    );
    process.chdir(path.resolve(root, '..'));
    fs.removeSync(path.join(root));
  }
  console.log('Done.');
  process.exit(1);
}

function success(appPath, appName, originalDirectory) {
  const useYarn = false;
  const displayedCommand = useYarn ? 'yarn' : 'npm';
  let cdpath;
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  console.log();
  console.log(`Success! Created capp at ${root} success`);
  console.log('Inside that directory, you can run several commands:');
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} start`));
  console.log('    Starts the development server.');
  console.log();
  console.log(
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`),
  );
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} test`));
  console.log('    Starts the test runner.');
  console.log();
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(`  ${chalk.cyan(`${displayedCommand} start`)}`);
  console.log();
  console.log('Happy hacking!');
}

function install(root, dependencies, isDev) {
  return new Promise((resolve, reject) => {
    const command = 'npm';
    let args = [
      'install',
    ];
    if (dependencies.length > 0) {
      if (isDev) {
        args = args.concat(['--save-dev']);
      } else {
        args = args.concat(['--save']);
      }
      args = args.concat(dependencies);
    }
    args.push('--cwd');
    args.push(root);

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')}`));
        return;
      }
      resolve();
    });
  });
}

function initGit() {
  return new Promise((resolve, reject) => {
    const command = 'git';
    const args = [
      'init',
    ];

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')}`));
        return;
      }
      resolve();
    });
  });
}

function initialCommit() {
  return new Promise((resolve) => {
    const command = 'git';
    let args = [
      'add',
      '-A',
    ];

    function getError(c, a) {
      return new Error(`${c} ${a.join(' ')}`);
    }

    let error = null;

    try {
      const result1 = spawn.sync(command, args, { stdio: 'inherit' });
      if (result1.status === 0) {
        args = [
          'commit',
          '-m',
          '"Initial commit"',
        ];
        const result2 = spawn.sync(command, args, { stdio: 'inherit' });
        if (result2.status !== 0) {
          error = getError(command, args);
          // reject(getError(command, args));
        }
      } else {
        error = getError(command, args);
        // reject(getError(command, args));
      }
    } catch (err) {
      error = getError(command, args);
      // reject(getError(command, args));
    }

    if (error) {
      console.log('git initial commit faild');
      console.log(error);
    }

    resolve();
  });
}

function isSafeToCreateProjectIn(root, name) {
  const validFiles = [
    '.DS_Store',
    'Thumbs.db',
    '.git',
    '.gitignore',
    '.idea',
    'README.md',
    'LICENSE',
    'web.iml',
    '.hg',
    '.hgignore',
    '.hgcheck',
    '.npmignore',
    'mkdocs.yml',
    'docs',
    '.travis.yml',
    '.gitlab-ci.yml',
    '.gitattributes',
  ];
  console.log();

  const conflicts = fs
    .readdirSync(root)
    .filter(file => !validFiles.includes(file))
    // Don't treat log files from previous installation as conflicts
    .filter(
      file => !errorLogFilePatterns.some(pattern => file.indexOf(pattern) === 0),
    );

  if (conflicts.length > 0) {
    console.log(
      `The directory ${chalk.green(name)} contains files that could conflict:`,
    );
    console.log();
    for (const file of conflicts) {
      console.log(`  ${file}`);
    }
    console.log();
    console.log(
      'Either try using a new directory name, or remove the files listed above.',
    );

    return false;
  }

  // Remove any remnant files from a previous installation
  const currentFiles = fs.readdirSync(path.join(root));
  currentFiles.forEach(file => {
    errorLogFilePatterns.forEach(errorLogFilePattern => {
      // This will catch `(npm-debug|yarn-error|yarn-debug).log*` files
      if (file.indexOf(errorLogFilePattern) === 0) {
        fs.removeSync(path.join(root, file));
      }
    });
  });
  return true;
}

async function copyFiles(paths, dest) {
  return new Promise((resolve, reject) => {
    copy(paths, dest, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

function isMobile() {
  return projectType !== 'admin' && mobile;
}
