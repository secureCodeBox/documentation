const fs = require('fs'),
  rimraf = require('rimraf'),
  colors = require('colors'),
  { capitalizeEach } = require('./utils/capitalizer'),
  { sidebarConfig: config } = require('./utils/config');

colors.setTheme({
  info: 'blue',
  help: 'cyan',
  warn: 'yellow',
  success: 'green',
  error: 'red',
});

// For the documentation on this script look at the README.md of this repository

if (fs.existsSync(config.sidebarName)) {
  rimraf.sync(config.sidebarName);

  console.warn(
    `WARN: ${config.sidebarName.info} already existed and was removed.`.warn
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

if (fileNames.length > 0) {
  config.sidebar.someSidebar[config.rootCategory] = fileNames;
  console.log(
    `SUCCESS: Added root document files to ${config.sidebarName.info}.`.success
  );
}

if (categories.length > 0) {
  for (const category of categories) {
    const cat = capitalizeEach(category);
    config.sidebar.someSidebar[cat] = createObjectFromDir(`docs/${category}`, cat)[
      cat
    ];
    console.log(
      `SUCCESS: Added ${category.help} to ${config.sidebarName.info}.`.success
    );
  }

  fs.writeFile(
    config.sidebarName,
    `module.exports = ${JSON.stringify(config.sidebar)};`,
    function (err) {
      err
        ? console.error(`ERROR: Could not create ${config.sidebarName.info}.`)
        : console.warn(
            `SUCCESS: Created ${config.sidebarName.info} successfully.`.success
          );
    }
  );
} else {
  console.warn(`WARN: Nothing found in ${'docs/'.info}.`.warn);

  fs.writeFile(
    config.sidebarName,
    `module.exports = ${JSON.stringify(config.sidebar)};`,
    function (err) {
      err
        ? console.error(`ERROR: Could not create empty ${config.sidebarName.info}.`)
        : console.warn(`WARN: Empty ${config.sidebarName.info} created`.warn);
    }
  );
}

function createObjectFromDir(dir, categoryName) {
  const category = capitalizeEach(categoryName),
    // remove 'docs/' for correct reference
    relDir = dir.replace('docs/', '', 1),
    obj = { [category]: [] };

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
      const items = createObjectFromDir(`${dir}/${subDir}`, subDir)[
        capitalizeEach(subDir)
      ];
      obj[category].push({
        type: 'category',
        label: subDir,
        items: items,
      });
    }
  }

  obj[category] = obj[category].concat(fileLinks);

  return obj;
}
