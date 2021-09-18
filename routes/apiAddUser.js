var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var db = require('../src/server/firebase');

router.post('/', function (req, res, next) {
  const date = new Date();
  const name = req.body.name
  const plainText = `${date}${name}`
  const hash = crypto.createHash('sha256').update(plainText).digest('hex');
  const addData = {
    id: hash,
    name: name,
    AC: 0,
    WA: 0,
  };

  res.header('Content-Type', 'application/json; charset=utf-8')

  db.collection('users').add(addData).then(() => {
    res.send({ status: "Succeed", id: hash, name: name });
  }).catch(() => {
    res.send({ status: "failed" });
  });
});

module.exports = router;
