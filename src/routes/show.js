const express = require("express");
const addController = require("../controllers/show/add");
const detailsController = require("../controllers/show/details");
const progressController = require("../controllers/show/progress");

const router = express.Router();

router.get("/:showId", detailsController);
router.get("/:showId/progress", progressController);
router.get("/add/:showId", addController);

module.exports = router;
