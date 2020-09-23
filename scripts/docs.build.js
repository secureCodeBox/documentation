const fs = require('fs'),
  rimraf = require('rimraf'),
  downloadCallback = require('download-git-repo'),
  colors = require('colors'),
  fm = require('front-matter'),
  { promisify } = require('util'),
  { docsConfig: config } = require('./utils/config'),
  { capitalizeFirst, removeWhitespaces } = require('./utils/capitalizer'),
  Mustache = require('mustache');

const download = promisify(downloadCallback);

colors.setTheme({
  info: 'blue',
  help: 'cyan',
  warn: 'yellow',
  success: 'green',
  error: 'red',
});

/**
 ** This script works as follows:
 ** 1. Download the specified github repository into a temporary location.
 ** 2. Copy each file of srcFiles into the config.singleFileDirectory
 ** 3. Read out the subdirectories of the specified directories (`srcDirs`).
 ** 4. Create for each `srcDir` a corresponding directory in `trgPath`.
 ** 5. Create for each `README.md` found in each subdirectory a new file (named after the title attribute in its frontmatter).
 **   I. If an `/examples` subdirectory exists composite examples part, else continue on step 5.
 **  II. Build a tab for each subdirectory in the `/examples` directory.
 ** III. In each tab add contents of the respective example `README.md` and build new tabs for `scan.yaml` and `findings.yaml` (all files are optional).
 **  IV. If `findings.yaml` exceeds size limit, create downloadable file and embed respective link.
 **   V. Concatenate example part to previous `README.md`
 ** 6. Delete temporary folder.
 *
 * The target file structure will look something like this (in the root directory):
 * |-...
 * |- <trgPath>
 * |-|- <dir 1 of srcDirs>
 * |-|-|- <README.md as <frontmatter title>.md from subDir 1 of dir 1>
 * |-|-|-...
 * |-|-...
 * |-|-|-...
 * |- <config.singleFileDirectory>
 * |-|- <file 1 of srcFiles>
 * |-|-...
 * |-..
 *
 *! This script overrides all existing subdirectories within 'trgPath', with the same name as as the names in 'srcDirs'
 *! This script does not check for markdown files but for files named 'README.md'
 *? The subdirectories are not required to contain a README.md
 */

async function main() {
  console.log(`Downloading ${config.repository} into ${config.temp}...`.info);

  await download(config.repository, config.temp).catch((err) => {
    console.error('ERROR: Download failed.'.error);
    throw err;
  });

  console.log(`SUCCESS: ${config.repository} downloaded.`.success);

  if (config.srcFiles.length > 0) createSingleDocFiles();

  const promises = config.srcDirs.map((dir) =>
    readDirectory(`${config.temp}/${dir}`)
  );

  const dataArray = await Promise.all(promises);

  if (!fs.existsSync(config.trgPath)) {
    fs.mkdirSync(config.trgPath);
  }
  // Clear preexisting findings
  if (fs.existsSync(config.findingsDir)) {
    rimraf.sync(config.findingsDir);
  }

  for (const dir of config.srcDirs) {
    const trgDir = `${config.trgPath}/${dir}`;

    // Overwrites existing directories with the same name
    if (fs.existsSync(trgDir)) {
      rimraf.sync(trgDir);

      console.warn(
        `WARN: ${trgDir.info} already existed and was overwritten.`.warn
      );
    }

    fs.mkdirSync(trgDir);
    createDocFilesFromDir(
      `${config.temp}/${dir}`,
      trgDir,
      dataArray[config.srcDirs.indexOf(dir)]
    );
  }

  rimraf(config.temp, function (err) {
    err
      ? console.warn(`WARN: Could not remove ${config.temp.info}.`.warn)
      : console.log(`Removed ${config.temp}.`.info);
  });
}

main().catch((err) => {
  clearDocsOnFailure();
  console.error(err.stack.error);
});

function readDirectory(dir) {
  return new Promise((res, rej) => {
    fs.readdir(dir, { encoding: 'utf8', withFileTypes: true }, function (
      err,
      data
    ) {
      if (err) {
        console.error(`ERROR: Could not read directory at: ${dir}`.error);
        rej(err);
      } else {
        const directories = data
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name);
        res(directories);
      }
    });
  });
}

async function createDocFilesFromDir(relPath, targetPath, dirNames) {
  for (const dirName of dirNames) {
    const readMe = `${relPath}/${dirName}/README.md`;
    let examplesContent = '';

    if (fs.existsSync(`${relPath}/${dirName}/examples`)) {
      const content = await getTemplatedExamples(
        `${relPath}/${dirName}/examples`
      );
      examplesContent = examplesContent.concat(content);
    }

    if (fs.existsSync(readMe)) {
      const readmeContent = fs.readFileSync(readMe, { encoding: 'utf8' });
      const fileName = fm(readmeContent).attributes.title
        ? fm(readmeContent).attributes.title
        : dirName;
      const filePath = `${targetPath}/${fileName}.md`;

      fs.writeFileSync(filePath, readmeContent.concat(examplesContent));

      console.log(
        `SUCCESS: Created file for ${dirName.help} at ${filePath.info}`.success
      );
    } else {
      console.log(
        `WARN: Skipping ${dirName.help}: file not found at ${readMe.info}.`.warn
      );
    }
  }
}

