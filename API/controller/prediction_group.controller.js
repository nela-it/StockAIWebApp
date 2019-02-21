const db = require("../models/index");
const Prediction_group = db.Prediction_group;
const Op = db.Op;
const chokidar = require("chokidar");
const XLSX = require("xlsx");

var watcher = chokidar.watch("../files", {
  persistent: true
});

exports.checkExcelSheet = (req, res, next) => {
  console.log("---------------------------------------------------");
  console.log("this is chokidar way file find");
  console.log("---------------------------------------------------");

  watcher.on("add", function(path) {
    console.log("File", path, "has been added");
    if (path.split(".")[1] === "xlsx" || path.split(".")[1] === "xls") {
      var workbook = XLSX.readFile(`./${path}`, {
        cellDates: true,
        cellText: false
      });
      var sheet_name_list = workbook.SheetNames;
      let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
      console.log("excel sheet name", sheet_name_list[0]);
      console.log("excel data here", data);
      return res.status(400).json({
        message: data
      });
    } else {
      return res.status(400).json({
        message: "File Not Added"
      });
    }
  });
};
