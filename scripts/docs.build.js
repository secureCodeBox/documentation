const fs = require('fs');
const rimraf = require('rimraf');
const download = require('download-git-repo');
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
 *! This script overrides all existing subdirectories within 'trgPath', with the same name as as the names in 'srcDirs'
 *! This script does not check for markdown files but for files named 'README.md'
 *? The subdirectories are not required to contain a README.md
 */

const temp = 'githubRepo';

const repository = 'secureCodeBox/secureCodeBox-v2'; // The repository url without the github part of the link
const trgPath = 'docs'; // This needs to be 'docs' for the docusaurus build, but you may specify a 'docs/<subdirectory>'

const srcDirs = ['scanners', 'hooks', 'docs'];

new Promise((res, rej) => {
  console.log(`Downloading ${repository} into ${temp}...`.info);

  download(repository, temp, function (err) {
    if (err) {
      console.error('ERROR: Download failed.'.error);
      rej(err);
    } else {
      console.log(`SUCCESS: ${repository} downloaded.`.success);
      res();
    }
  });
})
  .then(
    () => {
      const promises = [];

      for (const dir of srcDirs) {
        promises.push(readDirectory(dir));
      }

      Promise.all(promises)
        .then(
          (dataArray) => {
            if (!fs.existsSync(trgPath)) {
              fs.mkdirSync(trgPath);
            }

            for (const dir of srcDirs) {
              const trgDir = `${trgPath}/${dir}`;

              // Overwrites existing directories with the same name
              if (fs.existsSync(trgDir)) {
                rimraf.sync(trgDir);

                console.warn(
                  `WARN: ${trgDir.info} already existed and was overwritten.`
                    .warn
                );
              }

              fs.mkdirSync(trgDir);
              createDocFiles(
                `${temp}/${dir}`,
                trgDir,
                dataArray[srcDirs.indexOf(dir)]
              );
            }

            rimraf(temp, function (err) {
              err
                ? console.warn(`WARN: Could not remove ${temp.info}.`.warn)
                : console.log(`Removed ${temp}.`.info);
            });
          },
          (err) => {
            console.error(err);
          }
        )
        .catch((err) => {
          clearDocsOnFailure();
          console.error(err.stack.error); // To point error out by color
        });
    },
    (err) => {
      console.error(err);
    }
  )
  .catch((err) => {
    clearDocsOnFailure();
    console.error(err.stack.error); // To point error out by color
  });

function readDirectory(dir) {
  return new Promise((res, rej) => {
    fs.readdir(
      `${temp}/${dir}`,
      { encoding: 'utf8', withFileTypes: true },
      function (err, data) {
        if (err) {
          console.error(`ERROR: Could not read directory at: ${dir}`.error);
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
      const filePath = `${targetPath}/${dirName}.md`;

      fs.writeFileSync(filePath, fileBuffer);

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

function clearDocsOnFailure() {
  for (const dir of srcDirs) {
    const trgDir = `${trgPath}/${dir}`;
    if (fs.existsSync(trgDir)) {
      rimraf(trgDir, { maxRetries: 3, recursive: true }, function (err) {
        if (err) {
          console.error(`ERROR: Could not remove ${trgDir} on failure.`.error);
          console.error(err);
        } else {
          console.log(
            `Removed ${trgDir.info} due to previous failure.`.magenta
          );
        }
      });
    }
  }
}