function createSingleDocFiles() {
  const targetPath = config.singleFileDirectory
    ? `docs/${config.singleFileDirectory}`
    : 'docs';

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath);
  }

  for (const path of config.srcFiles) {
    // Rename readmes to their folder names to avoid naming collisions
    const pathFragments = path.split('/');
    const fileName =
      pathFragments.length > 1 &&
      pathFragments[pathFragments.length - 1] === 'README.md'
        ? pathFragments[pathFragments.length - 2] + '.md'
        : path;

    fs.copyFile(
      `${config.temp}/${path}`,
      `${targetPath}/${fileName}`,
      function (err) {
        if (err) {
          console.error(
            `ERROR: Could not copy ${fileName.info} into ${targetPath.info}.`
              .error,
            err.message.error
          );
          rimraf(targetPath, function (err) {
            if (err) {
              console.error(
                `ERROR: Could not remove fragment ${targetPath.info} of previous failure.`
                  .error,
                err.message.error
              );
            }
          });
        } else {
          console.log(
            `Success: Copied ${fileName.info} into ${targetPath.info}.`.success
          );
        }
      }
    );
  }
}

//! The indentation is mandatory for the file content structure
async function getTemplatedExamples(dir) {
  // return Mustache.render(
  //   fs.readFileSync('./scripts/utils/scannerReadme.mustache', { encoding: 'utf8' }),
  //   {
  //     readme: 'Hello World this is the nmap scanner speaking.',
  //     examples: [
  //       {
  //         name: 'localhost',
  //         exampleReadme: 'This is an awesome example',
  //         scan: 'some yaml here',
  //         findings: {
  //           value: 'findings json',
  //           limitReached: true,
  //         },
  //       },
  //     ],
  //   }
  // );

  const dirNames = await readDirectory(dir);

  let examplesContent = '';

  if (dirNames.length === 0) {
    console.warn(`WARN: Found empty examples folder at ${dir.info}.`.warn);
    return;
  }

  const tabs = dirNames.map((dirName) => {
    return {
      label: capitalizeFirst(dirName),
      value: removeWhitespaces(dirName),
    };
  });

  examplesContent = examplesContent.concat(`


## Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### Localhost Scan
<Tabs
  defaultValue="${removeWhitespaces(dirNames[0])}"
  values={${JSON.stringify(tabs)}}>
  
`);

  for (const dirName of dirNames) {
    let example = '';
    let readMe = '';

    if (fs.existsSync(`${dir}/${dirName}/README.md`)) {
      readMe = fs.readFileSync(`${dir}/${dirName}/README.md`, {
        encoding: 'utf8',
      });
    }

    const scanFound = fs.existsSync(`${dir}/${dirName}/scan.yaml`),
      findingsFound = fs.existsSync(`${dir}/${dirName}/findings.yaml`);

    const scanContent = scanFound
      ? fs.readFileSync(`${dir}/${dirName}/scan.yaml`, {
          encoding: 'utf8',
        })
      : '';

    const findingsLimitReached = findingsFound
      ? fs.statSync(`${dir}/${dirName}/findings.yaml`).size >= config.sizeLimit
      : false;

    let findingsLink = '',
      findingsContent = '';

    if (findingsLimitReached) {
      console.warn(
        `WARN: Findings for ${dirName.info} exceeded size limit.`.warn
      );

      findingsLink = copyFindingsForDownload(`${dir}/${dirName}/findings.yaml`);
    } else {
      findingsContent = findingsFound
        ? fs.readFileSync(`${dir}/${dirName}/findings.yaml`, {
            encoding: 'utf8',
          })
        : '';
    }

    example = example.concat(`
<div>
${fm(readMe).body}
</div>

<Tabs
defaultValue="sc"
values={[
  ${scanFound ? `{label: 'Scan', value: 'sc'}` : ''}, 
  ${findingsFound ? `{label: 'Findings', value: 'fd'}` : ''},
]}>

${
  scanFound
    ? `
<TabItem value="sc">

\`\`\`yaml

${scanContent}

\`\`\`

</TabItem>
`
    : ''
}

${
  findingsFound
    ? `
<TabItem value="fd">

${
  findingsLimitReached
    ? `
<span>
The findings are too large to display, you may download
<a target="_blank" href='/${findingsLink}' download> the file.</a>
</span>
`
    : `
\`\`\`yaml

${findingsContent}

\`\`\`
`
}

</TabItem>
`
    : ''
}

</Tabs>
          `);

    examplesContent = examplesContent.concat(`
<TabItem value="${removeWhitespaces(dirName)}">
  ${example}
</TabItem>
          `);
  }
  examplesContent = examplesContent.concat(`
</Tabs>`);

  return examplesContent;
}

function copyFindingsForDownload(filePath) {
  const dirNames = filePath.split('/'),
    name =
      dirNames[dirNames.indexOf('examples') - 1] +
      '-' +
      dirNames[dirNames.indexOf('examples') + 1],
    targetPath = `public/findings/${name}-findings.yaml`;

  if (!fs.existsSync('public')) {
    fs.mkdirSync('public/');
  }
  if (!fs.existsSync('public/findings')) {
    fs.mkdirSync('public/findings/');
  }

  fs.copyFileSync(filePath, targetPath);
  console.log(`SUCCESS: Created download link for ${name.info}.`.success);

  return targetPath;
}

function clearDocsOnFailure() {
  for (const dir of config.srcDirs) {
    const trgDir = `${config.trgPath}/${dir}`;
    if (fs.existsSync(trgDir)) {
      rimraf(trgDir, { maxRetries: 3, recursive: true }, function (err) {
        if (err) {
          console.error(
            `ERROR: Could not remove ${trgDir.info} on failure.`.error
          );
          console.error(err.message.error);
        } else {
          console.log(
            `Removed ${trgDir.info} due to previous failure.`.magenta
          );
        }
      });
    }
  }
}
