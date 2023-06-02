const express = require("express");
const serverless = require("serverless-http");
const app = express();
const port = 3003;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/:id", function (req, res) {
  res.send(req.params);
});

if (process.env.ENVIRONMENT === "production") {
  module.exports.handler = serverless(app);
} else {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}
