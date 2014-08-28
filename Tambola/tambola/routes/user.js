/*
 * GET users listing.
 */
var user = require('../custom_modules/users');
var redis = require("redis");
var client = redis.createClient();

exports.user = function(req, res) {
  var key = 'user:' + req.params.userId + ':information';
	client.hgetall(key, function(err, data) {
    res.writeHead(200, {"Content-Type": "application/json"});
	  res.end(JSON.stringify(data));
  });
};

exports.create = function(req, res) {
	user.create(req.body, req, res);
};
exports.modify = function(req, res) {
	// Creating a user.

};
exports.remove = function(req, res) {
	user.create(req.body, req, res);
};