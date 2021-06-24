const firebaseAdmin = require('firebase-admin');
const firebaseConfig = require('../config/firebase-admin.config.json');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseConfig),
});

module.exports = {
  firebaseAdmin,
  db: firebaseAdmin.firestore(),
  auth: firebaseAdmin.auth(),
};
