const express = require('express');
const { checkUser } = require('../../../middlewares/auth');
const router = express.Router();

router.post('/signin', require('./authSignInPOST'));
router.get('/user', checkUser, require('./authUserGET'));

module.exports = router;
