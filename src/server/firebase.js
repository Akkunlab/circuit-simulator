var firebase = require("firebase/app");
require("firebase/firestore");
require('dotenv').config();

// firebase 設定
var firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENTID
};

// firebase 初期化
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

module.exports = db;