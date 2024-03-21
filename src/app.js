const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rootRouter = require("./router");
const cors = require("cors"); // Require the cors middleware
const { initRedisClient } = require("../redis");


let app = express();
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true, limit: "16mb" }));
app.use(bodyParser.json({ limit: "16mb" }));

let port = process.env.PORT || 3001;

app.use(function (req, res, next) {
  req.env = process.env.ENV || "TEST";
  req.header("Content-Type", "application/json");
  req.header("Accept", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "PATCH,GET,PUT,DELETE,OPTIONS,POST"
  );
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/health", (req, res) => {
  res.send("Welcome to DAYBED-API!!!!");
});

// Configure CORS
app.use(cors()); // This allows all origins. You can configure more specific options if needed.

app.use("/", rootRouter);

app.listen(port, () => {
  console.log("Running on port:" + port);
});

module.exports = app;
