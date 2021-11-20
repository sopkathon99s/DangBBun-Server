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
  const user = req.user;
  if (!user) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));

  let client;

  try {
    client = await db.connect(req);

    // 로그인한 유저와 유저id가 같은 참여 가져오기
    // 로그인한 유저가 어디에 참여했는지 2
    const participations = await meetingDB.getParticipatedMeetings(client, user.id);
    
    // meeting id가 없는 값 제거
    // 로그인한 유저가 어디에 참여했는지
    const meetingIds = [...new Set(participations.map((o) => o.meetingId).filter(Boolean))]; // [1, 2, 4, 5]
    // 로그인한 유저가 참여한 미팅
    const meetings = await meetingDB.getMeetingsByIds(client, meetingIds)

    // 로그인한 유저가 참여한 미팅에 참여한 모든 참여 정보
    const participationsForTheMeeting = await meetingDB.getParticipantsByMeetingIds(client, meetingIds);


    const userIds = [...new Set(participationsForTheMeeting.map((o) => o.userId).filter(Boolean))]; // [1, 2, 4, 5]
    // 해당 미팅에 있는 유저 정보 구하기
    const usersInTheMeeting = await userDB.getUserByIds(client, userIds)

    for (let i=0; i<participationsForTheMeeting.length; i++){
        participationsForTheMeeting[i].user = _.find(usersInTheMeeting, o => o.id === participationsForTheMeeting[i].userId)
    }

    for (let i = 0; i < meetings.length; i++){
        meetings[i].users= _.filter(participationsForTheMeeting, o => o.meetingId === meetings[i].id).map(o => o.user)
        

    }


    // 로그인안한 유저가 어디에 참여했는지
    const participations2 = await meetingDB.getNotParticipatedMeetings(client, user.id);
    

    // 로그인 안한 유저가 어디에 참여했는지
    const meetingIds2 = [...new Set(participations2.map((o) => o.meetingId).filter(Boolean))]; // [1, 2, 4, 5]
    // 로그인 안한 유저가 참여한 미팅
    const meetings2 = await meetingDB.getOpenMeetingsByIds(client, meetingIds2)

    // 로그인 안한 유저가 참여한 미팅에 참여한 모든 참여 정보
    const participationsForTheMeeting2 = await meetingDB.getParticipantsByMeetingIds(client, meetingIds2);


    const userIds2 = [...new Set(participationsForTheMeeting2.map((o) => o.userId).filter(Boolean))]; // [1, 2, 4, 5]
    // 해당 미팅에 있는 유저 정보 구하기
    const usersInTheMeeting2 = await userDB.getUserByIds(client, userIds2)

    for (let i=0; i<participationsForTheMeeting2.length; i++){
        participationsForTheMeeting2[i].user = _.find(usersInTheMeeting2, o => o.id === participationsForTheMeeting2[i].userId)
    }

    for (let i = 0; i < meetings2.length; i++){
        meetings2[i].users= _.filter(participationsForTheMeeting2, o => o.meetingId === meetings2[i].id).map(o => o.user)
    }


    // isParticipated 추가
    for (let i = 0; i < meetings.length; i++){
        meetings[i].isParticipated=true;
    }

    for (let i = 0; i < meetings2.length; i++){
        meetings2[i].isParticipated=false;
    }

    // 두 배열 합치기
    let allMeetings = meetings.concat(meetings2)

    // deadline 기준으로 정렬
    allMeetings.sort(function (a, b) { 
        return a.deadline < b.deadline ? -1 : a.deadline > b.deadline ? 1 : 0;  
    });
    

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_OPEN_MEETING_SUCCESS,  allMeetings));

    
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
