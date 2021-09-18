var express = require('express');
var router = express.Router();
var db = require('../src/server/firebase');

router.post('/', function (req, res, next) {
  const id = req.body.id

  res.header('Content-Type', 'application/json; charset=utf-8')

  db.collection('users').where('id', '==', id).get().then(querySnapshot => {
    querySnapshot.forEach((doc) => {
      res.send({ status: "Succeed", data: doc.data() });
    });
  }).catch(() => {
    res.send({ status: "failed" });
  });
});

module.exports = router;
