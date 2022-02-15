const express = require("express");
const { discoverController } = require("../controllers/discover");

const router = express.Router();

router.get("/", discoverController);

module.exports = router;