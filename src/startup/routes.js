const express = require("express");

const discover = require("../routes/discover");

module.exports = (app) => {
  app.use(express.json());

  //routes
  app.use("/api/v1/discover", discover);

  //error handling middleware
  app.use((err, req, res, next) => {
    res.json(err);
  });
};
