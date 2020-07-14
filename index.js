const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// simply mongodb installed
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const objectID = mongodb.ObjectID;

const dbURL = "mongodb://127.0.0.1:27017";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("your app is running in", port));

app.get("/", (req, res) => {
  res.send("<h1>Simple GET & POST request app..! </h1>");
});

app.get("/users", (req, res) => {
  mongoClient.connect(dbURL, (err, client) => {
    if (err) throw err;
    let db = client.db("collegeRecords");
    db.collection("users")
      .find()
      .toArray()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(404).json({
          message: "No data Found or some error happen",
          error: err,
        });
      });
  });
});

app.post("/users", (req, res) => {
  mongoClient.connect(dbURL, (err, client) => {
    client
      .db("collegeRecords")
      .collection("users")
      .insertOne(req.body, (err, data) => {
        if (err) throw err;
        client.close();
        console.log("User Created successfully, Connection closed");
        res.status(200).json({
          message: "User Created..!!",
        });
      });
  });
});

app.put("/users/:id", (req, res) => {
  mongoClient.connect(dbURL, (err, client) => {
    if (err) throw err;
    client
      .db("collegeRecords")
      .collection("users")
      .findOneAndUpdate({ _id: objectID(req.params.id) }, { $set: req.body })
      .then((data) => {
        console.log("User data update successfully..!!");
        client.close();
        res.status(200).json({
          message: "User data updated..!!",
        });
      });
  });
});

app.delete("/users/:id", (req, res) => {
  mongoClient.connect(dbURL, (err, client) => {
    if (err) throw err;
    client
      .db("collegeRecords")
      .collection("users")
      .deleteOne({ _id: objectID(req.params.id) }, (err, data) => {
        if (err) throw err;
        client.close();
        res.status(200).json({
          message: "User deleted...!!",
        });
      });
  });
});
