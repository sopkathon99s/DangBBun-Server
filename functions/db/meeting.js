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


const addMeeting = async (client, title, meetingDate, minMember, maxMember, description, location, deadline, isAnonymous) => {
  const { rows } = await client.query(
    `
    INSERT INTO meeting
    (title, meeting_date, min_member, max_member, description, location, deadline, is_anonymous)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
    `,
    [title, meetingDate, minMember, maxMember, description, location, deadline, isAnonymous],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const getParticipatedMeetings = async(client, userId) => {
  // const { rows } = await client.query(
  //   `
  //   SELECT * FROM "participation" p
  //   INNER JOIN "meeting" m
  //   ON p.meeting_id = m.id
  //   WHERE p.user_id = $1
  //     AND is_host = false
  //     AND p.is_deleted = false
  //     AND m.is_deleted = false
  //   ORDER BY m.meeting_date ASC
  //   `,
  //   [userId],
  // );

  const { rows } = await client.query(
    `
    SELECT * FROM "participation" p
    WHERE user_id = $1
    AND is_deleted = FALSE
    `,
    [userId],
  );


  return convertSnakeToCamel.keysToCamel(rows);
}

const getMeetingsByIds = async(client, meetingIds) => {
  const {rows } = await client.query(
    `
    SELECT * FROM meeting
    WHERE id IN (${meetingIds.join()})
    AND is_deleted = FALSE
    `
  ) 
  return convertSnakeToCamel.keysToCamel(rows);
 
}

const getParticipantsByMeetingIds = async(client, meetingIds) => {
  const { rows } = await client.query(
    `
    SELECT * FROM participation
    WHERE meeting_id IN (${meetingIds.join()})
    AND is_deleted = FALSE
    `,

  );

  return convertSnakeToCamel.keysToCamel(rows);
}


// userId가 관여하지 않는 참여 찾기
const getNotParticipatedMeetings = async(client, userId) => {
  const { rows } = await client.query(
    `
    SELECT * FROM "participation" p
    WHERE user_id != $1
    AND is_deleted = FALSE
    `,
    [userId],
  );


  return convertSnakeToCamel.keysToCamel(rows);
}

  // 마감 전 미팅 찾기
  const getOpenMeetingsByIds = async(client, meetingIds) => {
    const {rows } = await client.query(
      `
      SELECT * FROM meeting
      WHERE id IN (${meetingIds.join()})
      AND is_deleted = FALSE
      AND now() < deadline
      `
    ) 
    return convertSnakeToCamel.keysToCamel(rows);
   
  }  

module.exports = {addMeeting, participateMeeting, getMeetingById, getParticipatedMeetings,getMeetingsByIds, getParticipantsByMeetingIds, getNotParticipatedMeetings, getOpenMeetingsByIds };
