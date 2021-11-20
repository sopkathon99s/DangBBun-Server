const express = require('express');

const { checkUser } = require('../../../middlewares/auth');
const router = express.Router();
router.get('/host', checkUser, require('./meetingHostGET'));
router.get('/participant', checkUser, require('./meetingParticipantGET'));
router.post('', checkUser, require('./meetingPost'));
router.post('/:meetingId', checkUser, require('./meetingParticipatePOST'));
router.get('', checkUser, require('./meetingGET'));


module.exports = router;

