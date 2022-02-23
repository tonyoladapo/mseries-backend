const express = require("express");
const { unwatchedController } = require("../controllers/show");

const router = express.Router();

router.get("/unwatched/:showId", unwatchedController);

module.exports = router;
