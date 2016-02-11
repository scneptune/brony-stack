var express = require('express');
var router = express.Router();
var hbs = require('hbs');
console.log(__dirname + '/views/partials')
hbs.registerPartials(__dirname + '/views/partials');

router.get('/', function (req, res) {
  res.render('index');
});



module.exports = router;
