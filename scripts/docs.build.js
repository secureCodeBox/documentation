const fs = require('fs');
const download = require('download-git-repo');

console.log('Downloading secureCodeBox-v2 repository.');
download('secureCodeBox/secureCodeBox-v2', 'secureCodeBox-v2', function (err) {
  if (err) {
    console.error('Download failed');
    console.error(err);
  } else {
    console.log('secureCodeBox repository downloaded.');
    fs.readFileSync('secureCodeBox-v2/README.md', 'utf8', function (err, data) {
      console.log(err ? err : data);
    });
  }
});
