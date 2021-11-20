const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { userDB } = require('../../../db');

module.exports = async (req, res) => {

  try {
    const resUser = {
        id: req.user.id,
        nickname: req.user.nickname,
        profileImage: req.user.profileImage 
      }
      
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_ONE_USER_BY_TOKEN_SUCCESS, {user: resUser}));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  }
};
