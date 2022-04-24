const express = require("express");
const syncController = require("../controllers/sync/sync");

const router = express.Router();

router.post("/", syncController);

module.exports = router;
