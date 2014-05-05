/*
 * GET home page.
 */
var groups = require('../groups');
var users = require('../users')
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

exports.savegroup = function(req, res) {
	groups.create(req.body, req, res);
};

exports.getGroups = function(req, res) {
	return groups.getGroups();
}
