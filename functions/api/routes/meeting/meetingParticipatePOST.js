const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { meetingDB } = require('../../../db');

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

    const participation = await meetingDB.participateMeeting(client, user.id, meetingId);
    
    const meeting = participation.meeting;

    const participants = meeting.map((member) => {
      const user = {
        userId: member.userId,
        nickname: member.nickname,
        profileImage: member.profileImage
      }
      return user;
    });

    const resMeeting = {
      meetingId: meeting[0].id,
      title: meeting[0].title,
      meetingDate: meeting[0].meetingDate,
      minMember: meeting[0].minMember,
      maxMember: meeting[0].maxMember,
      description: meeting[0].description,
      location: meeting[0].location,
      deadline: meeting[0].deadline,
      isAnonymous: meeting[0].isAnonymous,
      participants
    }

    if(participation.statusCode === 0) {
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.PARTICIPATE_MEETING_SUCCESS,  resMeeting));
    }
    else if (participation.statusCode === 1){
      res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.UNPARTICIPATE_MEETING_SUCCESS,  resMeeting));
    }
    else if (participation.statusCode === 2){
      res.status(statusCode.BAD_REQUEST).send(util.success(statusCode.BAD_REQUEST, responseMessage.MEETING_FULL,  resMeeting));
    }
    
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
