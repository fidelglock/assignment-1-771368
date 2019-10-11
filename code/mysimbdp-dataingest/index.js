var app = require("express")();
var fileUpload = require("express-fileupload");
var mongoose = require("mongoose");

var server = require("http").Server(app);

app.use(fileUpload());

server.listen(80);

mongoose.connect(
  "mongodb+srv://bdp2019:qwerty12345@test-bdp-e6nsj.gcp.mongodb.net/test?retryWrites=true&w=majority"
);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

var template = require("./template.js");
app.get("/template", template.get);

var upload = require("./upload.js");
app.post("/", upload.post);
