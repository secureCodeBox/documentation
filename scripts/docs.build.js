const fs = require('fs');
const download = require('download-git-repo');

/**
 ** This script works as follows:
 ** 1. Download the specified github repository into a temporary location.
 ** 2. Read out the subdirectories of the specified directories (srcDirs).
 ** 3. Create for each srcDir a corresponding directory in trgPath.
 ** 4. Create for each README.md found in each subdirectory a new file (named after the subdirectory the file's in).
 *
 * The target file structure will look something like this (in the root directory):
 * |-...
 * |- <trgPath>
 * |-|- <dir 1 of srcDir>
 * |-|-|- <README.md as <dir>.md from subDir 1 of dir 1>
 * |-|-|-...
 * |-|-|- <README.md as <dir>.md from subDir n of dir 1>
 * |-|-...
 * |-|- <dir n of srcDir>
 * |-|-|-...
 * |-...
 *
 *! This script does not check for markdown files but for files named 'README.md'
 *? The subdirectories are not required to contain a README.md 
 */

const temp = 'temp/gitHubRepo';

const repository = 'secureCodeBox/secureCodeBox-v2'; // The repository url without the github part of the link
const trgPath = 'docs'; // This needs to be 'docs' for the docusaurus build, but you may specify a 'docs/<subdirectory>'

const srcDirs = ['scanners', 'hooks'];

new Promise((res, rej) => {
  console.log(`Downloading ${repository}.`);

  download(repository, temp, function (err) {
    if (err) {
      console.error('Download failed.');
      rej(err);
    } else {
      console.log(`${repository} downloaded.`);
      res();
    }
  });
}).then(
  () => {
    const promises = [];

    for (const dir of srcDirs) {
      promises.push(readDirectory(dir));
    }

    Promise.all(promises).then(
      (dataArray) => {
        for (const dir of srcDirs) {
          const trgDir = `${trgPath}/${dir}`;

          fs.mkdirSync(trgDir, function (err) {
            console.error(`Could not create directory at ${trgDir}.`);
            console.error(err);
          });

          createDocFiles(
            `${temp}/${dir}`,
            trgDir,
            dataArray[srcDirs.indexOf(dir)]
          );
        }
      },
      (err) => {
        console.error(err);
      }
    );
  },
  (err) => {
    console.error(err);
  }
);

function readDirectory(dir) {
  return new Promise((res, rej) => {
    fs.readdir(
      `${temp}/${dir}`,
      { encoding: 'utf8', withFileTypes: true },
      function (err, data) {
        if (err) {
          console.error(`Could not read directory at: ${dir}`);
          rej(err);
        } else {
          const directories = data
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
          res(directories);
        }
      }
    );
  });
}

function createDocFiles(relPath, targetPath, dirNames) {
  for (const dirName of dirNames) {
    const readMe = `${relPath}/${dirName}/README.md`;

    if (fs.existsSync(readMe)) {
      const fileBuffer = fs.readFileSync(readMe);
      fs.writeFileSync(`${targetPath}/${dirName}.md`, fileBuffer);

      console.log(`Created file for ${dirName} at ${targetPath}/${dirName}.md`);
    } else {
      console.error(`File not found at ${readMe}.`);
    }
  }
}
