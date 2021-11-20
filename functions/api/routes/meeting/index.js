const express = require('express');
const { checkUser } = require('../../../middlewares/auth');
const router = express.Router();

router.post('/:meetingId', checkUser, require('./meetingParticipatePOST'));

module.exports = router;
