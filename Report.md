# **Report**


## **Part 1 - Design (weighted factor for grades = 2)**
### **1. Design and explain interactions between main components in your architecture of mysimbdp (1 point)**







	





The above design consists of REST APIs built with Node JS, they are connected to an application server deployed in a Cloud Virtual Machine that processes the data and provides validation also has the driver to connect Node server to MongoDB Server that is also deployed as a Cloud Service called MongoDB Atlas. All the requests are handled by the REST APIs, Data is entered by client through these APIs and also Data is returned to the clients.
### 2. Explain how many nodes are needed in the deployment of mysimbdp-coredms so that this component can work property (theoretically based on the selected technology ) (1 point)
The above design involves three nodes: -
1. Database Server: MondoDB Atlas
2. Application Server: Node JS using Mongoose driver to connect with MongoDB
3. API: programs written in JavaScript to be used by the user to interact with the database.
### 3. Will you use VMs or containers for mysimbdp and explain the reasons for each component (1 point)
Using VM is a smart idea because Cloud has many advantages like huge storage space, faster processing , failure handling and security. During deployment of this design Google Cloud Compute Engine has been used to install Mongo DB drivers, Node JS libraries and code development.
Docker can also be used to deploy the Application Servers as they run isolated so it allows many number of instances of the Application to run simultaneously increasing the availability of the services. In addition to that Kubernetes can be used to orchestrate many containers together ensuring efficient management of the entire application.
### 4. Explain how would you scale mysimbdp to allow a lot of users using mysimbdp-dataingest to push data into mysimbdp (1 point)
If the application and database is deployed on physical machines then it is possible to scale it both horizontally and vertically by increasing the number of servers and upgrading the hardware configuration of each server such as cpu cores, memory and storage upto a limited scale.
Since this project is deployed on Cloud Virtual Machine then it is not the developer's headache to think about scaling as Google Cloud services come advertised with on-demand scaling and rapid elasticity due to the presence of numerous physical systems running on background to provide an illusion of infinite resources ready to be provisioned as per necessity.
### 5. Explain your choice of industrial cloud infrastructure and/or mysimbdp-coredms provider, when you do not have enough infrastructural resources for provisioning mysimbdp (1 point)
Considering the number of advantages of Cloud Services, this project uses MongoDB Atlas; that is a cloud database service provided by MongoDB and can be accessed from anywhere and connected to the popular development platforms like Java, JavaScript, Python, C++ etc. The developer doesn't need to worry about performance as this service is highly scalable and capable of handling big data.
## Part 2 - Development and deployment (weighted factor for grades = 2)
### 1. Design and explain the data schema/structure for mysimbdp-coredms (1 point)
The dataset "Indoor Location Detection dataset" has been used here that contains 4 basic attributes: part_id, ts_date, ts_time and room, total 4 columns.
Below shown code has been written in JavaScript to define the schema: -
**A. LocData.js defines the schema data type**
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

**B. Template.js provides the structure that matches to that of the uploadable csv file**
var json2csv = require("json2csv");

exports.get = function(req, res) {
  var fields = ["part_id", "ts_date", "ts_time", "room"];

  var csv = json2csv({ data: "", fields: fields });

  res.set("Content-Disposition", "attachment;filename=IndoorLocDetDataset.csv");
  res.set("Content-Type", "application/octet-stream");

  res.send(csv);
};

### **2. Explain how would you partition the data in mysimbdp-coredms into different shards/partitions (1 point)**
Sharding is a scaling technique involving splitting of a very large dataset and storing the parts in different databases distributed across several machines forming a cluster of database systems that are capable of storing Big Data. The Dataset used here has 4160 rows that got imported in less than 2 seconds which means that the system design is far too capable for handling this dataset and so the Sharding was not required. Considering the capability of Cloud VM, the hypothetical dataset has to be extremely large as compared to the provided dataset in order to be sharded vertically and horizontally and maintained in separate servers.
### **3. Write a mysimbdp-dataingest that takes data from your selected sources and stores the data into mysimbdp-coredms (1 point)**
A.  HTML front end web page to enable the user to upload the csv file: -
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Upload Indoor Location Detection Info</title>
  </head>
  <body>
    <p>
      Use the form below to upload data. Click
      <a href="/template">here</a> for an example template.
    </p>
    <form action="/" method="POST" encType="multipart/form-data">
      <input type="file" name="file" accept="*.csv" /><br /><br />
      <input type="submit" value="Upload" />
    </form>
  </body>
