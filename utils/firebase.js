// ------------------------- firebase configuration -------------------------
const admin = require('firebase-admin');
const serviceAccount = require('./taxiservice-3547e-firebase-adminsdk-ssw91-ab8428e8b5');
// --------------------------------------------------------------------------

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://taxiservice-3547e.appspot.com'
});

// Get a reference to the Firebase Storage bucket
const bucket = admin.storage().bucket();

module.exports = bucket;
