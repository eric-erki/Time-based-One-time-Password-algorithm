var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var date = new Date();
  console.log(date);
  res.render('index', { status: 1 });
});

module.exports = router;
