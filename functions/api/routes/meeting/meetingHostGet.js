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

    const participationsOPEN = await meetingDB.getParticipatedMeetingsOPEN(client, user.id, "OPEN");
    
    console.log("participationsOPEN:", participationsOPEN);
    const meetingIdsOPEN = [...new Set(participationsOPEN.map((o) => o.meetingId).filter(Boolean))]; // [1, 2, 4, 5]

    console.log("meetingIdsOPEN",meetingIdsOPEN);
    const meetingsOPEN = await meetingDB.getMeetingsByIds(client, meetingIdsOPEN)

    const participationsForTheMeetingOPEN = await meetingDB.getParticipantsByMeetingIds(client, meetingIdsOPEN);


    const userIdsOPEN = [...new Set(participationsForTheMeetingOPEN.map((o) => o.userId).filter(Boolean))]; // [1, 2, 4, 5]
    const usersInTheMeetingOPEN = await userDB.getUserByIds(client, userIdsOPEN)

    for (let i=0; i<participationsForTheMeetingOPEN.length; i++){
        participationsForTheMeetingOPEN[i].user = _.find(usersInTheMeetingOPEN, o => o.id === participationsForTheMeetingOPEN[i].userId)
    }

    for (let i = 0; i < meetingsOPEN.length; i++){
        meetingsOPEN[i].users= _.filter(participationsForTheMeetingOPEN, o => o.meetingId === meetingsOPEN[i].id).map(o => o.user)
    }

    const participationsNOTOPEN = await meetingDB.getParticipatedMeetingsNOTOPEN(client, user.id, "OPEN");
    
    const meetingIdsNOTOPEN = [...new Set(participationsNOTOPEN.map((o) => o.meetingId).filter(Boolean))]; // [1, 2, 4, 5]
    const meetingsNOTOPEN = await meetingDB.getMeetingsByIds(client, meetingIdsNOTOPEN)

    const participationsForTheMeetingNOTOPEN = await meetingDB.getParticipantsByMeetingIds(client, meetingIdsNOTOPEN);


    const userIdsNOTOPEN = [...new Set(participationsForTheMeetingNOTOPEN.map((o) => o.userId).filter(Boolean))]; // [1, 2, 4, 5]
    const usersInTheMeetingNOTOPEN = await userDB.getUserByIds(client, userIdsNOTOPEN)

    for (let i=0; i<participationsForTheMeetingNOTOPEN.length; i++){
        participationsForTheMeetingNOTOPEN[i].user = _.find(usersInTheMeetingNOTOPEN, o => o.id === participationsForTheMeetingNOTOPEN[i].userId)
    }

    for (let i = 0; i < meetingsNOTOPEN.length; i++){
        meetingsNOTOPEN[i].users= _.filter(participationsForTheMeetingNOTOPEN, o => o.meetingId === meetingsNOTOPEN[i].id).map(o => o.user)
    }
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.PARTICIPATED_MEETING_GET_SUCCESS,  {OPEN: meetingsOPEN, notOPEN: meetingsNOTOPEN}));

    
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
