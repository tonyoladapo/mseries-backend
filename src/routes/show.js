const express = require("express");
const { unwatchedController, syncController } = require("../controllers/show");

const router = express.Router();

router.get("/unwatched/:showId", unwatchedController);
router.get("/sync", syncController);

module.exports = router;
