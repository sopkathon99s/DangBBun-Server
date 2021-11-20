const express = require('express');

const { checkUser } = require('../../../middlewares/auth');
const router = express.Router();

router.post('/:meetingId', checkUser, require('./meetingParticipatePOST'));
router.post('', require('./meetingPost'));
router.get('/:meetingId', checkUser, require('./meetingParticipantGET'));
module.exports = router;

