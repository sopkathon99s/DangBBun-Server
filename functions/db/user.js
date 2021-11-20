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
  
  const getUserById = async (client, id) => {
    const { rows } = await client.query(
      `
      SELECT * FROM "user" u
      WHERE login_id = $1
      `,
      [id],
    );

    return convertSnakeToCamel.keysToCamel(rows[0]);
  };
  

module.exports = { getUserById, getUserSignIn };
