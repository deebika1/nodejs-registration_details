const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

let userDetails = [];

app.listen(3000, () => {
  console.log("your app is running in 3000");
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/users", (req, res) => {
  res.json(userDetails);
});

app.post("/users", (req, res) => {
  userDetails.push(req.body);
  res.json({
    message: "User Created..!!",
  });
});
