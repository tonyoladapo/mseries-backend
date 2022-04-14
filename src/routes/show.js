const express = require("express");
const { unwatchedController, syncController } = require("../controllers/show");
const addController = require("../controllers/show/addController");
const detailsController = require("../controllers/show/detailsController");
const progressController = require("../controllers/show/progressController");

const router = express.Router();

router.get("/:showId", detailsController);
router.get("/:showId/progress", progressController);
router.get("/add/:showId", addController);
// router.get("/unwatched/:showId", unwatchedController);
// router.get("/sync", syncController);

module.exports = router;
