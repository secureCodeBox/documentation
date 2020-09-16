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

if (categories.length > 0) {
  console.log(categories);
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
