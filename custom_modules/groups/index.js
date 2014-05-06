// groups module.

var redis = require("redis");
var client = redis.createClient();
var users = require('../users');
var currentUser = users.getCurrentUser();
var myGroups = [];

var Groups = {
	myGroups: [],
	getGroups: function(req, res, callback) {
		// Getting all keys for 
		client.smembers('groups:' + currentUser, function(err, data){
			callback(data);
		});
	},
	getGroupInfo: function(groupId, callback) {
		client.smembers('groups:' + currentUser + ':' + groupId + ':Members', function(err, data){
			for (key in data) {
				console.log(data[key]);
			}
		});
	},
	create: function(group, req, res) {
		// Fetching the current groupid.
		var group_count = client.get('groups:gids', function(err, count) {
			if (err) {
				return -1;
			}
			return count;
		});

		// If a group is
		if (!this.isExisting(group)) {
			client.incr("groups:gids");
			group_count += 1;
			console.log(group);
			client.set("groups:group:" + group.group + ":name", group.group);

			res.redirect("http://localhost:3000/groups");

		} else {
			res.render('./groups/create', {
				error : "Group is already exists."
			});
		}
	}
	
};

module.exports = Groups;