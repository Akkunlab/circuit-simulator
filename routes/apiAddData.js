var express = require('express');
var router = express.Router();
var db = require('../src/server/firebase');

router.post('/', function (req, res, next) {
  const id = req.body.id;
  const addData = req.body.data;
  console.log(id, addData);

  res.header('Content-Type', 'application/json; charset=utf-8')

  db.collection('users').where('id', '==', id).get().then(querySnapshot => {
    querySnapshot.forEach((doc) => {
        db.collection('users').doc(doc.id).update(addData).then(() => {
          res.send({ status: "Succeed" });
        }).catch(error => {
          res.send({ status: "failed" });
        });	
    });
  }).catch(() => {
    res.send({ status: "failed" });
  });
});

module.exports = router;
