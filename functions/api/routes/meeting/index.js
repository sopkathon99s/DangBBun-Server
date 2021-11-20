const express = require('express');

const { checkUser } = require('../../../middlewares/auth');
const router = express.Router();

router.get('/:meetingId', checkUser, require('./meetingParticipantGET'));
router.post('', checkUser, require('./meetingPost'));

module.exports = router;

