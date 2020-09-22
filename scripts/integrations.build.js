const fs = require('fs'),
  rimraf = require('rimraf'),
  colors = require('colors'),
  fm = require('front-matter'),
  capitalizer = require('./utils/capitalizer');

colors.setTheme({
  info: 'blue',
  help: 'cyan',
  warn: 'yellow',
  success: 'green',
  error: 'red',
});

/**
 ** This script builds an `integrations.js` file, parsing frontmatter information into objects.
 ** It reads the files of the given directories (not the subdirectories) and retrieves frontmatter data,
 ** parsing it to objects of type `Integration` (see below) and joins them into importable modules, respective to the given directories.
 */

const integrationsFN = 'src/integrations.js', // Name of the target file to (over-)write
  itgDirs = ['hooks', 'scanners'], // Names of the directories relative to the root level of the `/docs` folder
  defaultIcon = '/static/img/integrationIcons/Default.svg'; // Default Icon when no imageUrl provided or could not resolve imageUrl

class Integration {
  constructor(title, type, usecase, path, imageUrl) {
    this.title = title;
    this.type = type;
    this.usecase = usecase;
    this.path = path;
    this.imageUrl = imageUrl;
  }

  isEmpty() {
    return !this.title && !this.usecase;
  }
}

if (fs.existsSync(integrationsFN)) {
  rimraf.sync(integrationsFN);

  console.warn(
    `WARN: ${integrationsFN.info} already existed and was removed.`.warn
  );
}

// Inform about subdirectories (this runs asynchronously)
for (const dir of itgDirs) {
  fs.readdir(
    `docs/${dir}`,
    { encoding: 'utf8', withFileTypes: true },
    function (err, files) {
      if (err) {
        console.error(
          `ERROR: Could not read directory ${('docs/' + dir).info}.`.error,
          err.message.error
        );
      } else {
        files
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) =>
            console.warn(
              `WARN: Found subdirectory ${dirent.name.help}. If it contains integrations as well you must specify it explicitly.`
                .warn
            )
          );
      }
    }
  );
}

const itgsArray = [];
// Build integrations from files
for (const dir of itgDirs) {
  const integrations = [],
    fileNames = fs
      .readdirSync(`docs/${dir}`, { encoding: 'utf8', withFileTypes: true })
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name.split('.').slice(0, -1).join('.'));

  for (const fileName of fileNames) {
    const content = fs.readFileSync(`docs/${dir}/${fileName}.md`, {
        encoding: 'utf8',
      }),
      attributes = fm(content).attributes,
      integration = new Integration(
        attributes.title,
        attributes.type,
        attributes.usecase
      );

    if (integration.isEmpty()) {
      console.warn(
        `WARN: Skipping: ${fileName.help}. Frontmatter does not provide required fields.`
          .warn,
        `Title: ${integration.title}`,
        `Description: ${integration.usecase}`
      );
    } else {
      const imageUrl = `static/img/integrationIcons/${integration.title}.svg`;

      if (fs.existsSync(`${imageUrl}`)) {
        integration.imageUrl = imageUrl;
      } else {
        integration.imageUrl = defaultIcon;
        console.warn(
          `WARN: Could not resolve ${imageUrl.info}. Using default image.`.warn
        );
      }

      integration.path = `docs/${dir}/${fileName}`;

      integrations.push(integration);
      console.log(`SUCCESS: Created integration for ${fileName.help}.`.success);
    }
  }

  itgsArray.push([dir, integrations]);
}

const itgsMap = new Map(itgsArray),
  itgsStringArray = [],
  itgKeys = [];

itgsMap.forEach((itgObject, itgName) => {
  const constantName = capitalizer.removeWhitespaces(
    capitalizer.capitalizeEach(itgName)
  );

  itgKeys.push(constantName);

  itgsStringArray.push(`
export const ${constantName} = ${JSON.stringify(itgObject)};
`);
});

itgsStringArray.push(`export default { ${itgKeys.join(',')} };`);

fs.writeFile(`${integrationsFN}`, itgsStringArray.join(''), function (err) {
  if (err) {
    console.error(
      `ERROR: Could not build ${integrationsFN.help}.`.error,
      err.message.error
    );
  }
});
