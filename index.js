const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const mongodb = require('mongodb');

const app = express();

app.use(bodyParser.json());

app.use(cors({
    origin: '*'
}));


const port = process.env.PORT || 5000;

let userDetails = [
  {
    id: 1,
    name: "Person 1",
  },
  {
    id: 2,
    name: "Person 2",
  },
  {
    id: 3,
    name: "Person 3",
  },
  {
    id: 4,
    name: "Person 4",
  },
  {
    id: 5,
    name: "Person 5",
  },
];

app.listen(port, () => console.log("your app is running in", port));

app.get("/", (req, res) => {
  res.send("<h1>Simple GET & POST request app..! </h1>");
});

app.get("/users", (req, res) => {
  res.json(userDetails);

  // res.json()
  // res.send()
});

app.post("/users", (req, res) => {
  userDetails.push(req.body);
  res.json({
    message: "User Created..!!",
  });
});

app.put("/users/:id", (req, res) => {
  console.log(req.params.id);
  userDetails.forEach((elem) => {
    if (elem.id == req.params.id) {
      elem.name = req.body.name;
      res.status(200).send({
        message: "User Updated..!",
      });
    } else {
      res.send({
        message: "Invalid id",
      });
    }
  });
});

app.delete("/users/:id", (req, res) => {
  console.log(req.params.id);

  let filterVal = userDetails.filter((elem) => {
    if (elem.id == req.params.id) {
      return elem;
    }
  })[0];
  
  let index = userDetails.indexOf(filterVal);
  userDetails.splice(index, 1);

  // //use it if needed
  // userDetails = filterVal;
  // delete userDetails[index];
  res.send(userDetails);
});
