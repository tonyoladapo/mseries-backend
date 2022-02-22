const express = require("express");

const discover = require("../routes/discover");
const show = require("../routes/show");

module.exports = (app) => {
  app.use(express.json());

  //routes
  app.use("/api/v1/discover", discover);
  app.use("/api/v1/show", show);

  //error handling middleware
  app.use((err, req, res, next) => {
    res.json(err);
  });
};
