var express = require('express');

var routes = function() {
  var router = express.Router();
  router.get('foo', function(req, res) {
    res.send('foo');
  });
  router.get('bar', function(req, res) {
    res.send('bar');
  });
}
module.exports = routes;
