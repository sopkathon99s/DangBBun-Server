const express = require('express');
const router = express.Router();

const { checkUser } = require('./../../../middlewares/auth');

router.post('', require('./meetingPost'));

module.exports = router;