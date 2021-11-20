const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');


const participateMeeting = async (client, userId, meetingId) => {
  let statusCode = 0;
  let isFull = false;
  const { rows: checkMemberCount } = await client.query(
    `
    SELECT * FROM "participation" p
    WHERE meeting_id = $1
        AND p.is_deleted = false
    `,
    [meetingId],
  );

  const { rows: checkMeeting } = await client.query(
    `
    SELECT * FROM "meeting" m
    WHERE id = $1
      AND is_deleted = false
    `,
    [meetingId],
  );

  const memberCount = checkMemberCount.length;
  console.log("memberCount",memberCount);

  const maxMember = checkMeeting[0].max_member;
  console.log("maxMember", maxMember);

  if(maxMember <= memberCount) {
    isFull = true;
  }

  const { rows: existingRows } = await client.query(
    `
    SELECT * FROM "participation" p
    WHERE user_id = $1
        AND meeting_id = $2
    `,
    [userId, meetingId],
  );

  if (existingRows.length === 0) {
    if(isFull) {
      statusCode = 2;
      const { rows } = await client.query(
        `
        SELECT * FROM "participation" p
        INNER JOIN "user" u
        ON p.user_id = u.id
        INNER JOIN "meeting" m
        ON p.meeting_id = m.id
        WHERE p.meeting_id = $1 AND p.is_deleted = false
        `,
        [meetingId],
      );
      return {statusCode, meeting: convertSnakeToCamel.keysToCamel(rows)};
    }

    await client.query(
      `
      INSERT INTO participation
      (user_id, meeting_id)
      VALUES
      ($1, $2)
      RETURNING *
      `,
      [userId, meetingId],
    );
  }
  else {
    if(existingRows[0].is_deleted && isFull) {
      statusCode = 2;
      const { rows } = await client.query(
        `
        SELECT * FROM "participation" p
        INNER JOIN "user" u
        ON p.user_id = u.id
        INNER JOIN "meeting" m
        ON p.meeting_id = m.id
        WHERE p.meeting_id = $1 AND p.is_deleted = false
        `,
        [meetingId],
      );
      return {statusCode, meeting: convertSnakeToCamel.keysToCamel(rows)};
    }

    const { rows: checkRows} = await client.query(
      `
      UPDATE "participation" p
      SET is_deleted = $2, updated_at = now()
      WHERE id = $1
      RETURNING * 
      `,
      [existingRows[0].id, existingRows[0].is_deleted? false:true],
    );

    if(checkRows[0].is_deleted) {
      statusCode = 1;
    }
  }

  const { rows } = await client.query(
    `
    SELECT * FROM "participation" p
    INNER JOIN "user" u
    ON p.user_id = u.id
    INNER JOIN "meeting" m
    ON p.meeting_id = m.id
    WHERE p.meeting_id = $1 AND p.is_deleted = false
    `,
    [meetingId],
  );
  return {statusCode, meeting: convertSnakeToCamel.keysToCamel(rows)};
};

// const participateMeeting = async (client, userId, meetingId) => {
//   const { rows } = await client.query(
//     `
//     INSERT INTO participation
//     (user_id, meeting_id)
//     VALUES
//     ($1, $2)
//     RETURNING *
//     `,
//     [userId, meetingId],
//   );

  
//   return convertSnakeToCamel.keysToCamel(rows[0]);
// };

// const unparticipateMeeting = async (client, userId, meetingId) => {
//   const { rows } = await client.query(
//     `
//     UPDATE participation
//     (user_id, meeting_id)
//     VALUES
//     ($1, $2)
//     RETURNING *
//     `,
//     [userId, meetingId],
//   );
//   return convertSnakeToCamel.keysToCamel(rows[0]);
// };
/*----------------------------------------------------------------
"data": {
        "id": 3,
        "userId": 2,
        "isHost": false,
        "createdAt": "2021-11-21T02:02:17.000Z",
        "updatedAt": "2021-11-21T02:02:20.812Z",
        "isDeleted": false,
        "meetingId": 3,
        "loginId": "sopt",
        "password": "sopt",
        "profileImage": null,
        "nickname": "솝트짱",
        "phone": "010-1234-1234",
        "title": "박건영의 풀스택 강의",
        "meetingDate": "2021-11-24T21:00:00.000Z",
        "minMember": 4,
        "maxMember": 6,
        "description": "웹 풀스택, vscode를 뜯어본 찐개발자 박건영의 웹 강의!! ",
        "location": "홍대입구역 2번출구",
        "deadline": "2021-11-24T09:00:00.000Z",
        "isAnonymous": false,
        "currentMember": 3,
        "state": "OPEN"
    }
*/
const getMeetingById = async(client, meetingId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "participation" p
    INNER JOIN "user" u
    ON p.user_id = u.id
    INNER JOIN "meeting" m
    ON p.meeting_id = m.id
    WHERE meeting_id = $1
    `,
    [meetingId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
}


  const addMeeting = async (client, title, meetingDate, minMember, maxMember, description, location, deadline, isAnonymous, userId) => {
    const { rows } = await client.query(
      `
      INSERT INTO meeting
      (title, meeting_date, min_member, max_member, description, location, deadline, is_anonymous, user_id)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
      `,
      [title, meetingDate, minMember, maxMember, description, location, deadline, isAnonymous, userId],
    );
    return convertSnakeToCamel.keysToCamel(rows[0]);
  };
  

module.exports = {addMeeting, participateMeeting, getMeetingById };