</html>

B. index.js handles the connection with MongoDB: -
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

C. upload.js reads the csv data and sends to index.js: -
var json2csv = require("json2csv");

exports.get = function(req, res) {
  var fields = ["part_id", "ts_date", "ts_time", "room"];

  var csv = json2csv({ data: "", fields: fields });

  res.set("Content-Disposition", "attachment;filename=IndoorLocDetDataset.csv");
  res.set("Content-Type", "application/octet-stream");

  res.send(csv);
};

### **4. Given your deployment environment, show the uploading performance (response time and failure) of the tests for 1,5, 10, .., n of concurrent mysimbdp-dataingest pushing data into mysimbdp-coredms (1 point)**
No failures or errors were encountered so far. Response time is less than a second although there was a slight spike observed in the Graphs shown below that happen at the same time indicating that the database server is utilizing resources.






### **5. Observing the performance and failure problems when you push a lot of data into mysimbdp-coredms (you do not need to worry about duplicated data in mysimbdp), propose the change of your deployment to avoid such problems (or explain why you do not have any problem with your deployment) (1 point)**
If in any case there are bulk requests made through multiple APIs, it will affect the performance and response time of the database so a smart option will be using a data streaming platform like Amazon Kinesis that can handle the bulk requests by filtering and pipelining and put less pressure on the database. Using this product will increase the robustness of the entire system as it inherits the cloud characteristics like speed, elasticity, fault tolerance, scalability, durability.
## **Part 3 Extension with discovery and (weighted factor for grades = 1)**
### **1. Assume that each of your tenants/users will need a dedicated mysimbdp-coredms. Design the data schema of service information for mysimbdp-coredms that can be published into an existing registry (like ZooKeeper, consul or etcd) so that you can find information about which mysimbdp-coredms for which tenants/users. (1 point)**
In this case there are multiple instances of the coredms being used by multiple users, it is necessary to store the user information and configuration in an automated service like Zookeeper that also provides coordination,  group services and synchronization over a simplified centralized interface so that the user data can be analyzed and redirected to the corresponding database server hence decreasing load and increasing efficiency of the overall system.
### **3. Explain how you would change the implementation of mysimbdp-dataingest (in Part 2) to integrate a service discovery feature (no implementation is required) (1 point)**
Integrating a service discovery feature will make the data ingest go through Zookeeper before connecting to the database, Hence Zookeeper will be able to identify the nature of the request and then connect to the database.
### **5. Assume that now only mysimbdp-daas can read and write data into mysimbdp-coredms, how would you change your mysimbdp-dataingest (in Part 2) to work with mysimbdpdaas (1 point)**
A separate set of programs have been written to enter new Indoor Location data into the existing database and also view the data. This code has been tested on a local mongo db instance.
A.index.html is the front end of the service: -
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Indoor Location Detection Dataset</title>
  </head>
  <body>
    <h1>Please fill data in the form below:</h1>
    <form method="POST" action="/post-feedback">
      <label>part_id:<input type="text" name="part_id" required/></label>
      <br />
      <label>ts_date:<input type="text" name="ts_date" required/></label>
      <br />
      <label>ts_time:<input type="text" name="ts_time" required/></label>
      <br />
      <label>room:<input type="text" name="room" required/></label>
      <br />
      <input type="submit" value="Submit" />
    </form>
    <a href="/view-data">View data</a>
  </body>
</html>

B. app.js handles the GET and POST functions to interact with the database
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");

var dbConn = mongodb.MongoClient.connect("mongodb://localhost:27017");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "public")));

app.post("/post-LocColnode app.js", function(req, res) {
  dbConn.then(function(db) {
    delete req.body._id; // for safety reasons
    db.collection("LocCol").insertOne(req.body);
  });
  res.send("Data received:\n" + JSON.stringify(req.body));
});

app.get("/view-LocCol", function(req, res) {
  dbConn.then(function(db) {
    db.collection("LocCol")
      .find({})
      .toArray()
      .then(function(LocCol) {
        res.status(200).json(LocCol);
      });
  });
});

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0");


