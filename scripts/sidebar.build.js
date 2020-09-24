const fs = require("fs"),
  rimraf = require("rimraf"),
  colors = require("colors"),
  { capitalizeEach } = require("./utils/capitalizer"),
  { sidebarConfig, docsConfig } = require("./utils/config");

colors.setTheme({
  info: "blue",
  help: "cyan",
  warn: "yellow",
  success: "green",
  error: "red",
});

// For the documentation on this script look at the README.md of this repository

if (fs.existsSync(sidebarConfig.sidebarName)) {
  rimraf.sync(sidebarConfig.sidebarName);

  console.warn(
    `WARN: ${sidebarConfig.sidebarName.info} already existed and was removed.`
      .warn
  );
}

const categories = docsConfig.srcDirs;

if (categories.length === 0) {
  console.warn(`WARN: Nothing found in ${"docs/".info}.`.warn);
}

const generatedEntries = {};

for (const category of categories) {
  const cat = capitalizeEach(category.replace("-", " "));
  const sidebarEntry = createObjectFromDir(`docs/${category}`);

  console.log(
    `SUCCESS: Added ${category.help} to ${sidebarConfig.sidebarName.info}.`
      .success
  );

  generatedEntries[cat] = sidebarEntry;
}

const sidebar = {
  docs: {
    ...sidebarConfig.sidebar,
    ...generatedEntries,
  },
};

fs.writeFile(
  sidebarConfig.sidebarName,
  JSON.stringify(sidebar, undefined, 2),
  function (err) {
    err
      ? console.error(
          `ERROR: Could not create ${sidebarConfig.sidebarName.info}.`
        )
      : console.warn(
          `SUCCESS: Created ${sidebarConfig.sidebarName.info} successfully.`
            .success
        );
  }
);

function createObjectFromDir(dir) {
  // remove 'docs/' for correct reference
  const relDir = dir.replace("docs/", "", 1);

  const fileNames = fs
    .readdirSync(dir, {
      encoding: "utf8",
      withFileTypes: true,
    })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name.split(".").slice(0, -1).join("."));

  return fileNames.map((fileName) => `${relDir}/${fileName}`);
}
