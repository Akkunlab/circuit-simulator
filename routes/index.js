var express = require('express');
var router = express.Router();
var db = require('../src/server/firebase');

/* GET home page. */
router.get('/', async function (req, res, next) {

  // Firebaseからデータ取得
  const snapShot = await db.collection('problems').orderBy("id").get();
  const data = snapShot.docs.map(doc => {
    return doc.data();
  });

  res.render('index', { firebaseData: JSON.stringify(data) });
});

module.exports = router;
