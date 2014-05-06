/*
 * GET users listing.
 */
var user = require('../custom_modules/users');

exports.list = function(req, res) {
	res.send("respond with a resource");
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