const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

require("./routes")(app);

module.exports = app;
