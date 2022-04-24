const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

require("./routes")(app);

module.exports = app;
