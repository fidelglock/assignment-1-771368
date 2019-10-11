var mongoose = require("mongoose");

var LocSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  part_id: {
    type: String,
    required: true
  },
  ts_date: String,
  ts_time: String,
  room: String
});

var LocData = mongoose.model("Location Data", LocSchema);

module.exports = LocData;
