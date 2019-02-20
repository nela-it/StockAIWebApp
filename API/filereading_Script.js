console.log('---------------------------------------------------------------------');
console.log('this is Cron Job way file find');
console.log('---------------------------------------------------------------------');

const XLSX = require('xlsx');
const CronJob = require('cron').CronJob;
const FileHound = require('filehound');

new CronJob('0 */01 * * * *', () => {
  FileHound.create()
    .paths('./files')
    .ext(['xlsx', 'xls'])
    .find((err, files) => {
      if (err) throw err;
      for (let i = 0; i < files.length; i++) {
        var workbook = XLSX.readFile(`./${files[i]}`, {
          cellDates: true,
          cellText: false
        });
        var sheet_name_list = workbook.SheetNames;
        let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        console.log("excel sheet name", sheet_name_list[0])
        console.log("excel data here", data);
      }
    });
}, null, true, 'America/Los_Angeles');

console.log('---------------------------------------------------------------------');
console.log('this is chokidar way file find');
console.log('---------------------------------------------------------------------');

var chokidar = require('chokidar');

var watcher = chokidar.watch('./files', {
  persistent: true
});

watcher
  .on('add', function (path) {
    console.log('File', path, 'has been added');
    if (path.split(".")[1] === 'xlsx' || path.split(".")[1] === 'xls') {
      var workbook = XLSX.readFile(`./${path}`, {
        cellDates: true,
        cellText: false
      });
      var sheet_name_list = workbook.SheetNames;
      let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
      console.log("excel sheet name", sheet_name_list[0])
      console.log("excel data here", data);
    }
  });
