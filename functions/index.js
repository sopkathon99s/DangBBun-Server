const admin = require("firebase-admin");
const serviceAccount = require("./joint-seminar15-e35f5-firebase-adminsdk-yzihl-c8030dfa60");
const dotenv = require("dotenv");

dotenv.config();

let firebase;
if (admin.apps.length === 0) {
  firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  firebase = admin.app();
}

module.exports = {
  api: require("./api"),
};