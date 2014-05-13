/*
 * GET home page.
 */
var groups = require('../custom_modules/groups');
var users = require('../custom_modules/users');
var redis = require("redis");
var client = redis.createClient();
console.log(exports);
exports.groups = function(req, res) {
  groups.getGroups(req, res, function(data) {
    res.writeHead(200, {"Content-Type": "application/json"});
	  res.end(JSON.stringify(data));
  });
}

exports.groupsById = function(req, res) {
  var groupId = req.params.groupId;
  var groupKey = 'groups:9650594146:' + groupId +  ':members';
  client.sort(groupKey, "ALPHA", "DESC", "GET", "*->name", "GET", "*->phone",  function(err, data) {
    res.writeHead(200, {"Content-Type": "application/json"});
	  res.end(JSON.stringify(data));
  });
}