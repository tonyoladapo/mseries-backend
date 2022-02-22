const express = require("express");
const { showDetailsController } = require("../controllers/show");

const router = express.Router();

router.get("/details/:showId", showDetailsController);

module.exports = router;
