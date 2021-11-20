const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { meetingDB } = require('../../../db');

module.exports = async (req, res) => {
  const { title, meetingDate, minMember, maxMember, description, location, deadline, isAnonymous } = req.body;

  const user = req.user;
  if (!user) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));

//   console.log(title, meetingDate, minMember, maxMember, description, location, deadline, isAnonymous);
  if (!title || !meetingDate || !minMember || !maxMember || !location || !deadline || isAnonymous===undefined ) 
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const meeting = await meetingDB.addMeeting(client, title, meetingDate, minMember, maxMember, description, location, deadline, isAnonymous, user.id);
    const participation = await meetingDB.participateMeeting(client, user.id, meeting.id);
    res.status(statusCode.OK).send(util.success(statusCode.CREATED, responseMessage.ADD_MEETING_SUCCESS, meeting));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
