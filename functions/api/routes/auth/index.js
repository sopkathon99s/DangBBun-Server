const express = require('express');
const router = express.Router();

router.post('/signin', require('./authSignInPOST'));

module.exports = router;
