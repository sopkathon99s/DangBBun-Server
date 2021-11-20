const admin = require("firebase-admin");
const serviceAccount = require("./sopkathon-09-firebase-adminsdk-lgw1n-6146025649");
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