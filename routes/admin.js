var express = require('express');
var router = express.Router();
var db = require('../src/server/firebase');

/* GET home page. */
router.get('/', function (req, res, next) {
  let data = '';

  // Firebaseからデータ取得
  db.collection('controls').doc('main').get().then(doc => {
    doc.exists ? data = doc.data() : console.log('404');
    res.render('admin', { firebaseData: JSON.stringify(data) });
  }).catch(error => {
    console.log(`データを取得できませんでした (${error})`);
  });
});

module.exports = router;
