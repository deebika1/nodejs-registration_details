const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

// simply mongodb installed
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const objectID = mongodb.ObjectID;

// const dbURL =
//   "mongodb+srv://rvsp:vgBdLGDqVViScZ0F@training-cluster-4aefv.gcp.mongodb.net/studentDetail?retryWrites=true&w=majority";

// const dbURL = 'mongodb://127.0.0.1:27017';

const dbURL = process.env.DB_URL;

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
    let db = client.db("studentDetail");
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
      .db("studentDetail")
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
      .db("studentDetail")
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
      .db("studentDetail")
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

app.post("/register", (req, res) => {
  mongoClient.connect(dbURL, (err, client) => {
    if (err) throw err;
    let db = client.db("studentDetail");
    db.collection("users").findOne({ email: req.body.email }, (err, data) => {
      if (err) throw err;
      if (data) {
        res.status(400).json({ message: "Email already exists..!!" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, cryptPassword) => {
            if (err) throw err;
            req.body.password = cryptPassword;
            db.collection("users").insertOne(req.body, (err, result) => {
              if (err) throw err;
              client.close();
              res.status(200).json({ message: "Registration successful..!! " });
            });
          });
        });
      }
    });
  });
});

app.post("/login", (req, res) => {
  mongoClient.connect(dbURL, (err, client) => {
    if (err) throw err;
    client
      .db("studentDetail")
      .collection("users")
      .findOne({ email: req.body.email }, (err, data) => {
        if (err) throw err;
        if (data) {
          bcrypt.compare(req.body.password, data.password, (err, validUser) => {
            if (err) throw err;
            console.log("validUser", validUser);
            if (validUser) {
              res.status(200).json({ message: "Login success..!!" });
            } else {
              res
                .status(403)
                .json({ message: "Bad Credentials, Login unsuccessful..!!" });
            }
          });
        } else {
          res.status(401).json({
            message: "Email is not registered, Kindly register it..!!",
          });
        }
      });
  });
});
