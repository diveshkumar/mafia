/*
 * GET home page.
 */
var groups = require('../custom_modules/groups');
var users = require('../custom_modules/users');

exports.list = function(req, res) {
	res.render('./groups/list', {
		title : 'My Groups'
	});
};

exports.create = function(req, res) {
	res.render('./groups/create', {
		title : 'Add Group'
	});
};

exports.modify = function(req, res) {
	groups.create(req.body, req, res);
};

exports.remove = function(req, res) {
	groups.create(req.body, req, res);
};

exports.getGroups = function(req, res) {
	return groups.getGroups();
}
