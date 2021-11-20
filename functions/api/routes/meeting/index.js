const express = require('express');

const { checkUser } = require('../../../middlewares/auth');
const router = express.Router();

router.post('/:meetingId', checkUser, require('./meetingParticipatePOST'));
router.post('', checkUser, require('./meetingPost'));

module.exports = router;

