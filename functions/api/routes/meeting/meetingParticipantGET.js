const _ = require('lodash');
const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { meetingDB, userDB } = require('../../../db');

// statusCode
// 0. 참여 성공
// 1. 참여 취소 성공
// 2. 인원 꽉참
// 3. 모집중인 뻔개가 아님

module.exports = async (req, res) => {
  const { meetingId }  = req.params;
  const user = req.user;

  if (!meetingId) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));

  let client;

  try {
    client = await db.connect(req);

    const participations = await meetingDB.getParticipatedMeetings(client, user.id);
    
    const meetingIds = [...new Set(participations.map((o) => o.meetingId).filter(Boolean))]; // [1, 2, 4, 5]
    const meetings = await meetingDB.getMeetingsByIds(client, meetingIds)

    const participationsForTheMeeting = await meetingDB.getParticipantsByMeetingIds(client, meetingIds);


    const userIds = [...new Set(participationsForTheMeeting.map((o) => o.userId).filter(Boolean))]; // [1, 2, 4, 5]
    const usersInTheMeeting = await userDB.getUserByIds(client, userIds)

    for (let i=0; i<participationsForTheMeeting.length; i++){
        participationsForTheMeeting[i].user = _.find(usersInTheMeeting, o => o.id === participationsForTheMeeting[i].userId)
    }

    for (let i = 0; i < meetings.length; i++){
        meetings[i].users= _.filter(participationsForTheMeeting, o => o.meetingId === meetings[i].id).map(o => o.user)
        

    }

      res.status(statusCode.BAD_REQUEST).send(util.success(statusCode.OK, responseMessage.MEETING_FULL,  meetings));

    
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
