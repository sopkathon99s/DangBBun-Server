const express = require("express");
const router = express.Router();


router.use("/auth", require("./auth"));
router.use("/meeting", require("./meeting"));


module.exports = router;
