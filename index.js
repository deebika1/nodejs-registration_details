const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

let userDetails = [];

app.listen(port, () => {
  console.log("your app is running in", port);
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
