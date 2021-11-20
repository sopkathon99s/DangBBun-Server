const _ = require('lodash');
const convertSnakeToCamel = require('../lib/convertSnakeToCamel');



const getUserSignIn = async (client, id, password) => {
    const { rows } = await client.query(
      `
      SELECT * FROM "user" u
      WHERE login_id = $1
        AND password = $2
      `,
      [id, password],
    );

    return convertSnakeToCamel.keysToCamel(rows[0]);
  };
  
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
  

module.exports = {addMeeting };
