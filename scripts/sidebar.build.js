const fs = require('fs');
const rimraf = require('rimraf');
const colors = require('colors');

colors.setTheme({
  info: 'blue',
  help: 'cyan',
  warn: 'yellow',
  success: 'green',
  error: 'red',
});

/**
 ** This script works as follows:
 **
 */

const sidebarName = 'sidebars.js';
const sidebar = { someSidebar: {} };
const generalCategory = 'Others';

if (fs.existsSync(sidebarName)) {
  rimraf.sync(sidebarName);

  console.warn(
    `WARN: ${sidebarName.info} already existed and was removed.`.warn
  );
}

const categories = fs
  .readdirSync(`docs`, { encoding: 'utf8', withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const fileNames = fs
  .readdirSync(`docs`, { encoding: 'utf8', withFileTypes: true })
  .filter((dirent) => dirent.isFile())
  .map((dirent) => dirent.name.split('.').slice(0, -1).join('.'));

if (fileNames.length > 0) sidebar.someSidebar[generalCategory] = fileNames;

if (categories.length > 0) {
  for (const category of categories) {
    sidebar.someSidebar[category] = createObjectFromDir(
      `docs/${category}`,
      category
    )[category];
  }

  fs.writeFile(
    sidebarName,
    `module.exports = ${JSON.stringify(sidebar)};`,
    function (err) {
      err
        ? console.error(`ERROR: Could not create ${sidebarName.info}.`)
        : console.warn(
            `SUCCESS: Created ${sidebarName.info} successfully.`.success
          );
    }
  );
} else {
  console.warn(`WARN: Nothing found in ${'docs/'.info}.`.warn);

  fs.writeFile(
    sidebarName,
    `module.exports = ${JSON.stringify(sidebar)};`,
    function (err) {
      err
        ? console.error(`ERROR: Could not create empty ${sidebarName.info}.`)
        : console.warn(`WARN: Empty ${sidebarName.info} created`.warn);
    }
  );
}

function createObjectFromDir(dir, categoryName) {
  // remove 'docs/' for correct reference
  const relDir = dir.replace('docs/', '', 1);

  const obj = { [categoryName]: [] };

  const fileNames = fs
    .readdirSync(dir, {
      encoding: 'utf8',
      withFileTypes: true,
    })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name.split('.').slice(0, -1).join('.'));

  const fileLinks = [];
  for (const fileName of fileNames) {
    fileLinks.push(`${relDir}/${fileName}`);
  }

  const subDirs = fs
    .readdirSync(dir, { encoding: 'utf8', withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  // Iterates through all subdirectories recursively
  if (subDirs.length > 0) {
    for (const subDir of subDirs) {
      const items = createObjectFromDir(`${dir}/${subDir}`, subDir);
      obj[categoryName].push({
        type: 'category',
        label: subDir,
        items: [items],
      });
    }
  }

  obj[categoryName] = obj[categoryName].concat(fileLinks);

  return obj;
}
