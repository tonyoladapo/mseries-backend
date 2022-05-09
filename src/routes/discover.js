const express = require("express");
const discoverController = require("../controllers/discover/discover");
const discoverMoreController = require("../controllers/discover/discoverMore");

const router = express.Router();

router.get("/category", discoverMoreController);
router.post("/", discoverController);

module.exports = router;
