// SPDX-FileCopyrightText: 2021 iteratec GmbH
//
// SPDX-License-Identifier: Apache-2.0

const fs = require("fs"),
  rimraf = require("rimraf"),
  downloadCallback = require("download-git-repo"),
  colors = require("colors"),
  matter = require("gray-matter"),
  { promisify } = require("util"),
  { docsConfig: config } = require("./utils/config"),
  { removeWhitespaces } = require("./utils/capitalizer"),
  Mustache = require("mustache");

const download = promisify(downloadCallback);

colors.setTheme({
  info: "blue",
  help: "cyan",
  warn: "yellow",
  success: "green",
  error: "red",
});

// For the documentation on this script look at the README.md of this repository

async function main() {
  console.log(`Downloading ${config.repository} into ${config.temp}...`.info);

  await download(config.repository, config.temp).catch((err) => {
    console.error("ERROR: Download failed.".error);
    throw err;
  });

  console.log(`SUCCESS: ${config.repository} downloaded.`.success);

  const promises = config.srcDirs.map((dir) =>
    readDirectory(`${config.temp}/${dir}`).catch((err) =>
      console.error(
        `ERROR: Could not read directory at: ${dir}`.error,
        err.message.error
      )
    )
  );

  const dataArray = await Promise.all(promises);

  if (!fs.existsSync(config.targetPath)) {
    fs.mkdirSync(config.targetPath);
  }
  // Clear preexisting findings
  if (fs.existsSync(config.findingsDir)) {
    rimraf.sync(config.findingsDir);
  }

  for (const dir of config.srcDirs) {
    const trgDir = `${config.targetPath}/${dir}`;

    // Overwrites existing directories with the same name
    if (fs.existsSync(trgDir)) {
      rimraf.sync(trgDir);

      console.warn(
        `WARN: ${trgDir.info} already existed and was overwritten.`.warn
      );
    }

    fs.mkdirSync(trgDir);
    await createDocFilesFromDir(
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
    fs.readdir(dir, { encoding: "utf8", withFileTypes: true }, function (
      err,
      data
    ) {
      if (err) {
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

    if (!fs.existsSync(readMe)) {
      console.log(
        `WARN: Skipping ${dirName.help}: file not found at ${readMe.info}.`.warn
      );
      continue;
    }

    // Read readme content of scanner / hook directory
    const readmeContent = fs.readFileSync(readMe, { encoding: "utf8" });

    const examples = await getExamples(`${relPath}/${dirName}/examples`);

    // Add a custom editUrl to the frontMatter to ensure that it points to the correct repo
    const { data: frontmatter, content } = matter(readmeContent);
    const filePathInRepo = relPath.replace(/^githubRepo\//, "");
    const readmeWithEditUrl = matter.stringify(content, {
      ...frontmatter,
      custom_edit_url: `https://github.com/${config.repository}/edit/main/${filePathInRepo}/${dirName}/README.md.gotmpl`,
    });

    // Skip File if its marked as "hidden" in its frontmatter
    if (frontmatter.hidden !== undefined && frontmatter.hidden === true) {
      continue;
    }

    const integrationPage = Mustache.render(
      fs.readFileSync("./scripts/utils/scannerReadme.mustache", {
        encoding: "utf8",
      }),
      {
        readme: readmeWithEditUrl,
        examples,
        hasExamples: examples.length !== 0,
      }
    );

    let  fileName = frontmatter.title ? frontmatter.title : dirName;

    //Replace Spaces in the FileName with "-" and convert to lower case to avoid URL issues
    fileName = fileName.replace(/ /g, "-").toLowerCase();

    const filePath = `${targetPath}/${fileName}.md`;
    fs.writeFileSync(filePath, integrationPage);

    console.log(
      `SUCCESS: Created file for ${dirName.help} at ${filePath.info}`.success
    );
  }
}

async function getExamples(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const dirNames = await readDirectory(dir).catch(() => []);

  if (dirNames.length === 0) {
    console.warn(`WARN: Found empty examples folder at ${dir.info}.`.warn);
    return [];
  }

  return dirNames.map((dirName) => {
    let readMe = "";

    if (fs.existsSync(`${dir}/${dirName}/README.md`)) {
      readMe = matter(
        fs.readFileSync(`${dir}/${dirName}/README.md`, {
          encoding: "utf8",
        })
      ).content;
    }

    let scanContent = null;
    if (fs.existsSync(`${dir}/${dirName}/scan.yaml`)) {
      scanContent = fs.readFileSync(`${dir}/${dirName}/scan.yaml`, {
        encoding: "utf8",
      });
    }

    let findingContent = null;
    let findingSizeLimitReached = null;

    if (fs.existsSync(`${dir}/${dirName}/findings.yaml`)) {
      findingSizeLimitReached =
        fs.statSync(`${dir}/${dirName}/findings.yaml`).size >= config.sizeLimit;

      if (findingSizeLimitReached) {
        console.warn(
          `WARN: Findings for ${dirName.info} exceeded size limit.`.warn
        );

        findingContent = copyFindingsForDownload(
          `${dir}/${dirName}/findings.yaml`
        );
      } else {
        findingContent = fs.readFileSync(`${dir}/${dirName}/findings.yaml`, {
          encoding: "utf8",
        });
      }
    }

    let findings = null;
    if (findingContent && findingSizeLimitReached !== null) {
      findings = {
        value: findingContent,
        limitReached: findingSizeLimitReached,
      };
    }

    return {
      name: removeWhitespaces(dirName),
      exampleReadme: readMe,
      scan: scanContent,
      findings,
    };
  });
}

function copyFindingsForDownload(filePath) {
  const dirNames = filePath.split("/"),
    name =
      dirNames[dirNames.indexOf("examples") - 1] +
      "-" +
      dirNames[dirNames.indexOf("examples") + 1],
    targetPath = `public/findings/${name}-findings.yaml`;

  if (!fs.existsSync("public")) {
    fs.mkdirSync("public/");
  }
  if (!fs.existsSync("public/findings")) {
    fs.mkdirSync("public/findings/");
  }

  fs.copyFileSync(filePath, targetPath);
  console.log(`SUCCESS: Created download link for ${name.info}.`.success);

  return targetPath;
}

function clearDocsOnFailure() {
  for (const dir of config.srcDirs) {
    const trgDir = `${config.targetPath}/${dir}`;
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
