var json2csv = require("json2csv");

exports.get = function(req, res) {
  var fields = ["part_id", "ts_date", "ts_time", "room"];

  var csv = json2csv({ data: "", fields: fields });

  res.set("Content-Disposition", "attachment;filename=authors.csv");
  res.set("Content-Type", "application/octet-stream");

  res.send(csv);
};
