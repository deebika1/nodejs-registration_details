const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

let userDetails = [
  {
    id: 1,
    name: "venkat",
  },
];

app.listen(port, () => console.log("your app is running in", port));

app.get("/", (req, res) => {
  res.send("<h1>Simple GET & POST request app..! </h1>");
});

app.get("/users", (req, res) => {
  res.status(200).send(userDetails);
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

// app.delete();
