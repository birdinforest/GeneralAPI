var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users:all listing. */
router.get('/all', function(req, res, next) {
  res.send([
    {
      id: 1,
      name: 'Sandy'
    },
    {
      id: 2,
      name: 'Derek'
    },
    {
      id: 3,
      name: 'Iris'
    },
    {
      id: 4,
      name: 'Tintin&Baybay'
    },
  ]);
});

module.exports = router;
